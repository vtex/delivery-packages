import './polyfills'

/** PRIVATE **/

function getItemIndex(item) {
  if (!item) {
    return -1
  }
  const index = item.index != null ? item.index : item.itemIndex
  return index != null ? index : -1
}

/** PUBLIC **/

export function getNewItems(items, changes) {
  if (!items || items.length === 0 || !changes || changes.length === 0) {
    return items || null
  }

  const addedSkusFromChanges = changes.reduce(
    (acc, change) => acc.concat(change.itemsAdded || []),
    []
  )

  const removedSkusFromChanges = changes
    .reduce((acc, change) => acc.concat(change.itemsRemoved || []), [])
    .map(item => ({
      ...item,
      // Change removedItems to negative quantity so we can sum it later
      quantity: item.quantity * -1,
    }))

  const itemsChanged = [...addedSkusFromChanges, ...removedSkusFromChanges]

  return items.reduce((acc, item) => {
    const itemChanges = itemsChanged.filter(
      changedItem => changedItem.id === item.id
    )

    const newItem = itemChanges.reduce(
      (newItem, changedItem) => ({
        ...newItem,
        quantity: newItem.quantity + changedItem.quantity,
      }),
      item
    )

    if (newItem.quantity <= 0) return acc

    return acc.concat(newItem)
  }, [])
}

/* params: { items, packages } */
export function getDeliveredItems(params) {
  if (!params || !params.items) {
    return null
  }

  const { items, packages } = params

  const deliveredItems = items.reduce(
    (groups, item) => {
      const packagesWithItem =
        packages &&
        packages.filter(pack =>
          pack.items.some(packageItem => packageItem.itemIndex === item.index)
        )

      if (packagesWithItem.length === 0) {
        groups.toBeDelivered = groups.toBeDelivered.concat({
          item,
        })

        return groups
      }

      const quantityInPackages = packagesWithItem.reduce((total, pack) => {
        const packageItem = pack.items.find(
          packageItem => packageItem.itemIndex === item.index
        )

        return total + packageItem.quantity
      }, 0)

      const packageDeliveredAllItems = quantityInPackages === item.quantity
      const quantityLeftToDeliver = item.quantity - quantityInPackages

      if (packageDeliveredAllItems === false && quantityLeftToDeliver > 0) {
        groups.toBeDelivered = groups.toBeDelivered.concat({
          item: { ...item, quantity: quantityLeftToDeliver },
        })
      }
      const delivered = packagesWithItem.map(pack => {
        const packageItem = pack.items.find(
          packageItem => packageItem.itemIndex === item.index
        )

        return {
          package: pack,
          item: { ...item, quantity: packageItem.quantity },
        }
      })

      groups.delivered = groups.delivered.concat(delivered)

      return groups
    },
    { delivered: [], toBeDelivered: [] }
  )

  return deliveredItems
}

export function getItemsIndexes(items) {
  if (!items || items.length === 0) {
    return {
      indexes: [],
      otherIndexes: [],
      indexesMap: {},
      maxIndex: -1,
    }
  }

  const indexesMap = {}
  const indexes = []
  const otherIndexes = []
  let maxIndex = 0

  items.forEach(item => {
    const itemIndex = getItemIndex(item)
    maxIndex = Math.max(maxIndex, itemIndex)
    if (itemIndex !== -1) {
      indexesMap[itemIndex] = item
      indexes.push(itemIndex)
    }
  })

  for (let index = 0; index < maxIndex; index++) {
    if (!indexesMap[index]) {
      otherIndexes.push(index)
    }
  }

  return {
    indexes,
    otherIndexes,
    indexesMap,
    maxIndex,
  }
}

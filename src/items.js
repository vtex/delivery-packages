export function getNewItems(items, changes) {
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

export function getDeliveredItems({ items, packages }) {
  const deliveredItems = items.reduce(
    (groups, item, index) => {
      const packagesWithItem = packages.filter(pack =>
        pack.items.filter(item => item.itemIndex === index)[0]
      )

      if (packagesWithItem.length === 0) {
        groups.toBeDelivered = groups.toBeDelivered.concat({
          item,
        })

        return groups
      }

      const quantityInPackages = packagesWithItem.reduce((total, pack) => {
        const packageItem = pack.items.filter(
          packageItem => packageItem.itemIndex === item.index
        )[0]

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
        const packageItem = pack.items.filter(
          packageItem => packageItem.itemIndex === item.index
        )[0]

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

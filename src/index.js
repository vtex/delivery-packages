const {
  getShippingEstimateQuantityInSeconds,
} = require('@vtex/estimate-calculator')

const defaultCriteria = {
  slaOptions: false,
  selectedSla: true,
  seller: true,
  shippingEstimate: true,
  deliveryChannel: true,
}

module.exports = function(order, options = {}) {
  const { items = [], packageAttachment = {}, shippingData = {} } = order
  const criteria = Object.assign(
    {},
    defaultCriteria,
    options.criteria ? options.criteria : {}
  )

  const packages = packageAttachment && packageAttachment.packages
    ? packageAttachment.packages
    : []
  const logisticsInfo = shippingData && shippingData.logisticsInfo
    ? shippingData.logisticsInfo
    : []
  const selectedAddresses = shippingData && shippingData.selectedAddresses
    ? shippingData.selectedAddresses
    : []

  const itemsWithIndex = items.map((item, index) =>
    Object.assign({}, item, { index }))
  const packagesWithIndex = packages.map((pack, index) =>
    Object.assign({}, pack, { index }))

  const deliveredItems = getDeliveredItems({
    items: itemsWithIndex,
    packages: packagesWithIndex,
  })

  const enhancePackage = createEnhancePackageFn({
    logisticsInfo,
    selectedAddresses,
  })

  deliveredItems.delivered = deliveredItems.delivered.map(enhancePackage)
  deliveredItems.toBeDelivered = deliveredItems.toBeDelivered.map(
    enhancePackage
  )

  const deliveredPackages = groupPackages(deliveredItems.delivered, criteria)
  const toBeDeliveredPackages = groupDeliveries(
    deliveredItems.toBeDelivered,
    criteria
  )

  return deliveredPackages.concat(toBeDeliveredPackages)
}

function groupPackages(items, criteria) {
  return addToPackage(items, criteria, (packages, item) => {
    return packages.find(pack => pack.package.index === item.package.index)
  })
}

function groupDeliveries(items, criteria) {
  return addToPackage(items, criteria, (packages, item) => {
    return packages.find(pack => {
      if (
        criteria.shippingEstimate &&
        criteria.selectedSla &&
        pack.shippingEstimate !== item.shippingEstimate
      ) {
        return false
      }

      if (criteria.slaOptions) {
        const packSlas = pack.slas.reduce((acc, sla) => acc + sla.id, '')
        const itemSlas = item.slas.reduce((acc, sla) => acc + sla.id, '')

        if (packSlas !== itemSlas) {
          return false
        }
      }

      if (criteria.seller && pack.seller !== item.item.seller) {
        return false
      }

      if (criteria.selectedSla && pack.selectedSla !== item.selectedSla) {
        return false
      }

      if (
        criteria.deliveryChannel &&
        pack.deliveryChannel !== item.deliveryChannel
      ) {
        return false
      }

      return true
    })
  })
}

function addToPackage(items, criteria, fn) {
  return items.reduce(
    (packages, item) => {
      const pack = fn(packages, item)

      if (pack) {
        if (
          criteria.selectedSla &&
          getShippingEstimateQuantityInSeconds(pack.shippingEstimate) <
            getShippingEstimateQuantityInSeconds(item.shippingEstimate)
        ) {
          pack.shippingEstimate = item.shippingEstimate
          pack.shippingEstimateDate = item.shippingEstimateDate
        }

        if (!criteria.selectedSla) {
          pack.slas = pack.slas.concat(item.slas)
        }

        pack.items = pack.items.concat(item.item)
        return packages
      }

      const newPackage = Object.assign(
        {},
        {
          items: [item.item],
          package: item.package,
          slas: item.slas,
          pickupFriendlyName: criteria.selectedSla
            ? item.pickupFriendlyName
            : undefined,
          seller: criteria.seller ? item.item.seller : undefined,
          address: criteria.selectedSla ? item.address : undefined,
          selectedSla: criteria.selectedSla ? item.selectedSla : undefined,
          deliveryIds: item.deliveryIds,
          deliveryChannel: criteria.deliveryChannel
            ? item.deliveryChannel
            : undefined,
          shippingEstimate: criteria.selectedSla
            ? item.shippingEstimate
            : undefined,
          shippingEstimateDate: criteria.selectedSla
            ? item.shippingEstimateDate
            : undefined,
          item: undefined,
        }
      )

      return packages.concat(newPackage)
    },
    []
  )
}

function getDeliveredItems({ items, packages }) {
  const deliveredItems = items.reduce(
    (groups, item, index) => {
      const packagesWithItem = packages.filter(pack =>
        pack.items.find((item) => item.itemIndex === index))

      if (packagesWithItem.length === 0) {
        groups.toBeDelivered = groups.toBeDelivered.concat({
          item,
        })

        return groups
      }

      const quantityInPackages = packagesWithItem.reduce((total, pack) => {
        const packageItem = pack.items.find(packageItem =>
          packageItem.itemIndex === item.index
        )

        return total + packageItem.quantity
      }, 0)

      const packageDeliveredAllItems = quantityInPackages === item.quantity

      if (packageDeliveredAllItems === false) {
        const quantityLeftToDeliver = item.quantity - quantityInPackages

        groups.toBeDelivered = groups.toBeDelivered.concat({
          item: Object.assign({}, item, { quantity: quantityLeftToDeliver }),
        })
      }

      const delivered = packagesWithItem.map(pack => {
        const packageItem = pack.items.find(packageItem =>
          packageItem.itemIndex === item.index
        )

        return {
          package: pack,
          item: Object.assign({}, item, { quantity: packageItem.quantity }),
        }
      })

      groups.delivered = groups.delivered.concat(delivered)

      return groups
    },
    { delivered: [], toBeDelivered: [] }
  )

  return deliveredItems
}

function createEnhancePackageFn({ logisticsInfo, selectedAddresses }) {
  return pack => {
    const itemIndex = pack.item.index

    return Object.assign(
      {},
      pack,
      {
        address: getAddress({
          itemIndex,
          logisticsInfo,
          selectedAddresses,
        }),
        pickupFriendlyName: getPickupFriendlyName({
          itemIndex,
          logisticsInfo,
        }),
      },
      getLogisticsInfoData({
        itemIndex,
        logisticsInfo,
      })
    )
  }
}

function getAddress({ itemIndex, logisticsInfo, selectedAddresses }) {
  const selectedSla = getSelectedSla({
    itemIndex,
    logisticsInfo,
  })

  if (!selectedSla) return null

  if (selectedSla.deliveryChannel === 'pickup-in-point') {
    return getPickupAddress({ itemIndex, logisticsInfo })
  }

  const addressId = logisticsInfo[itemIndex].addressId
  return selectedAddresses.find(address => address.addressId === addressId)
}

function getLogisticsInfoData({ itemIndex, logisticsInfo }) {
  const selectedSla = getSelectedSla({
    itemIndex,
    logisticsInfo,
  })

  return {
    selectedSla: logisticsInfo[itemIndex].selectedSla,
    shippingEstimate: selectedSla ? selectedSla.shippingEstimate : undefined,
    shippingEstimateDate: logisticsInfo[itemIndex].shippingEstimateDate ? logisticsInfo[itemIndex].shippingEstimateDate : selectedSla ? selectedSla.shippingEstimateDate : undefined,
    deliveryChannel: logisticsInfo[itemIndex].selectedDeliveryChannel,
    deliveryWindow: logisticsInfo[itemIndex].deliveryWindow,
    deliveryIds: logisticsInfo[itemIndex].deliveryIds,
    slas: logisticsInfo[itemIndex].slas,
  }
}

function getPickupFriendlyName({ itemIndex, logisticsInfo }) {
  const sla = getSelectedSla({ itemIndex, logisticsInfo })
  return sla && sla.pickupStoreInfo ? sla.pickupStoreInfo.friendlyName : null
}

function getPickupAddress({ itemIndex, logisticsInfo }) {
  const sla = getSelectedSla({ itemIndex, logisticsInfo })
  return sla.pickupStoreInfo ? sla.pickupStoreInfo.address : null
}

function getSelectedSla({ itemIndex, logisticsInfo }) {
  const logisticInfo = logisticsInfo[itemIndex]
  const selectedSla = logisticInfo.selectedSla
  return logisticInfo.slas.find(sla => sla.id === selectedSla)
}

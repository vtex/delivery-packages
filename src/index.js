const {
  getShippingEstimateQuantityInSeconds,
} = require('@vtex/estimate-calculator')

module.exports = function(
  { items, packages, selectedAddresses, logisticsInfo }
) {
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

  const deliveredPackages = groupPackages(deliveredItems.delivered)
  const toBeDeliveredPackages = groupDeliveries(deliveredItems.toBeDelivered)

  return deliveredPackages.concat(toBeDeliveredPackages)
}

function groupPackages(items) {
  return addToPackage(items, (packages, item) => {
    return packages.find(pack => pack.package.index === item.package.index)
  })
}

function groupDeliveries(items) {
  return addToPackage(items, (packages, item) => {
    return packages.find(
      pack =>
        pack.shippingEstimate === item.shippingEstimate &&
        pack.selectedSla === item.selectedSla &&
        pack.deliveryChannel === item.deliveryChannel &&
        pack.address.addressId === item.address.addressId
    )
  })
}

function addToPackage(items, fn) {
  return items.reduce(
    (packages, item) => {
      const pack = fn(packages, item)

      if (pack) {
        if (
          getShippingEstimateQuantityInSeconds(pack.shippingEstimate) <
          getShippingEstimateQuantityInSeconds(item.shippingEstimate)
        ) {
          pack.shippingEstimate = item.shippingEstimate
          pack.shippingEstimateDate = item.shippingEstimateDate
        }

        pack.items = pack.items.concat(item.item)
        return packages
      }

      const newPackage = Object.assign({}, item, {
        items: [item.item],
        item: undefined,
      })

      return packages.concat(newPackage)
    },
    []
  )
}

function getDeliveredItems({ items, packages }) {
  const deliveredItems = items.reduce(
    (groups, item, index) => {
      const delivered = packages.findIndex(pack =>
        pack.items.find((_, itemIndex) => itemIndex === index))

      if (delivered !== -1) {
        groups.delivered = groups.delivered.concat({
          package: packages[delivered],
          item,
        })
        return groups
      }

      groups.toBeDelivered = groups.toBeDelivered.concat({
        item,
      })

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
  const addressId = logisticsInfo[itemIndex].addressId
  return selectedAddresses.find(address => address.addressId === addressId)
}

function getLogisticsInfoData({ itemIndex, logisticsInfo }) {
  return {
    selectedSla: logisticsInfo[itemIndex].selectedSla,
    shippingEstimate: logisticsInfo[itemIndex].shippingEstimate,
    shippingEstimateDate: logisticsInfo[itemIndex].shippingEstimateDate,
    deliveryChannel: logisticsInfo[itemIndex].deliveryChannel,
    deliveryWindow: logisticsInfo[itemIndex].deliveryWindow,
  }
}

function getPickupFriendlyName({ itemIndex, logisticsInfo }) {
  const logisticInfo = logisticsInfo[itemIndex]
  const selectedSla = logisticInfo.selectedSla
  const sla = logisticInfo.slas.find(sla => sla.id === selectedSla)
  return sla.pickupStoreInfo ? sla.pickupStoreInfo.friendlyName : null
}

// {
//   items: [],
//   package: { trackingNumber, trackingUrl, courierStatus, invoiceNumber }
//   address: {},
//   selectedSla: ''
//   deliveryChannel: ''
//   pickupFriendlyName: '',
//   shippingEstimate: '',
//   shippingEstimateDate: ''
// }

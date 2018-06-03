import { getSelectedSla } from './sla'

export function getLogisticsInfoData({ itemIndex, logisticsInfo }) {
  const selectedSla = getSelectedSla({
    itemIndex,
    logisticsInfo,
  })

  return {
    selectedSla: logisticsInfo[itemIndex].selectedSla,
    shippingEstimate: selectedSla ? selectedSla.shippingEstimate : undefined,
    deliveryWindow: selectedSla ? selectedSla.deliveryWindow : undefined,
    shippingEstimateDate: logisticsInfo[itemIndex].shippingEstimateDate
      ? logisticsInfo[itemIndex].shippingEstimateDate
      : selectedSla ? selectedSla.shippingEstimateDate : undefined,
    deliveryChannel: logisticsInfo[itemIndex].selectedDeliveryChannel
      ? logisticsInfo[itemIndex].selectedDeliveryChannel
      : selectedSla ? selectedSla.deliveryChannel : undefined,
    deliveryIds: logisticsInfo[itemIndex].deliveryIds,
    slas: logisticsInfo[itemIndex].slas,
  }
}

export function getPickupFriendlyName({ itemIndex, logisticsInfo }) {
  const sla = getSelectedSla({ itemIndex, logisticsInfo })
  return sla && sla.pickupStoreInfo ? sla.pickupStoreInfo.friendlyName : null
}

export function getPickupAddress({ itemIndex, logisticsInfo }) {
  const sla = getSelectedSla({ itemIndex, logisticsInfo })
  return sla.pickupStoreInfo ? sla.pickupStoreInfo.address : null
}

export function getAddress({ itemIndex, logisticsInfo, selectedAddresses }) {
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

export function hydratePackageWithLogisticsExtraInfo(
  pkg,
  logisticsInfo,
  selectedAddresses
) {
  const itemIndex = pkg.item.index

  return {
    ...pkg,
    address: getAddress({
      itemIndex,
      logisticsInfo,
      selectedAddresses,
    }),
    pickupFriendlyName: getPickupFriendlyName({
      itemIndex,
      logisticsInfo,
    }),
    ...getLogisticsInfoData({
      itemIndex,
      logisticsInfo,
    }),
  }
}

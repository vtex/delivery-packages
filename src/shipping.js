import { hasDeliveryWindow, getSelectedSla } from './sla'
import {
  filterSlaByAvailableDeliveryWindows,
  getFirstScheduledDelivery,
} from './scheduled-delivery'

export function getLogisticsInfoData({ itemIndex, logisticsInfo }) {
  if (!logisticsInfo || logisticsInfo.length === 0) {
    return null
  }

  const selectedSla = getSelectedSla({
    itemIndex,
    logisticsInfo,
  })

  return {
    selectedSla: logisticsInfo[itemIndex].selectedSla,
    shippingEstimate: selectedSla
      ? selectedSla.shippingEstimate
      : logisticsInfo[itemIndex].shippingEstimate
        ? logisticsInfo[itemIndex].shippingEstimate
        : undefined,
    deliveryWindow: selectedSla ? selectedSla.deliveryWindow : undefined,
    shippingEstimateDate: logisticsInfo[itemIndex].shippingEstimateDate
      ? logisticsInfo[itemIndex].shippingEstimateDate
      : selectedSla
        ? selectedSla.shippingEstimateDate
        : undefined,
    deliveryChannel: logisticsInfo[itemIndex].selectedDeliveryChannel
      ? logisticsInfo[itemIndex].selectedDeliveryChannel
      : selectedSla
        ? selectedSla.deliveryChannel
        : undefined,
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

  if (selectedSla && selectedSla.deliveryChannel === 'pickup-in-point') {
    return getPickupAddress({ itemIndex, logisticsInfo })
  }

  const addressId = logisticsInfo[itemIndex].addressId
  return selectedAddresses.filter(address => address.addressId === addressId)[0]
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

export function getNewLogisticsInfo(
  logisticsInfo,
  selectedSla,
  availableDeliveryWindows = null
) {
  selectedSla = selectedSla.id ? selectedSla.id : selectedSla

  if (!selectedSla || !logisticsInfo || logisticsInfo.length === 0) {
    return logisticsInfo
  }

  return logisticsInfo.map(li => {
    const selectedSlaObj = getSelectedSla({
      logisticsInfo,
      itemIndex: li.itemIndex,
      selectedSla,
    })

    if (
      !selectedSlaObj ||
      !filterSlaByAvailableDeliveryWindows(
        selectedSlaObj,
        availableDeliveryWindows
      )
    ) {
      return li
    }

    return {
      ...li,
      selectedSla,
      selectedDeliveryChannel: selectedSlaObj.deliveryChannel,
    }
  })
}

export function getNewLogisticsInfoWithSelectedScheduled(logisticsInfo) {
  if (!logisticsInfo || logisticsInfo.length === 0) {
    return null
  }

  let newLogisticsInfo = [...logisticsInfo]

  newLogisticsInfo.forEach(li => {
    const selectedSlaObj = getSelectedSla({
      logisticsInfo: newLogisticsInfo,
      itemIndex: li.itemIndex,
    })

    if (selectedSlaObj && hasDeliveryWindow(selectedSlaObj)) {
      return
    }

    const firstScheduledSla = getFirstScheduledDelivery(
      [li],
      li.availableDeliveryWindows
    )

    if (firstScheduledSla) {
      newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        firstScheduledSla,
        li.availableDeliveryWindows
      )
    }
  })

  return newLogisticsInfo
}
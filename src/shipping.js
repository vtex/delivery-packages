import './polyfills'
import { hasDeliveryWindow, getSelectedSla } from './sla'
import {
  filterSlaByAvailableDeliveryWindows,
  getFirstScheduledDelivery,
} from './scheduled-delivery'

/** PRIVATE **/

// params: { itemIndex, logisticsInfo }
export function getLogisticsInfoData(params) {
  if (!params || !params.logisticsInfo || params.logisticsInfo.length === 0) {
    return null
  }

  const { itemIndex, logisticsInfo } = params

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

function getPickupFriendlyName({ itemIndex, logisticsInfo }) {
  const sla = getSelectedSla({ itemIndex, logisticsInfo })
  return sla && sla.pickupStoreInfo ? sla.pickupStoreInfo.friendlyName : null
}

function getPickupAddress({ itemIndex, logisticsInfo }) {
  const sla = getSelectedSla({ itemIndex, logisticsInfo })
  return sla.pickupStoreInfo ? sla.pickupStoreInfo.address : null
}

function getAddress({ itemIndex, logisticsInfo, selectedAddresses }) {
  const selectedSla = getSelectedSla({
    itemIndex,
    logisticsInfo,
  })

  if (selectedSla && selectedSla.deliveryChannel === 'pickup-in-point') {
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
  if (
    !pkg ||
    !pkg.item ||
    !logisticsInfo ||
    logisticsInfo.length === 0 ||
    !selectedAddresses
  ) {
    return pkg || null
  }

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

/** PUBLIC **/

export function getNewLogisticsInfo(
  logisticsInfo,
  selectedSla,
  availableDeliveryWindows = null
) {
  selectedSla = selectedSla && selectedSla.id ? selectedSla.id : selectedSla

  if (!selectedSla || !logisticsInfo || logisticsInfo.length === 0) {
    return logisticsInfo || null
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

  const newLogisticsInfo = [...logisticsInfo]

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
      newLogisticsInfo[li.itemIndex] = getNewLogisticsInfo(
        logisticsInfo,
        firstScheduledSla,
        li.availableDeliveryWindows
      )[li.itemIndex]
    }
  })

  return newLogisticsInfo
}

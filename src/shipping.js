import './polyfills'
import { hasDeliveryWindows, getSelectedSla, getSlaAsId } from './sla'
import {
  filterSlaByAvailableDeliveryWindows,
  getFirstScheduledDelivery,
  selectDeliveryWindow,
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

function getAddress({ itemIndex, logisticsInfo, selectedAddresses }) {
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
  selectedSla = getSlaAsId(selectedSla)

  if (!selectedSla || !logisticsInfo || logisticsInfo.length === 0) {
    return logisticsInfo || null
  }

  return logisticsInfo.map(li => {
    if (!li) {
      return li
    }

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

    if (selectedSlaObj && hasDeliveryWindows(selectedSlaObj)) {
      return
    }

    const firstScheduledSla = getFirstScheduledDelivery([li])

    if (firstScheduledSla) {
      newLogisticsInfo[li.itemIndex] = getNewLogisticsInfo(
        newLogisticsInfo,
        firstScheduledSla,
        firstScheduledSla.availableDeliveryWindows
      )[li.itemIndex]
    }
  })

  return newLogisticsInfo
}

export function filterLogisticsInfo(logisticsInfo, filters, keepSize = false) {
  if (!logisticsInfo || logisticsInfo.length === 0) {
    return []
  }

  const { items: itemsFilter } = filters || {}

  const indexes = itemsFilter
    ? itemsFilter.map(
      item =>
        typeof item.itemIndex !== 'undefined' ? item.itemIndex : item.index
    )
    : null

  return indexes
    ? keepSize
      ? logisticsInfo.map(
        li => (indexes.indexOf(li.itemIndex) !== -1 ? li : null)
      )
      : logisticsInfo.filter(li => indexes.indexOf(li.itemIndex) !== -1)
    : logisticsInfo
}

export function getNewLogisticsInfoWithScheduledDeliveryChoice(
  logisticsInfo,
  scheduledDeliveryChoice,
  scheduledDeliveryItems = null
) {
  if (
    !logisticsInfo ||
    logisticsInfo.length === 0 ||
    !scheduledDeliveryChoice ||
    !scheduledDeliveryChoice.deliveryWindow ||
    !scheduledDeliveryChoice.selectedSla
  ) {
    return null
  }

  const { deliveryWindow } = scheduledDeliveryChoice
  const selectedSla = getSlaAsId(scheduledDeliveryChoice.selectedSla)

  const indexes = scheduledDeliveryItems
    ? scheduledDeliveryItems.map(
      item =>
        typeof item.itemIndex !== 'undefined' ? item.itemIndex : item.index
    )
    : null

  const keepSize = true
  const itemsLogisticsInfo = filterLogisticsInfo(
    logisticsInfo,
    {
      items: scheduledDeliveryItems,
    },
    keepSize
  )

  const newItemsLogisticsInfo = getNewLogisticsInfo(
    itemsLogisticsInfo,
    selectedSla
  )

  const newItemsLogisticsInfoWithDeliveryWindow = selectDeliveryWindow(
    newItemsLogisticsInfo,
    { selectedSla, deliveryWindow }
  )

  return indexes
    ? logisticsInfo.map(
      li =>
        newItemsLogisticsInfoWithDeliveryWindow[li.itemIndex]
          ? newItemsLogisticsInfoWithDeliveryWindow[li.itemIndex]
          : li
    )
    : newItemsLogisticsInfoWithDeliveryWindow
}

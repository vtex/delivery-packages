import { getSelectedSlas } from './sla'
import { removeEmpty } from './utils'

export function isCheckedIn(order) {
  return !!(order && order.isCheckedIn)
}

export function isPickupCheckedIn(order) {
  return !!(order && order.checkedInPickupPointId)
}

export function getCheckInFlagsOnOrder(order) {
  if (!order || typeof order.isCheckedIn === 'undefined') {
    return {}
  }

  const isCheckInOnPickupPoint = isCheckedIn(order) && isPickupCheckedIn(order)
  const isCheckInOnMasterDataStore =
    isCheckedIn(order) && !isPickupCheckedIn(order)

  const logisticsInfoWithCheckInSelected = isCheckInOnPickupPoint
    ? getLogisticsInfoFilteredByCheckIn(order)
    : null
  const isDeliveryOnly =
    !isCheckedIn(order) ||
    (isCheckInOnPickupPoint &&
      !!logisticsInfoWithCheckInSelected &&
      logisticsInfoWithCheckInSelected.length === 0)

  return {
    isDeliveryOnly,
    isCheckInOnMasterDataStore,
    isCheckInOnPickupPoint,
  }
}

export function filterSlasPerCheckIn(slas, order) {
  slas = removeEmpty(slas)
  if (slas.length === 0 || !order) {
    return []
  }

  return slas.filter(
    sla => sla.pickupPointId === order.checkedInPickupPointId
  )
}

export function getLogisticsInfoFilteredByCheckIn(order) {
  if (
    !order ||
    !order.shippingData ||
    !order.shippingData.logisticsInfo
  ) {
    return []
  }

  const { logisticsInfo } = order.shippingData
  const slas = getSelectedSlas(logisticsInfo)
  const checkedInSlas = filterSlasPerCheckIn(slas, order)

  if (checkedInSlas.length === 0) {
    return []
  }

  const checkedInSlasMap = {}
  checkedInSlas.forEach(sla => {
    checkedInSlasMap[sla.itemIndex] = sla
  })

  return logisticsInfo.filter(li => !!checkedInSlasMap[li.itemIndex])
}

export function getItemsFilteredByCheckIn(order) {
  if (!order || !order.items) {
    return []
  }

  const { items } = order

  const newLogisticsInfo = getLogisticsInfoFilteredByCheckIn(order)

  return newLogisticsInfo.map(li => items[li.itemIndex])
}

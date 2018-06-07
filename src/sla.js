import { isCurrentChannel } from './delivery-channel'

export function hasSLAs(slasSource) {
  if (slasSource && slasSource.slas) {
    return !!(slasSource.slas.length > 0)
  }
  return !!(slasSource && slasSource.length > 0)
}

export function hasDeliveryWindows(sla) {
  return !!(
    sla &&
    sla.availableDeliveryWindows &&
    sla.availableDeliveryWindows.length > 0
  )
}

export function getSelectedSlaInSlas(item, selectedSla = null) {
  selectedSla = selectedSla || (item && item.selectedSla)

  if (!item || !item.slas || item.slas.length === 0 || !selectedSla) {
    return null
  }

  return item.slas && item.slas.filter(sla => sla.id === selectedSla)[0]
}

export function findSlaWithChannel(item, channel) {
  if (!item || !item.slas || item.slas.length === 0 || !channel) {
    return null
  }
  return item.slas && item.slas.filter(sla => isCurrentChannel(sla, channel))[0]
}

/* params = {logisticsInfo, itemIndex, selectedSla} */
export function getSelectedSla(params) {
  if (!params) {
    return null
  }

  const { itemIndex, selectedSla: paramSelectedSla, logisticsInfo } = params

  if (!logisticsInfo || !logisticsInfo[itemIndex]) {
    return null
  }

  const item = logisticsInfo[itemIndex]

  const selectedSla = paramSelectedSla || (item && item.selectedSla)

  if (!selectedSla || !item.slas || item.slas.length === 0) {
    return null
  }

  return getSelectedSlaInSlas(item, selectedSla)
}

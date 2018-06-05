import { isCurrentChannel } from './delivery-channel'

export function hasSLAs(slasSource) {
  if (slasSource && slasSource.slas) {
    return slasSource.slas.length > 0
  }
  return slasSource && slasSource.length > 0
}

export function hasDeliveryWindows(sla) {
  return sla && sla.availableDeliveryWindows.length > 0
}

export function getSelectedSlaInSlas(item) {
  return item.slas && item.slas.filter(sla => sla.id === item.selectedSla)[0]
}

export function findSlaWithChannel(item, channel) {
  return item.slas && item.slas.filter(sla => isCurrentChannel(sla, channel))[0]
}

export function getSelectedSla(params) {
  if (!params) {
    return null
  }

  const { itemIndex, selectedSla: paramSelectedSla, logisticsInfo } = params

  if (!logisticsInfo || (!logisticsInfo[itemIndex] && !paramSelectedSla)) {
    return null
  }

  const logisticInfo = logisticsInfo[itemIndex]
  const selectedSla =
    paramSelectedSla || (logisticInfo && logisticInfo.selectedSla)

  if (!selectedSla || !logisticInfo.slas || logisticInfo.slas.length === 0) {
    return null
  }

  return logisticInfo.slas.filter(sla => sla && sla.id === selectedSla)[0]
}

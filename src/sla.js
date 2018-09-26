import './polyfills'
import { isCurrentChannel } from './delivery-channel'

/** PRIVATE **/

export function getSelectedSlaInSlas(item, selectedSla = null) {
  selectedSla = selectedSla || (item && item.selectedSla)

  if (!item || !item.slas || item.slas.length === 0 || !selectedSla) {
    return null
  }

  return item.slas && item.slas.find(sla => sla.id === selectedSla)
}

export function getSelectedSlaIfMatchSlaId(item, slaId) {
  if (!item || !item.slas || item.slas.length === 0 || !slaId) {
    return null
  }

  return (
    item.slas.find(sla => sla.id === slaId && sla.id === item.selectedSla) ||
    null
  )
}

export function findSlaWithChannel(item, channel) {
  if (!item || !item.slas || item.slas.length === 0 || !channel) {
    return null
  }
  return item.slas && item.slas.find(sla => isCurrentChannel(sla, channel))
}

export function getSlaAsId(sla) {
  return sla && sla.id ? sla.id : sla
}

/** PUBLIC **/

export function hasSLAs(slasSource) {
  if (slasSource && slasSource.slas) {
    return !!(slasSource.slas.length > 0)
  }
  return !!(slasSource && slasSource.length > 0)
}

export function hasDeliveryWindows(slas) {
  if (!slas) {
    return false
  }

  if (!Array.isArray(slas)) {
    slas = [slas]
  }

  return slas.some(
    sla =>
      sla &&
      sla.availableDeliveryWindows &&
      sla.availableDeliveryWindows.length > 0
  )
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

export function getSlaObj(slas, slaId) {
  if (!slas || slas.length === 0 || !slaId) {
    return null
  }

  const slaObj = slas.find(sla => sla && sla.id === slaId)

  return slaObj || null
}

export function excludePickupTypeFromSlas(slas) {
  if (!slas || slas.length === 0) {
    return []
  }

  return slas.filter(
    sla => !sla.pickupStoreInfo || !sla.pickupStoreInfo.isPickupStore
  )
}

export function filterPickupTypeFromSlas(slas) {
  if (!slas || slas.length === 0) {
    return []
  }

  return slas.filter(
    sla => sla && sla.pickupStoreInfo && sla.pickupStoreInfo.isPickupStore
  )
}

export function getSelectedSlas(logisticsInfo) {
  if (!logisticsInfo || logisticsInfo.length === 0) {
    return []
  }

  return logisticsInfo.map(li => {
    const selectedSlaObj = getSelectedSla({
      logisticsInfo,
      itemIndex: li.itemIndex,
    })

    return selectedSlaObj
      ? {
        itemIndex: li.itemIndex,
        ...selectedSlaObj,
      }
      : null
  })
}

export function getPickupSelectedSlas(logisticsInfo) {
  const selectedSlas = getSelectedSlas(logisticsInfo)
  return filterPickupTypeFromSlas(selectedSlas)
}

export function changeSelectedSla(logisticsInfoItem, sla) {
  if (!logisticsInfoItem || !sla) {
    return logisticsInfoItem
  }
  return {
    ...logisticsInfoItem,
    selectedSla: sla.id,
    selectedDeliveryChannel: sla.deliveryChannel,
  }
}

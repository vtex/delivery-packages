import { hasDeliveryWindows } from './sla'
import { isDelivery } from './delivery-channel'

function isFromCurrentSeller({ items, li, seller, sellerId }) {
  const localSellerId = typeof sellerId === 'string' ? sellerId : seller.id
  return items[li.itemIndex].seller === localSellerId
}

export function getSelectedSlaFromSlaOption(li, slaOption) {
  return li.slas.filter(
    sla => sla.id === slaOption && sla.id === li.selectedSla
  )[0]
}

export function checkIfHasDeliveryWindow(selectedSla, actionDeliveryWindow) {
  return (
    selectedSla &&
    selectedSla.availableDeliveryWindows.filter(
      deliveryWindow =>
        actionDeliveryWindow &&
        deliveryWindow.startDateUtc === actionDeliveryWindow.startDateUtc &&
        deliveryWindow.endDateUtc === actionDeliveryWindow.endDateUtc
    )[0]
  )
}

export function getDeliveryWindow(sla, selectedSla, deliveryWindow) {
  return sla.id === selectedSla.id ? deliveryWindow : null
}

export function selectDeliveryWindow(logisticsInfo, action) {
  return logisticsInfo.map(li => {
    const selectedSla = getSelectedSlaFromSlaOption(li, action.slaOption)

    const hasDeliveryWindow = checkIfHasDeliveryWindow(
      selectedSla,
      action.deliveryWindow
    )

    if (selectedSla && action.deliveryWindow && hasDeliveryWindow) {
      return {
        ...li,
        slas: li.slas.map(sla => ({
          ...sla,
          deliveryWindow: getDeliveryWindow(
            sla,
            selectedSla,
            action.deliveryWindow
          ),
        })),
        deliveryWindow: action.deliveryWindow,
      }
    }

    return li
  })
}

export function getScheduledDeliverySLA(li) {
  return li.slas.filter(sla => isDelivery(sla) && hasDeliveryWindows(sla))[0]
}

export function getFirstScheduledDelivery(logisticsInfo, seller, items) {
  let firstScheduledSlaSeller = null

  if (
    !logisticsInfo ||
    logisticsInfo.length === 0 ||
    !seller ||
    !seller.id ||
    !items ||
    items.length === 0
  ) {
    return null
  }

  logisticsInfo.forEach(li => {
    const firstScheduledDelivery = getScheduledDeliverySLA(li)

    if (
      isFromCurrentSeller({ items, li, seller }) &&
      firstScheduledDelivery &&
      !firstScheduledSlaSeller
    ) {
      firstScheduledSlaSeller = firstScheduledDelivery
    }
  })

  return firstScheduledSlaSeller
}

export function getNewLogisticsInfo(
  logisticsInfo,
  firstScheduledSlaSeller,
  seller,
  items
) {
  return logisticsInfo.map(li => {
    const hasScheduledDelivery = li.slas.filter(
      sla => sla.id === firstScheduledSlaSeller.id
    )[0]

    if (items[li.itemIndex].seller !== seller.id || !hasScheduledDelivery) {
      return li
    }

    return {
      ...li,
      selectedSla: firstScheduledSlaSeller.id,
    }
  })
}

export function selectScheduledDelivery({ logisticsInfo, items, sellers }) {
  let newLogisticsInfo = [...logisticsInfo]

  sellers.forEach(seller => {
    const firstScheduledSlaSeller = getFirstScheduledDelivery(
      newLogisticsInfo,
      seller,
      items
    )

    if (firstScheduledSlaSeller) {
      newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        firstScheduledSlaSeller,
        seller,
        items
      )
    }
  })

  return newLogisticsInfo
}

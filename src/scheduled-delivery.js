import { hasDeliveryWindows } from './sla'
import { isDelivery } from './delivery-channel'

export function areDeliveryWindowsEquals(deliveryWindow1, deliveryWindow2) {
  return (
    deliveryWindow1.startDateUtc === deliveryWindow2.startDateUtc &&
    deliveryWindow1.endDateUtc === deliveryWindow2.endDateUtc &&
    deliveryWindow1.price === deliveryWindow2.price &&
    deliveryWindow1.lisPrice === deliveryWindow2.lisPrice &&
    deliveryWindow1.tax === deliveryWindow2.tax
  )
}

export function areAvailableDeliveryWindowsEquals(
  availableDeliveryWindows1,
  availableDeliveryWindows2
) {
  if (!availableDeliveryWindows1 || !availableDeliveryWindows2) {
    return false
  }

  if (availableDeliveryWindows1.length !== availableDeliveryWindows2.length) {
    return false
  }

  const deliveryWindowsThatAreEqual = availableDeliveryWindows1.filter(
    (deliveryWindow1, index) => {
      const deliveryWindow2 = availableDeliveryWindows2[index]
      return areDeliveryWindowsEquals(deliveryWindow1, deliveryWindow2)
    }
  )

  return deliveryWindowsThatAreEqual.length === availableDeliveryWindows1.length
}

export function getSelectedSlaIfMatchSlaOption(li, slaOption) {
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

/* action = {sla, deliveryWindow} */
export function selectDeliveryWindow(logisticsInfo, action) {
  if (
    !logisticsInfo ||
    logisticsInfo.length === 0 ||
    !action ||
    (!action.slaOption && !action.sla) ||
    !action.deliveryWindow
  ) {
    return null
  }

  return logisticsInfo.map(li => {
    const slaOption = action.sla || action.slaOption
    const { deliveryWindow } = action
    const selectedSla = getSelectedSlaIfMatchSlaOption(li, slaOption)

    const hasDeliveryWindow = checkIfHasDeliveryWindow(
      selectedSla,
      deliveryWindow
    )

    if (selectedSla && hasDeliveryWindow) {
      return {
        ...li,
        slas: li.slas.map(sla => ({
          ...sla,
          deliveryWindow: sla.id === selectedSla.id ? deliveryWindow : null,
        })),
        deliveryWindow: deliveryWindow,
      }
    }

    return li
  })
}

export function filterSlaByAvailableDeliveryWindows(
  sla,
  availableDeliveryWindows
) {
  if (!availableDeliveryWindows) {
    return true
  }

  return areAvailableDeliveryWindowsEquals(
    sla.availableDeliveryWindows,
    availableDeliveryWindows
  )
}

export function getScheduledDeliverySLA(li, availableDeliveryWindows) {
  return li.slas.filter(
    sla =>
      isDelivery(sla) &&
      hasDeliveryWindows(sla) &&
      filterSlaByAvailableDeliveryWindows(sla, availableDeliveryWindows)
  )[0]
}

export function getFirstScheduledDelivery(
  logisticsInfo,
  availableDeliveryWindows
) {
  if (
    !logisticsInfo ||
    logisticsInfo.length === 0 ||
    !availableDeliveryWindows ||
    !availableDeliveryWindows.length === 0
  ) {
    return null
  }

  let firstScheduledSla = null

  logisticsInfo.forEach(li => {
    const firstScheduledDeliverySla = getScheduledDeliverySLA(
      li,
      availableDeliveryWindows
    )

    if (firstScheduledDeliverySla && !firstScheduledSla) {
      firstScheduledSla = firstScheduledDeliverySla
    }
  })

  return firstScheduledSla
}
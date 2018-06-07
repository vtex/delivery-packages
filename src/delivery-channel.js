import { PICKUP_IN_STORE, DELIVERY } from './constants'

export function getDeliveryChannel(deliveryChannelSource) {
  if (typeof deliveryChannelSource === 'string') {
    return deliveryChannelSource
  }

  if (!deliveryChannelSource) {
    return null
  }

  return (
    deliveryChannelSource.deliveryChannel ||
    deliveryChannelSource.selectedDeliveryChannel ||
    deliveryChannelSource.id ||
    null
  )
}

export function isCurrentChannel(deliveryChannelSource, currentChannel) {
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === currentChannel
}

export function isPickup(deliveryChannelSource) {
  return isCurrentChannel(deliveryChannelSource, PICKUP_IN_STORE)
}

export function isDelivery(deliveryChannelSource) {
  return isCurrentChannel(deliveryChannelSource, DELIVERY)
}

export function findChannelById(logisticsInfoItem, deliveryChannel) {
  if (
    !logisticsInfoItem ||
    !logisticsInfoItem.deliveryChannels ||
    logisticsInfoItem.deliveryChannels.length === 0 ||
    !deliveryChannel
  ) {
    return null
  }

  return logisticsInfoItem.deliveryChannels.filter(
    liChannel => liChannel.id === deliveryChannel
  )[0] || null
}

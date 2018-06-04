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
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === PICKUP_IN_STORE
}

export function isDelivery(deliveryChannelSource) {
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === DELIVERY
}

export function findChannelById(li, channel) {
  return li.deliveryChannels.filter(liChannel => liChannel.id === channel)[0]
}

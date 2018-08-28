import {
  PICKUP,
  SEARCH,
  RESIDENTIAL,
  COMMERCIAL,
  GIFT_REGISTRY,
} from './constants'

export function isAddressComplete(address) {
  const { number, street, neighborhood, city, state } = address || {}
  return !!(number && street && neighborhood && city && state)
}

export function isPickupAddress(address) {
  return address && address.addressType === PICKUP
}

export function isSearchAddress(address) {
  return address && address.addressType === SEARCH
}

export function isDeliveryAddress(address) {
  if (!address || !address.addressType) {
    return false
  }
  return (
    address.addressType === RESIDENTIAL ||
    address.addressType === COMMERCIAL ||
    address.addressType === GIFT_REGISTRY
  )
}

export function getDeliveryAvailableAddresses(addresses) {
  if (!addresses || addresses.length === 0) {
    return []
  }

  return addresses.filter(address => {
    return isAddressComplete(address) && isDeliveryAddress(address)
  })
}

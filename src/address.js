import { PICKUP, SEARCH, RESIDENTIAL } from './constants'

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
  return address && address.addressType === RESIDENTIAL
}

export function getDeliveryAvailableAddresses(addresses) {
  if (!addresses || addresses.length === 0) {
    return []
  }

  return addresses.filter(address => {
    return isAddressComplete(address) && isDeliveryAddress(address)
  })
}

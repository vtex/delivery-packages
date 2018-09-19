import {
  PICKUP,
  SEARCH,
  RESIDENTIAL,
  COMMERCIAL,
  GIFT_REGISTRY,
} from './constants'

/** PRIVATE **/

export function getFirstAddressForType(addresses, addressType) {
  if (!addresses || addresses.length === 0 || !addressType) {
    return null
  }

  const groups = groupByAddressType(addresses)
  const groupAddresses = groups[addressType]
  return groupAddresses && groupAddresses.length > 0 ? groupAddresses[0] : null
}

export function getFirstAddressOnAnyOfTheseTypes(addresses, addressesTypes) {
  return addressesTypes.reduce((address, addressType) => {
    return address || getFirstAddressForType(addresses, addressType)
  }, null)
}

export function getFirstAddressForDelivery(addresses) {
  return getFirstAddressOnAnyOfTheseTypes(addresses, [
    RESIDENTIAL,
    COMMERCIAL,
    GIFT_REGISTRY,
  ])
}

export function getPickupAddress(pickupSla) {
  return (
    (pickupSla &&
      pickupSla.pickupStoreInfo &&
      pickupSla.pickupStoreInfo.address) ||
    null
  )
}

export function findAddress(addresses, searchAddress) {
  if (!addresses || addresses.length === 0 || !searchAddress) {
    return null
  }

  return addresses.find(
    address => address.addressId === searchAddress.addressId
  )
}

/** PUBLIC **/

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

export function groupByAddressType(addresses) {
  if (!addresses || addresses.length === 0) {
    return {}
  }

  return addresses.reduce((groups, address, index) => {
    if (address && address.addressType) {
      address.index = index
      if (!groups[address.addressType]) {
        groups[address.addressType] = []
      }
      groups[address.addressType].push(address)
    }
    return groups
  }, {})
}

export function addOrReplaceAddressOnList(addresses, newAddress) {
  if (!addresses || addresses.length === 0 || !newAddress) {
    return addresses
  }

  const newAddresses = [...addresses]

  const address = getFirstAddressForType(newAddresses, newAddress.addressType)

  if (!address) {
    return [...newAddresses, newAddress]
  }

  const addressIndex = address.index
  newAddresses[addressIndex] = {
    ...newAddresses[addressIndex],
    ...newAddress,
  }

  return newAddresses
}

export function addPickupPointAddresses(addresses, pickupSlas) {
  if (
    !addresses ||
    addresses.length === 0 ||
    !pickupSlas ||
    pickupSlas.length === 0
  ) {
    return addresses
  }

  return pickupSlas.reduce(
    (newAddresses, pickupSla) => {
      const searchAddress = findAddress(addresses, searchAddress)
      if (searchAddress) {
        return newAddresses
      }

      const newAddress = {
        ...getPickupAddress(pickupSla),
        addressType: SEARCH,
      }
      return addOrReplaceAddressOnList(newAddresses, newAddress)
    },
    [...addresses]
  )
}

import { PICKUP, SEARCH, GIFT_REGISTRY } from './constants'
import uuid from './uuid'

/** PRIVATE **/

function getCleanAddressType(addressType) {
  return addressType && addressType.trim().toLowerCase()
}

export function equalsAddressType(addressType1, addressType2) {
  return getCleanAddressType(addressType1) === getCleanAddressType(addressType2)
}

export function getFirstAddressForType(addresses, addressType) {
  if (!addresses || addresses.length === 0 || !addressType) {
    return null
  }

  addressType = getCleanAddressType(addressType)

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
  if (!addresses || addresses.length === 0) {
    return null
  }

  const deliveryAddresses = addresses.filter(address =>
    isDeliveryAddress(address)
  )

  return deliveryAddresses && deliveryAddresses.length > 0
    ? deliveryAddresses[0]
    : null
}

export function getPickupAddress(pickupSla) {
  return (
    (pickupSla &&
      pickupSla.pickupStoreInfo &&
      pickupSla.pickupStoreInfo.address) ||
    null
  )
}

export function isCurrentAddressType(address, addressType) {
  if (address && !address.addressType) {
    return false
  }
  if (address && typeof address.addressType === 'string') {
    return equalsAddressType(address.addressType, addressType)
  }
  return address && equalsAddressType(address.addressType.value, addressType)
}

/** PUBLIC **/

export const defaultRequiredAddressFields = [
  'state',
  'city',
  'neighborhood',
  'street',
  'number',
]

export function isAddressComplete(
  address,
  requiredFields = defaultRequiredAddressFields
) {
  return !!address && requiredFields.every(field => !!address[field])
}

export function isGiftRegistry(address) {
  return isCurrentAddressType(address, GIFT_REGISTRY)
}

export function isPickupAddress(address) {
  return isCurrentAddressType(address, PICKUP)
}

export function isSearchAddress(address) {
  return isCurrentAddressType(address, SEARCH)
}

export function isDeliveryAddress(address) {
  if (!address || !address.addressType) {
    return false
  }

  return !isPickupAddress(address) && !isSearchAddress(address)
}

export function addAddressId(address) {
  if (!address || address.addressId) {
    return address
  }
  return {
    ...address,
    addressId: uuid(),
  }
}

export function findAddressIndex(addresses, searchAddress, prop = 'addressId') {
  if (!addresses || addresses.length === 0 || !searchAddress) {
    return -1
  }

  return addresses.findIndex(address => address[prop] === searchAddress[prop])
}

export function findAddress(addresses, searchAddress, prop = 'addressId') {
  if (!addresses || addresses.length === 0 || !searchAddress) {
    return null
  }

  return (
    addresses.find(address => address[prop] === searchAddress[prop]) || null
  )
}

export function findAddressByPostalCode(addresses, searchAddress) {
  return findAddress(addresses, searchAddress, 'postalCode')
}

export function getDeliveryAvailableAddresses(addresses, requiredFields) {
  if (!addresses || addresses.length === 0) {
    return []
  }

  return addresses.filter(address => {
    return (
      isAddressComplete(address, requiredFields) && isDeliveryAddress(address)
    )
  })
}

export function groupByAddressType(addresses) {
  if (!addresses || addresses.length === 0) {
    return {}
  }

  return addresses.reduce((groups, address, index) => {
    if (address && address.addressType) {
      const addressType = getCleanAddressType(address.addressType)
      address.index = index
      if (!groups[addressType]) {
        groups[addressType] = []
      }
      groups[addressType].push(address)
    }
    return groups
  }, {})
}

export function addOrReplaceAddressTypeOnList(addresses, newAddress) {
  if (!addresses || !newAddress) {
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

export function setDeliveryAddressOnList(addresses, newAddress) {
  if (!addresses || !newAddress || isPickupAddress(newAddress)) {
    return addresses
  }

  const newAddresses = [...addresses]

  const address = getFirstAddressForDelivery(newAddresses)

  if (!address) {
    return [...newAddresses, newAddress]
  }

  const addressIndex = findAddressIndex(newAddresses, address)
  newAddresses[addressIndex] = {
    ...newAddresses[addressIndex],
    ...newAddress,
  }

  return newAddresses
}

export function addOrReplaceAddressOnList(addresses, newAddress) {
  if (!addresses || !newAddress) {
    return addresses
  }

  const newAddresses = [...addresses]

  const addressIndex = findAddressIndex(newAddresses, newAddress)

  if (addressIndex === -1) {
    return [...newAddresses, newAddress]
  }

  newAddresses[addressIndex] = {
    ...newAddresses[addressIndex],
    ...newAddress,
  }

  return newAddresses
}

export function addPickupPointAddresses(addresses, pickupSlas) {
  if (!addresses || !pickupSlas || pickupSlas.length === 0) {
    return addresses
  }

  return pickupSlas.reduce(
    (newAddresses, pickupSla) => {
      const pickupAddress = getPickupAddress(pickupSla)
      const searchAddress = findAddress(addresses, pickupAddress)
      if (searchAddress) {
        return newAddresses
      }

      const newAddress = {
        ...pickupAddress,
        addressType: SEARCH,
      }

      return addOrReplaceAddressOnList(newAddresses, newAddress)
    },
    [...addresses]
  )
}

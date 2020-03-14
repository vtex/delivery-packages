import {
  isAddressComplete,
  isGiftRegistry,
  isPickupAddress,
  isSearchAddress,
  isDeliveryAddress,
  getDeliveryAvailableAddresses,
  groupByAddressType,
  getFirstAddressForType,
  getPickupAddress,
  addOrReplaceAddressTypeOnList,
  addOrReplaceAddressOnList,
  addPickupPointAddresses,
  addAddressId,
  findAddress,
  findAddressByPostalCode,
  getFirstAddressForDelivery,
} from '../src/address'
import { PICKUP, SEARCH, RESIDENTIAL } from '../src/constants'

import { slas, addresses } from './mockGenerator'

describe('Address', () => {
  describe('isAddressComplete', () => {
    it('should be false if empty params are passed', () => {
      const isAddressComplete1 = isAddressComplete()
      const isAddressComplete2 = isAddressComplete({})

      expect(isAddressComplete1).toBeFalsy()
      expect(isAddressComplete2).toBeFalsy()
    })

    it('should be false if missing item on address', () => {
      const incompleteAddress = {
        ...addresses.residentialAddress,
        street: null,
      }
      const isAddressComplete1 = isAddressComplete(incompleteAddress)

      expect(isAddressComplete1).toBeFalsy()
    })

    it('should be true if complete address is passed', () => {
      const completeAddress = addresses.residentialAddress
      const isAddressComplete1 = isAddressComplete(completeAddress)

      expect(isAddressComplete1).toBeTruthy()
    })

    it('should be true if missing number when it is not required', () => {
      const completeAddress = { ...addresses.residentialAddress, number: null }
      const isAddressComplete1 = isAddressComplete(completeAddress, { verifyNumber: false })

      expect(isAddressComplete1).toBeTruthy()
    })

    it('should be false if missing number when it is explicity required', () => {
      const completeAddress = { ...addresses.residentialAddress, number: null }
      const isAddressComplete1 = isAddressComplete(completeAddress, { verifyNumber: true })

      expect(isAddressComplete1).toBeFalsy()
    })

    it('should be false if missing number when it is implicit required', () => {
      const completeAddress = { ...addresses.residentialAddress, number: null }
      const isAddressComplete1 = isAddressComplete(completeAddress)

      expect(isAddressComplete1).toBeFalsy()
    })
  })

  describe('isPickupAddress', () => {
    it('should be false if empty params are passed', () => {
      const isPickupAddress1 = isPickupAddress()
      const isPickupAddress2 = isPickupAddress({})

      expect(isPickupAddress1).toBeFalsy()
      expect(isPickupAddress2).toBeFalsy()
    })

    it('should be false if not pickup address is passed', () => {
      const isPickupAddress1 = isPickupAddress(addresses.residentialAddress)
      const isPickupAddress2 = isPickupAddress(addresses.searchAddress)

      expect(isPickupAddress1).toBeFalsy()
      expect(isPickupAddress2).toBeFalsy()
    })

    it('should be true if pickup address is passed', () => {
      const isPickupAddress1 = isPickupAddress(addresses.pickupPointAddress)

      expect(isPickupAddress1).toBeTruthy()
    })
  })

  describe('isSearchAddress', () => {
    it('should be false if empty params are passed', () => {
      const isSearchAddress1 = isSearchAddress()
      const isSearchAddress2 = isSearchAddress({})

      expect(isSearchAddress1).toBeFalsy()
      expect(isSearchAddress2).toBeFalsy()
    })

    it('should be false if not search address is passed', () => {
      const isSearchAddress1 = isSearchAddress(addresses.residentialAddress)
      const isSearchAddress2 = isSearchAddress(addresses.pickupPointAddress)

      expect(isSearchAddress1).toBeFalsy()
      expect(isSearchAddress2).toBeFalsy()
    })

    it('should be true if search address is passed', () => {
      const isSearchAddress1 = isSearchAddress(addresses.searchAddress)

      expect(isSearchAddress1).toBeTruthy()
    })
  })

  describe('isDeliveryAddress', () => {
    it('should be false if empty params are passed', () => {
      const isDeliveryAddress1 = isDeliveryAddress()
      const isDeliveryAddress2 = isDeliveryAddress({})

      expect(isDeliveryAddress1).toBeFalsy()
      expect(isDeliveryAddress2).toBeFalsy()
    })

    it('should be false if not residential address is passed', () => {
      const isDeliveryAddress1 = isDeliveryAddress(addresses.searchAddress)
      const isDeliveryAddress2 = isDeliveryAddress(addresses.pickupPointAddress)

      expect(isDeliveryAddress1).toBeFalsy()
      expect(isDeliveryAddress2).toBeFalsy()
    })

    it('should be true if residential address is passed', () => {
      const isDeliveryAddress1 = isDeliveryAddress(addresses.residentialAddress)
      const isDeliveryAddress2 = isDeliveryAddress(
        addresses.giftRegistryAddress
      )
      const isDeliveryAddress3 = isDeliveryAddress(addresses.commercialAddress)

      expect(isDeliveryAddress1).toBeTruthy()
      expect(isDeliveryAddress2).toBeTruthy()
      expect(isDeliveryAddress3).toBeTruthy()
    })
  })

  describe('isGiftRegistry', () => {
    it('should be false if empty params are passed', () => {
      const isGiftRegistryAddress1 = isGiftRegistry()
      const isGiftRegistryAddress2 = isGiftRegistry({})

      expect(isGiftRegistryAddress1).toBeFalsy()
      expect(isGiftRegistryAddress2).toBeFalsy()
    })

    it('should be false if not gift registry address is passed', () => {
      const isGiftRegistryAddress1 = isGiftRegistry(addresses.searchAddress)
      const isGiftRegistryAddress2 = isGiftRegistry(
        addresses.pickupPointAddress
      )

      expect(isGiftRegistryAddress1).toBeFalsy()
      expect(isGiftRegistryAddress2).toBeFalsy()
    })

    it('should be true if residential address is passed', () => {
      const isGiftRegistryAddress1 = isDeliveryAddress(
        addresses.giftRegistryAddress
      )
      expect(isGiftRegistryAddress1).toBeTruthy()
    })
  })

  describe('getDeliveryAvailableAddresses', () => {
    it('should be empty if empty params are passed', () => {
      const addresses1 = getDeliveryAvailableAddresses()
      const addresses2 = getDeliveryAvailableAddresses([])

      expect(addresses1).toEqual([])
      expect(addresses2).toEqual([])
    })

    it('should be empty if incomplete addresses are passed', () => {
      const incompleteAddress1 = {
        ...addresses.residentialAddress,
        street: null,
      }
      const incompleteAddress2 = {
        ...addresses.residentialAddress,
        number: null,
      }
      const addresses1 = getDeliveryAvailableAddresses([
        incompleteAddress1,
        incompleteAddress2,
      ])

      expect(addresses1).toEqual([])
    })

    it('should be only maintain complete and residential addresses', () => {
      const incompleteAddress1 = {
        ...addresses.residentialAddress,
        street: null,
      }
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        addressId: '-4556418741999',
        receiverName: 'Other Doe',
      }

      const addresses1 = getDeliveryAvailableAddresses([
        incompleteAddress1,
        residentialAddress1,
        pickupAddress,
        residentialAddress2,
        searchAddress,
      ])

      expect(addresses1).toEqual([residentialAddress1, residentialAddress2])
    })

    it('should maintain without number addresses if it is not required', () => {
      const incompleteAddress1 = {
        ...addresses.residentialAddress,
        street: null,
      }
      const residentialAddress1 = addresses.residentialAddress
      const withoutNumberAddress = {
        ...addresses.residentialAddress,
        number: null,
      }

      const addresses1 = getDeliveryAvailableAddresses([
        incompleteAddress1,
        residentialAddress1,
        withoutNumberAddress,
      ], { verifyNumber: false })

      expect(addresses1).toEqual([residentialAddress1, withoutNumberAddress])
    })
  })

  describe('groupByAddressType', () => {
    it('should be empty if empty params are passed', () => {
      const addressGroups1 = groupByAddressType()
      const addressGroups2 = groupByAddressType([])

      expect(addressGroups1).toEqual({})
      expect(addressGroups2).toEqual({})
    })

    it('should group by addressType', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress = addresses.residentialAddress
      const expectedGroups1 = {
        [PICKUP]: [pickupAddress],
        [RESIDENTIAL]: [residentialAddress],
      }

      const addressGroups1 = groupByAddressType([
        residentialAddress,
        pickupAddress,
      ])

      expect(addressGroups1).toEqual(expectedGroups1)
    })

    it('should group all types by addressType', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        addressId: '-4556418741999',
        receiverName: 'Other Doe',
      }
      const expectedGroups1 = {
        [PICKUP]: [pickupAddress],
        [SEARCH]: [searchAddress],
        [RESIDENTIAL]: [residentialAddress1, residentialAddress2],
      }

      const addressGroups1 = groupByAddressType([
        residentialAddress1,
        pickupAddress,
        residentialAddress2,
        searchAddress,
      ])

      expect(addressGroups1).toEqual(expectedGroups1)
    })
  })

  describe('getFirstAddressForType', () => {
    it('should be empty if empty params are passed', () => {
      const address1 = getFirstAddressForType()
      const address2 = getFirstAddressForType([], null)

      expect(address1).toBeNull()
      expect(address2).toBeNull()
    })

    it('should return null if address not found', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const addresses1 = [pickupAddress, searchAddress]

      const address1 = getFirstAddressForType(addresses1, RESIDENTIAL)

      expect(address1).toBeNull()
    })

    it('should get correct address by addressType', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        addressId: '-4556418741999',
        receiverName: 'Other Doe',
      }
      const addresses1 = [
        residentialAddress1,
        pickupAddress,
        residentialAddress2,
        searchAddress,
      ]

      const address1 = getFirstAddressForType(addresses1, PICKUP)
      const address2 = getFirstAddressForType(addresses1, RESIDENTIAL)
      const address3 = getFirstAddressForType(addresses1, SEARCH)

      expect(address1).toEqual(pickupAddress)
      expect(address2).toEqual(residentialAddress1)
      expect(address3).toEqual(searchAddress)
    })
  })

  describe('getPickupAddress', () => {
    it('should be empty if empty params are passed', () => {
      const address1 = getPickupAddress()
      const address2 = getPickupAddress(null)

      expect(address1).toBeNull()
      expect(address2).toBeNull()
    })

    it('should return null if address not found', () => {
      const address1 = getPickupAddress(slas.normalSla)

      expect(address1).toBeNull()
    })

    it('should get correct address if sla contains address', () => {
      const pickupSla = slas.pickupSla
      const expectedAddress = addresses.pickupPointAddress

      const address1 = getPickupAddress(pickupSla)

      expect(address1).toEqual(expectedAddress)
    })
  })

  describe('addOrReplaceAddressTypeOnList', () => {
    it('should be empty if empty params are passed', () => {
      const addresses1 = addOrReplaceAddressTypeOnList()
      const addresses2 = addOrReplaceAddressTypeOnList([], null)

      expect(addresses1).toBeUndefined()
      expect(addresses2).toEqual([])
    })

    it('should add address on empty address list', () => {
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = []
      const expectedAddresses1 = [...addresses1, residentialAddress1]

      const resultAddresses1 = addOrReplaceAddressTypeOnList(
        addresses1,
        residentialAddress1
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })

    it('should add address', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, searchAddress]
      const expectedAddresses1 = [...addresses1, residentialAddress1]

      const resultAddresses1 = addOrReplaceAddressTypeOnList(
        addresses1,
        residentialAddress1
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })

    it('should replace address with all info', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...residentialAddress1,
        receiverName: 'Other Doe',
      }
      const baseAddresses = [pickupAddress, searchAddress]
      const addresses1 = [...baseAddresses, residentialAddress1]
      const expectedAddresses1 = [...baseAddresses, residentialAddress2]

      const resultAddresses1 = addOrReplaceAddressTypeOnList(
        addresses1,
        residentialAddress2
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })
  })

  describe('addOrReplaceAddressOnList', () => {
    it('should be empty if empty params are passed', () => {
      const addresses1 = addOrReplaceAddressOnList()
      const addresses2 = addOrReplaceAddressOnList([], null)

      expect(addresses1).toBeUndefined()
      expect(addresses2).toEqual([])
    })

    it('should add address on empty address list', () => {
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = []
      const expectedAddresses1 = [...addresses1, residentialAddress1]

      const resultAddresses1 = addOrReplaceAddressOnList(
        addresses1,
        residentialAddress1
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })

    it('should add address', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, searchAddress]
      const expectedAddresses1 = [...addresses1, residentialAddress1]

      const resultAddresses1 = addOrReplaceAddressOnList(
        addresses1,
        residentialAddress1
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })

    it('should replace addresses with unique id', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...residentialAddress1,
        receiverName: 'Other Doe',
      }
      const baseAddresses = [pickupAddress, searchAddress]
      const addresses1 = [...baseAddresses, residentialAddress1]
      const expectedAddresses1 = [...baseAddresses, residentialAddress2]

      const resultAddresses1 = addOrReplaceAddressOnList(
        addresses1,
        residentialAddress2
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })

    it('should add multiple addresses of same type if different ids', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = addresses.residentialAddress2
      const addresses1 = [pickupAddress, searchAddress, residentialAddress1]
      const expectedAddresses1 = [...addresses1, residentialAddress2]

      const resultAddresses1 = addOrReplaceAddressOnList(
        addresses1,
        residentialAddress2
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })
  })

  describe('addPickupPointAddresses', () => {
    it('should be empty if empty params are passed', () => {
      const addresses1 = addPickupPointAddresses()
      const addresses2 = addPickupPointAddresses([], null)

      expect(addresses1).toBeUndefined()
      expect(addresses2).toEqual([])
    })

    it('should add address but with search type on empty addresses', () => {
      const pickupAddress = addresses.pickupPointAddress
      const addresses1 = []
      const pickupSlas = [slas.pickupSla]
      const expectedAddresses = [
        {
          ...pickupAddress,
          addressType: SEARCH,
        },
      ]

      const newAddresses = addPickupPointAddresses(addresses1, pickupSlas)

      expect(newAddresses).toEqual(expectedAddresses)
    })

    it('should add address but with search type on list of addresses', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [residentialAddress1]
      const pickupSlas = [slas.pickupSla]
      const expectedAddresses = [
        ...addresses1,
        {
          ...pickupAddress,
          addressType: SEARCH,
        },
      ]

      const newAddresses = addPickupPointAddresses(addresses1, pickupSlas)

      expect(newAddresses).toEqual(expectedAddresses)
    })

    it('shouldnt add address if already on list of addresses', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, residentialAddress1]
      const pickupSlas = [slas.pickupSla]
      const expectedAddresses = [...addresses1]

      const newAddresses = addPickupPointAddresses(addresses1, pickupSlas)

      expect(newAddresses).toEqual(expectedAddresses)
    })
  })

  describe('addAddressId', () => {
    it('should be empty if empty params are passed', () => {
      const address1 = addAddressId()
      const address2 = addAddressId(null)

      expect(address1).toBeUndefined()
      expect(address2).toBeNull()
    })

    it('should add addressId on empty object', () => {
      const address1 = addAddressId({})

      expect(address1.addressId).toBeTruthy()
    })

    it('should add addressId on incomplete address', () => {
      const address1 = addAddressId({
        ...addresses.residentialAddress.addressId,
        addressId: null,
      })

      expect(address1.addressId).toBeTruthy()
    })

    it('shouldnt add addressId on complete address', () => {
      const address1 = addAddressId(addresses.residentialAddress)

      expect(address1.addressId).toEqual(addresses.residentialAddress.addressId)
    })
  })

  describe('findAddress', () => {
    it('should be empty if empty params are passed', () => {
      const address1 = findAddress()
      const address2 = findAddress([], null)

      expect(address1).toBeNull()
      expect(address2).toBeNull()
    })

    it('shouldnt find address not on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, residentialAddress1]

      const address1 = findAddress(addresses1, searchAddress)

      expect(address1).toBeNull()
    })

    it('should find address on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, residentialAddress1]

      const address1 = findAddress(addresses1, pickupAddress)

      expect(address1).toEqual(pickupAddress)
    })
  })

  describe('findAddressByPostalCode', () => {
    it('should be empty if empty params are passed', () => {
      const address1 = findAddressByPostalCode()
      const address2 = findAddressByPostalCode([], null)

      expect(address1).toBeNull()
      expect(address2).toBeNull()
    })

    it('shouldnt find address not on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, residentialAddress1]

      const address1 = findAddressByPostalCode(addresses1, searchAddress)

      expect(address1).toBeNull()
    })

    it('should find address on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, residentialAddress1]

      const address1 = findAddressByPostalCode(addresses1, pickupAddress)

      expect(address1).toEqual(pickupAddress)
    })

    it('should find postalcode on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const samePostalCodeAddress = addresses.commercialAddress
      const addresses1 = [pickupAddress, residentialAddress1]

      const address1 = findAddressByPostalCode(
        addresses1,
        samePostalCodeAddress
      )

      expect(address1).toEqual(residentialAddress1)
    })
  })

  describe('getFirstAddressForDelivery', () => {
    it('should be empty if empty params are passed', () => {
      const address1 = getFirstAddressForDelivery()
      const address2 = getFirstAddressForDelivery([])

      expect(address1).toBeNull()
      expect(address2).toBeNull()
    })

    it('shouldnt find address if no delivery address is on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const searchAddress = addresses.searchAddress
      const addresses1 = [pickupAddress, searchAddress]

      const address1 = getFirstAddressForDelivery(addresses1)

      expect(address1).toBeNull()
    })

    it('should find delivery address on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAddress, residentialAddress1]

      const address1 = getFirstAddressForDelivery(addresses1)

      expect(address1).toEqual(residentialAddress1)
    })

    it('should find delivery address even with upper case values on list', () => {
      const pickupAddress = addresses.pickupPointAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress2,
        addressType: addresses.residentialAddress2.addressType.toUpperCase(),
      }

      const addresses1 = [
        pickupAddress,
        residentialAddress2,
        residentialAddress1,
      ]

      const address1 = getFirstAddressForDelivery(addresses1)

      expect(address1).toEqual(residentialAddress2)
    })
  })
})

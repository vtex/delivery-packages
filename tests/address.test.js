import {
  isAddressComplete,
  isPickupAddress,
  isSearchAddress,
  isDeliveryAddress,
  getDeliveryAvailableAddresses,
  groupByAddressType,
  getFirstAddressForType,
  addOrReplaceAddressOnList,
} from '../src/address'
import { PICKUP, SEARCH, RESIDENTIAL } from '../src/constants'

import { addresses } from './mockGenerator'

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
      const pickupAdress = addresses.pickupPointAddress
      const searchAdress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        addressId: '-4556418741999',
        receiverName: 'Other Doe',
      }

      const addresses1 = getDeliveryAvailableAddresses([
        incompleteAddress1,
        residentialAddress1,
        pickupAdress,
        residentialAddress2,
        searchAdress,
      ])

      expect(addresses1).toEqual([residentialAddress1, residentialAddress2])
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
      const pickupAdress = addresses.pickupPointAddress
      const residentialAddress = addresses.residentialAddress
      const expectedGroups1 = {
        [PICKUP]: [pickupAdress],
        [RESIDENTIAL]: [residentialAddress],
      }

      const addressGroups1 = groupByAddressType([
        residentialAddress,
        pickupAdress,
      ])

      expect(addressGroups1).toEqual(expectedGroups1)
    })

    it('should group all types by addressType', () => {
      const pickupAdress = addresses.pickupPointAddress
      const searchAdress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        addressId: '-4556418741999',
        receiverName: 'Other Doe',
      }
      const expectedGroups1 = {
        [PICKUP]: [pickupAdress],
        [SEARCH]: [searchAdress],
        [RESIDENTIAL]: [residentialAddress1, residentialAddress2],
      }

      const addressGroups1 = groupByAddressType([
        residentialAddress1,
        pickupAdress,
        residentialAddress2,
        searchAdress,
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
      const pickupAdress = addresses.pickupPointAddress
      const searchAdress = addresses.searchAddress
      const addresses1 = [pickupAdress, searchAdress]

      const address1 = getFirstAddressForType(addresses1, RESIDENTIAL)

      expect(address1).toBeNull()
    })

    it('should get correct address by addressType', () => {
      const pickupAdress = addresses.pickupPointAddress
      const searchAdress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        addressId: '-4556418741999',
        receiverName: 'Other Doe',
      }
      const addresses1 = [
        residentialAddress1,
        pickupAdress,
        residentialAddress2,
        searchAdress,
      ]

      const address1 = getFirstAddressForType(addresses1, PICKUP)
      const address2 = getFirstAddressForType(addresses1, RESIDENTIAL)
      const address3 = getFirstAddressForType(addresses1, SEARCH)

      expect(address1).toEqual(pickupAdress)
      expect(address2).toEqual(residentialAddress1)
      expect(address3).toEqual(searchAdress)
    })
  })

  describe('addOrReplaceAddressOnList', () => {
    it('should be empty if empty params are passed', () => {
      const addresses1 = addOrReplaceAddressOnList()
      const addresses2 = addOrReplaceAddressOnList([], null)

      expect(addresses1).toBeUndefined()
      expect(addresses2).toEqual([])
    })

    it('should add address', () => {
      const pickupAdress = addresses.pickupPointAddress
      const searchAdress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const addresses1 = [pickupAdress, searchAdress]
      const expectedAddresses1 = [...addresses1, residentialAddress1]

      const resultAddresses1 = addOrReplaceAddressOnList(
        addresses1,
        residentialAddress1
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })

    it('should replace address with all info', () => {
      const pickupAdress = addresses.pickupPointAddress
      const searchAdress = addresses.searchAddress
      const residentialAddress1 = addresses.residentialAddress
      const residentialAddress2 = {
        ...addresses.residentialAddress,
        receiverName: 'Other Doe',
      }
      const baseAddresses = [pickupAdress, searchAdress]
      const addresses1 = [...baseAddresses, residentialAddress1]
      const expectedAddresses1 = [...baseAddresses, residentialAddress2]

      const resultAddresses1 = addOrReplaceAddressOnList(
        addresses1,
        residentialAddress2
      )

      expect(resultAddresses1).toEqual(expectedAddresses1)
    })
  })
})

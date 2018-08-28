import {
  isAddressComplete,
  isPickupAddress,
  isSearchAddress,
  isDeliveryAddress,
  getDeliveryAvailableAddresses,
} from '../src/address'

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

      expect(isDeliveryAddress1).toBeTruthy()
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
})

import {
  getDeliveryChannel,
  isCurrentChannel,
  isPickup,
  isDelivery,
  findChannelById,
} from '../src/delivery-channel'
import { DELIVERY, PICKUP_IN_STORE } from '../src/constants'

import { slas } from './mockGenerator'

const deliveryChannelObj = { id: DELIVERY }
const pickupChannelObj = { id: PICKUP_IN_STORE }

describe('Delivery channel', () => {
  describe('getDeliveryChannel', () => {
    it('should return null if empty params are passed', () => {
      const deliveryChannel1 = getDeliveryChannel()
      const deliveryChannel2 = getDeliveryChannel({})

      expect(deliveryChannel1).toBeNull()
      expect(deliveryChannel2).toBeNull()
    })

    it('should return same valid string passed', () => {
      const deliveryChannel1 = getDeliveryChannel(DELIVERY)
      const deliveryChannel2 = getDeliveryChannel(PICKUP_IN_STORE)

      expect(deliveryChannel1).toEqual(DELIVERY)
      expect(deliveryChannel2).toEqual(PICKUP_IN_STORE)
    })

    it('should return correct delivery channel if valid slas are passed', () => {
      const deliveryChannel1 = getDeliveryChannel(slas.normalSla)
      const deliveryChannel2 = getDeliveryChannel(slas.pickupNormalSla)

      expect(deliveryChannel1).toEqual(DELIVERY)
      expect(deliveryChannel2).toEqual(PICKUP_IN_STORE)
    })
  })

  describe('isCurrentChannel', () => {
    it('should return false if empty params are passed', () => {
      const isCurrentChannel1 = isCurrentChannel()
      const isCurrentChannel2 = isCurrentChannel({}, '')
      const isCurrentChannel3 = isPickup({})
      const isCurrentChannel4 = isDelivery({})

      expect(isCurrentChannel1).toBeFalsy()
      expect(isCurrentChannel2).toBeFalsy()
      expect(isCurrentChannel3).toBeFalsy()
      expect(isCurrentChannel4).toBeFalsy()
    })

    it('should return false if not matching channels are passed', () => {
      const isCurrentChannel1 = isCurrentChannel(PICKUP_IN_STORE, DELIVERY)
      const isCurrentChannel2 = isCurrentChannel(slas.pickupNormalSla, DELIVERY)
      const isCurrentChannel3 = isDelivery(slas.pickupNormalSla)
      const isCurrentChannel4 = isCurrentChannel(DELIVERY, PICKUP_IN_STORE)
      const isCurrentChannel5 = isCurrentChannel(
        slas.normalSla,
        PICKUP_IN_STORE
      )
      const isCurrentChannel6 = isPickup(slas.normalSla)

      expect(isCurrentChannel1).toBeFalsy()
      expect(isCurrentChannel2).toBeFalsy()
      expect(isCurrentChannel3).toBeFalsy()
      expect(isCurrentChannel4).toBeFalsy()
      expect(isCurrentChannel5).toBeFalsy()
      expect(isCurrentChannel6).toBeFalsy()
    })

    it('should return true if same valid strings are passed', () => {
      const isCurrentChannel1 = isCurrentChannel(DELIVERY, DELIVERY)
      const isCurrentChannel2 = isCurrentChannel(
        PICKUP_IN_STORE,
        PICKUP_IN_STORE
      )

      expect(isCurrentChannel1).toBeTruthy()
      expect(isCurrentChannel2).toBeTruthy()
    })

    it('should return true if valid slas and channels are passed', () => {
      const isCurrentChannel1 = isCurrentChannel(slas.normalSla, DELIVERY)
      const isCurrentChannel2 = isCurrentChannel(
        slas.pickupNormalSla,
        PICKUP_IN_STORE
      )

      expect(isCurrentChannel1).toBeTruthy()
      expect(isCurrentChannel2).toBeTruthy()
    })

    it('should return true if using isPickup and isDelivery proxies are used', () => {
      const isCurrentChannel1 = isDelivery(slas.normalSla)
      const isCurrentChannel2 = isPickup(slas.pickupNormalSla)

      expect(isCurrentChannel1).toBeTruthy()
      expect(isCurrentChannel2).toBeTruthy()
    })
  })

  describe('findChannelById', () => {
    it('should return null if empty params are passed', () => {
      const deliveryChannel1 = findChannelById()
      const deliveryChannel2 = findChannelById({}, '')
      const deliveryChannel3 = findChannelById({ deliveryChannels: [] }, '')
      const deliveryChannel4 = findChannelById(
        { deliveryChannels: [] },
        DELIVERY
      )
      const deliveryChannel5 = findChannelById(
        { deliveryChannels: [DELIVERY] },
        ''
      )

      expect(deliveryChannel1).toBeNull()
      expect(deliveryChannel2).toBeNull()
      expect(deliveryChannel3).toBeNull()
      expect(deliveryChannel4).toBeNull()
      expect(deliveryChannel5).toBeNull()
    })

    it('should return null if doesnt find channel', () => {
      const deliveryChannel1 = findChannelById(
        { deliveryChannels: [deliveryChannelObj] },
        PICKUP_IN_STORE
      )
      const deliveryChannel2 = findChannelById(
        { deliveryChannels: [pickupChannelObj] },
        DELIVERY
      )

      expect(deliveryChannel1).toBeNull()
      expect(deliveryChannel2).toBeNull()
    })

    it('should find delivery channel if valid item is passed', () => {
      const deliveryChannel1 = findChannelById(
        { deliveryChannels: [deliveryChannelObj] },
        DELIVERY
      )
      const deliveryChannel2 = findChannelById(
        { deliveryChannels: [deliveryChannelObj, pickupChannelObj] },
        DELIVERY
      )
      const deliveryChannel3 = findChannelById(
        { deliveryChannels: [pickupChannelObj] },
        PICKUP_IN_STORE
      )
      const deliveryChannel4 = findChannelById(
        { deliveryChannels: [deliveryChannelObj, pickupChannelObj] },
        PICKUP_IN_STORE
      )

      expect(deliveryChannel1).toEqual(deliveryChannelObj)
      expect(deliveryChannel2).toEqual(deliveryChannelObj)
      expect(deliveryChannel3).toEqual(pickupChannelObj)
      expect(deliveryChannel4).toEqual(pickupChannelObj)
    })
  })
})

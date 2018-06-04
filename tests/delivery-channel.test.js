// import {
//   baseLogisticsInfo,
//   createItems,
//   createPackage,
//   expressSla,
//   normalFastestSla,
//   normalSla,
//   pickupNormalSla,
//   pickupSla,
//   residentialAddress,
// } from './mockGenerator'
//
// import orderMock from './Order'
import { getDeliveryChannel } from '../src/delivery-channel'

describe('Delivery channel', () => {
  describe('getDeliveryChannel', () => {
    it('should return null if empty params are passed', () => {
      const deliveryChannel1 = getDeliveryChannel()
      const deliveryChannel2 = getDeliveryChannel({})
      expect(deliveryChannel1).toBeNull()
      expect(deliveryChannel2).toBeNull()
    })
  })
})

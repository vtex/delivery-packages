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
import { getFirstScheduledDelivery } from '../src/scheduled-delivery'

describe('Scheduled delivery', () => {
  describe('getFirstScheduledDelivery', () => {
    it('should return null if empty params are passed', () => {
      const scheduledDelivery1 = getFirstScheduledDelivery()
      const scheduledDelivery2 = getFirstScheduledDelivery([], null, [])
      expect(scheduledDelivery1).toBeNull()
      expect(scheduledDelivery2).toBeNull()
    })
  })
})

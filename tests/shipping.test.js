import { getNewLogisticsInfoWithSelectedScheduled } from '../src/shipping'

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

describe('Shipping', () => {
  describe('getNewLogisticsInfoWithSelectedScheduled', () => {
    it('should return null if empty params are passed', () => {
      const newLogisticsInfo1 = getNewLogisticsInfoWithSelectedScheduled()
      const newLogisticsInfo2 = getNewLogisticsInfoWithSelectedScheduled(
        [],
        null,
        []
      )
      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
    })
  })
})

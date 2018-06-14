import {
  getFirstScheduledDelivery,
  areDeliveryWindowsEquals,
  areAvailableDeliveryWindowsEquals,
} from '../src/scheduled-delivery'

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

describe('Scheduled delivery', () => {
  describe('areDeliveryWindowsEquals', () => {
    it('should return false if empty params are passed', () => {
      expect(areDeliveryWindowsEquals()).toBeFalsy()
      expect(areDeliveryWindowsEquals(null, null)).toBeFalsy()
    })

    it('should return true if params are equal', () => {
      const deliveryWindow1 = {
        startDateUtc: '2018-05-26T09:00:00+00:00',
        endDateUtc: '2018-05-26T21:00:00+00:00',
        price: 500,
        lisPrice: 500,
        tax: 0,
      }
      const deliveryWindow2 = {
        startDateUtc: '2018-05-26T09:00:00+00:00',
        endDateUtc: '2018-05-26T21:00:00+00:00',
        price: 500,
        lisPrice: 500,
        tax: 0,
      }

      expect(
        areDeliveryWindowsEquals(deliveryWindow1, deliveryWindow2)
      ).toBeTruthy()

      expect(
        areDeliveryWindowsEquals(deliveryWindow1, deliveryWindow1)
      ).toBeTruthy()
    })
  })

  describe('areAvailableDeliveryWindowsEquals', () => {
    it('should return false if empty params are passed', () => {
      expect(areAvailableDeliveryWindowsEquals()).toBeFalsy()
      expect(areAvailableDeliveryWindowsEquals(null, null)).toBeFalsy()
    })

    it('should return true if params are equal', () => {
      const availableDeliveryWindows1 = [
        {
          startDateUtc: '2018-05-26T09:00:00+00:00',
          endDateUtc: '2018-05-26T21:00:00+00:00',
          price: 500,
          lisPrice: 500,
          tax: 0,
        },
        {
          startDateUtc: '2018-05-26T12:00:00+00:00',
          endDateUtc: '2018-05-26T13:00:00+00:00',
          price: 500,
          lisPrice: 500,
          tax: 0,
        },
      ]

      const availableDeliveryWindows2 = [
        {
          startDateUtc: '2018-05-26T09:00:00+00:00',
          endDateUtc: '2018-05-26T21:00:00+00:00',
          price: 500,
          lisPrice: 500,
          tax: 0,
        },
        {
          startDateUtc: '2018-05-26T12:00:00+00:00',
          endDateUtc: '2018-05-26T13:00:00+00:00',
          price: 500,
          lisPrice: 500,
          tax: 0,
        },
      ]

      expect(
        areAvailableDeliveryWindowsEquals(
          availableDeliveryWindows1,
          availableDeliveryWindows2
        )
      ).toBeTruthy()
    })
  })

  describe('getFirstScheduledDelivery', () => {
    it('should return null if empty params are passed', () => {
      const scheduledDelivery1 = getFirstScheduledDelivery()
      const scheduledDelivery2 = getFirstScheduledDelivery([], null, [])
      expect(scheduledDelivery1).toBeNull()
      expect(scheduledDelivery2).toBeNull()
    })
  })
})

import {
  getFirstScheduledDelivery,
  areDeliveryWindowsEquals,
  areAvailableDeliveryWindowsEquals,
  selectDeliveryWindow,
  getScheduledDeliverySLA,
} from '../src/scheduled-delivery'

import {
  createLogisticsInfo,
  availableDeliveryWindows,
  slas,
} from './mockGenerator'

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

  describe('selectDeliveryWindow', () => {
    it('should return null if empty params are passed', () => {
      const newLogisticsInfo1 = selectDeliveryWindow()
      const newLogisticsInfo2 = selectDeliveryWindow(null, null)
      const newLogisticsInfo3 = selectDeliveryWindow([{}], {})

      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
      expect(newLogisticsInfo3).toBeNull()
    })

    it('should return correct new logisticsInfo if valid logisticInfo and deliveryWindow are passed', () => {
      let logisticsInfo = createLogisticsInfo(
        ['normalSla', 'expressSla', 'normalScheduledDeliverySla'],
        3
      )
      logisticsInfo = [
        { ...logisticsInfo[0], selectedSla: 'Agendada' },
        { ...logisticsInfo[1], selectedSla: 'Normal' },
        { ...logisticsInfo[2], selectedSla: 'Agendada' },
      ]
      const deliveryWindow = availableDeliveryWindows[0]

      const expectedNewLogisticsInfo = [
        {
          ...logisticsInfo[0],
          deliveryWindow,
          slas: [
            logisticsInfo[0].slas[0],
            logisticsInfo[0].slas[1],
            { ...logisticsInfo[0].slas[2], deliveryWindow },
          ],
        },
        logisticsInfo[1], // should not change a not scheduled delivery
        {
          ...logisticsInfo[2],
          deliveryWindow,
          slas: [
            logisticsInfo[0].slas[0],
            logisticsInfo[0].slas[1],
            { ...logisticsInfo[0].slas[2], deliveryWindow },
          ],
        },
      ]

      const newLogisticsInfo = selectDeliveryWindow(logisticsInfo, {
        sla: 'Agendada',
        deliveryWindow,
      })

      expect(newLogisticsInfo).toEqual(expectedNewLogisticsInfo)
    })
  })

  describe('getScheduledDeliverySLA', () => {
    it('should return null if empty params are passed', () => {
      const scheduledDelivery1 = getScheduledDeliverySLA()
      const scheduledDelivery2 = getScheduledDeliverySLA({}, null)

      expect(scheduledDelivery1).toBeNull()
      expect(scheduledDelivery2).toBeNull()
    })

    it('should return first valid scheduled delivery if a logisticInfo item is passed', () => {
      const li = createLogisticsInfo(
        [
          'normalSla',
          'expressSla',
          'normalScheduledDeliverySla',
          'biggerWindowScheduledDeliverySla',
        ],
        1
      )[0]

      const expectedScheduledDelivery = slas.normalScheduledDeliverySla

      const scheduledDelivery = getScheduledDeliverySLA(li)

      expect(scheduledDelivery).toEqual(expectedScheduledDelivery)
    })

    it('should return first valid scheduled delivery if a logisticInfo item and specific availableDeliveryWindows are passed', () => {
      const li = createLogisticsInfo(
        [
          'normalSla',
          'expressSla',
          'normalScheduledDeliverySla',
          'biggerWindowScheduledDeliverySla',
        ],
        1
      )[0]

      const expectedScheduledDelivery = slas.biggerWindowScheduledDeliverySla

      const scheduledDelivery = getScheduledDeliverySLA(
        li,
        availableDeliveryWindows
      )

      expect(scheduledDelivery).toEqual(expectedScheduledDelivery)
    })
  })

  describe('getFirstScheduledDelivery', () => {
    it('should return null if empty params are passed', () => {
      const scheduledDelivery1 = getFirstScheduledDelivery()
      const scheduledDelivery2 = getFirstScheduledDelivery([], null, [])
      expect(scheduledDelivery1).toBeNull()
      expect(scheduledDelivery2).toBeNull()
    })

    it('should return first valid scheduled delivery if logisticInfo is passed', () => {
      const logisticInfo = [
        ...createLogisticsInfo(['normalSla', 'expressSla'], 1),
        ...createLogisticsInfo(
          [
            'normalSla',
            'expressSla',
            'normalScheduledDeliverySla',
            'biggerWindowScheduledDeliverySla',
          ],
          1
        ),
        ...createLogisticsInfo(['normalSla', 'expressSla'], 1),
      ]

      const expectedScheduledDelivery = slas.normalScheduledDeliverySla

      const scheduledDelivery = getFirstScheduledDelivery(logisticInfo)

      expect(scheduledDelivery).toEqual(expectedScheduledDelivery)
    })

    it('should return first valid scheduled delivery if logisticInfo and specific availableDeliveryWindows are passed', () => {
      const logisticInfo = [
        ...createLogisticsInfo(['normalSla', 'expressSla'], 1),
        ...createLogisticsInfo(
          [
            'normalSla',
            'expressSla',
            'normalScheduledDeliverySla',
            'biggerWindowScheduledDeliverySla',
          ],
          1
        ),
        ...createLogisticsInfo(['normalSla', 'expressSla'], 1),
      ]

      const expectedScheduledDelivery = slas.biggerWindowScheduledDeliverySla

      const scheduledDelivery = getFirstScheduledDelivery(
        logisticInfo,
        availableDeliveryWindows
      )

      expect(scheduledDelivery).toEqual(expectedScheduledDelivery)
    })
  })
})

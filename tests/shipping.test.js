import {
  getLogisticsInfoData,
  hydratePackageWithLogisticsExtraInfo,
  getNewLogisticsInfo,
  getNewLogisticsInfoWithSelectedScheduled,
} from '../src/shipping'

import { createLogisticsInfo, slas } from './mockGenerator'

describe('Shipping', () => {
  // { itemIndex, logisticsInfo }
  describe('getLogisticsInfoData', () => {
    it('should return null if empty params are passed', () => {
      const newLogisticsInfo1 = getLogisticsInfoData()
      const newLogisticsInfo2 = getLogisticsInfoData({})

      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
    })

    it('should return new completed logisticInfo if logisticInfo param is passed', () => {
      let logisticsInfo = [
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

      logisticsInfo = [
        logisticsInfo[0],
        { ...logisticsInfo[1], selectedSla: slas.biggerWindowScheduledDeliverySla.id },
        logisticsInfo[2],
      ]

      const expectedNewLogisticsInfoItem = {
        deliveryChannel: 'delivery',
        deliveryIds: slas.biggerWindowScheduledDeliverySla.deliveryIds,
        deliveryWindow: slas.biggerWindowScheduledDeliverySla.deliveryWindow,
        selectedSla: slas.biggerWindowScheduledDeliverySla.id,
        shippingEstimate: slas.biggerWindowScheduledDeliverySla.shippingEstimate,
        shippingEstimateDate: slas.biggerWindowScheduledDeliverySla.shippingEstimateDate,
        slas: logisticsInfo[1].slas,
      }

      const newLogisticsInfo = getLogisticsInfoData({
        itemIndex: 1,
        logisticsInfo,
      })

      expect(newLogisticsInfo).toEqual(expectedNewLogisticsInfoItem)
    })
  })

  // pkg, logisticsInfo, selectedAddresses
  describe('hydratePackageWithLogisticsExtraInfo', () => {
    it('should return null if empty params are passed', () => {
      const newPkg1 = hydratePackageWithLogisticsExtraInfo()
      const newPkg2 = hydratePackageWithLogisticsExtraInfo(null, [], '')

      expect(newPkg1).toBeNull()
      expect(newPkg2).toBeNull()
    })
  })

  // logisticsInfo, selectedSla, availableDeliveryWindows = null
  describe('getNewLogisticsInfo', () => {
    it('should return null if empty params are passed', () => {
      const newLogisticsInfo1 = getNewLogisticsInfo()
      const newLogisticsInfo2 = getNewLogisticsInfo(null, '', null)

      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
    })
  })

  // logisticsInfo
  describe('getNewLogisticsInfoWithSelectedScheduled', () => {
    it('should return null if empty params are passed', () => {
      const newLogisticsInfo1 = getNewLogisticsInfoWithSelectedScheduled()
      const newLogisticsInfo2 = getNewLogisticsInfoWithSelectedScheduled([])

      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
    })
  })
})

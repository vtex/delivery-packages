import {
  getLogisticsInfoData,
  hydratePackageWithLogisticsExtraInfo,
  getNewLogisticsInfo,
  getNewLogisticsInfoWithSelectedScheduled,
} from '../src/shipping'
import { getDeliveredItems } from '../src/items'

import {
  createLogisticsInfo,
  createItems,
  createPackage,
  slas,
  addresses,
  availableDeliveryWindows,
} from './mockGenerator'

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
        {
          ...logisticsInfo[1],
          selectedSla: slas.biggerWindowScheduledDeliverySla.id,
        },
        logisticsInfo[2],
      ]

      const expectedNewLogisticsInfoItem = {
        deliveryChannel: 'delivery',
        deliveryIds: slas.biggerWindowScheduledDeliverySla.deliveryIds,
        deliveryWindow: slas.biggerWindowScheduledDeliverySla.deliveryWindow,
        selectedSla: slas.biggerWindowScheduledDeliverySla.id,
        shippingEstimate:
          slas.biggerWindowScheduledDeliverySla.shippingEstimate,
        shippingEstimateDate:
          slas.biggerWindowScheduledDeliverySla.shippingEstimateDate,
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

    it('should return hydrated pkg if valid delivery params are passed', () => {
      const items = createItems(2)
      const packages = [
        createPackage([
          { itemIndex: 0, quantity: 1 },
          { itemIndex: 1, quantity: 1 },
        ]),
      ]
      const itemsWithIndex = items.map((item, index) => ({ ...item, index }))
      const packagesWithIndex = packages.map((pack, index) => ({
        ...pack,
        index,
      }))
      const logisticsInfo = [
        {
          ...createLogisticsInfo(['normalSla', 'expressSla'], 1)[0],
          selectedSla: slas.normalSla.id,
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupNormalSla'], 1)[0],
          selectedSla: slas.pickupNormalSla.id,
          addressId: addresses.pickupPointAddress.addressId,
        },
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const deliveredItems = getDeliveredItems({
        items: itemsWithIndex,
        packages: packagesWithIndex,
      })
      const pkg = deliveredItems.delivered[0]

      const expectedNewPkg = {
        ...pkg,
        pickupFriendlyName: null,
        deliveryIds: undefined,
        deliveryWindow: null,
        deliveryChannel: 'delivery',
        selectedSla: slas.normalSla.id,
        address: addresses.residentialAddress,
        shippingEstimate: slas.normalSla.shippingEstimate,
        shippingEstimateDate: slas.normalSla.shippingEstimateDate,
        slas: logisticsInfo[0].slas,
      }

      const newPkg = hydratePackageWithLogisticsExtraInfo(
        pkg,
        logisticsInfo,
        selectedAddresses
      )

      expect(newPkg).toEqual(expectedNewPkg)
    })

    it('should return hydrated pkg if valid scheduled delivery params are passed', () => {
      const items = createItems(2)
      const packages = [
        createPackage([
          { itemIndex: 0, quantity: 1 },
          { itemIndex: 1, quantity: 1 },
        ]),
      ]
      const itemsWithIndex = items.map((item, index) => ({ ...item, index }))
      const packagesWithIndex = packages.map((pack, index) => ({
        ...pack,
        index,
      }))
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          selectedSla: slas.normalScheduledDeliverySla.id,
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupNormalSla'], 1)[0],
          selectedSla: slas.pickupNormalSla.id,
          addressId: addresses.pickupPointAddress.addressId,
        },
      ]
      logisticsInfo[0].slas[1].deliveryWindow = availableDeliveryWindows[1]
      const selectedAddresses = [addresses.residentialAddress]
      const deliveredItems = getDeliveredItems({
        items: itemsWithIndex,
        packages: packagesWithIndex,
      })
      const pkg = deliveredItems.delivered[0]

      const expectedNewPkg = {
        ...pkg,
        pickupFriendlyName: null,
        deliveryIds: undefined,
        deliveryChannel: 'delivery',
        deliveryWindow: availableDeliveryWindows[1],
        selectedSla: slas.normalScheduledDeliverySla.id,
        address: addresses.residentialAddress,
        shippingEstimate: slas.normalScheduledDeliverySla.shippingEstimate,
        shippingEstimateDate: slas.normalScheduledDeliverySla.shippingEstimateDate,
        slas: logisticsInfo[0].slas,
      }

      const newPkg = hydratePackageWithLogisticsExtraInfo(
        pkg,
        logisticsInfo,
        selectedAddresses
      )

      expect(newPkg).toEqual(expectedNewPkg)
    })

    it('should return hydrated pkg if valid pickup params are passed', () => {
      const items = createItems(2)
      const packages = [
        createPackage([
          { itemIndex: 0, quantity: 1 },
          { itemIndex: 1, quantity: 1 },
        ]),
      ]
      const itemsWithIndex = items.map((item, index) => ({ ...item, index }))
      const packagesWithIndex = packages.map((pack, index) => ({
        ...pack,
        index,
      }))
      const logisticsInfo = [
        {
          ...createLogisticsInfo(['normalSla', 'expressSla'], 1)[0],
          selectedSla: slas.normalSla.id,
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          selectedSla: slas.pickupSla.id,
          addressId: addresses.pickupPointAddress.addressId,
        },
      ]
      const selectedAddresses = [
        addresses.residentialAddress,
        addresses.pickupPointAddress,
      ]
      const deliveredItems = getDeliveredItems({
        items: itemsWithIndex,
        packages: packagesWithIndex,
      })
      const pkg = deliveredItems.delivered[1]

      const expectedNewPkg = {
        ...pkg,
        deliveryIds: undefined,
        deliveryWindow: null,
        deliveryChannel: 'pickup-in-point',
        pickupFriendlyName: slas.pickupSla.pickupStoreInfo.friendlyName,
        selectedSla: slas.pickupSla.id,
        address: addresses.pickupPointAddress,
        shippingEstimate: slas.pickupSla.shippingEstimate,
        shippingEstimateDate: slas.pickupSla.shippingEstimateDate,
        slas: logisticsInfo[1].slas,
      }

      const newPkg = hydratePackageWithLogisticsExtraInfo(
        pkg,
        logisticsInfo,
        selectedAddresses
      )

      expect(newPkg).toEqual(expectedNewPkg)
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

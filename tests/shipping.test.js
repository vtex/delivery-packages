import {
  getLogisticsInfoData,
  hydratePackageWithLogisticsExtraInfo,
  getNewLogisticsInfo,
  getNewLogisticsInfoWithSelectedScheduled,
  filterLogisticsInfo,
  getNewLogisticsInfoWithScheduledDeliveryChoice,
  replaceAddressIdOnLogisticsInfo,
  getNewLogisticsMatchingSelectedAddresses,
  fillGapsInLogisticsInfo,
  mergeLogisticsInfos,
} from '../src/shipping'
import { SEARCH } from '../src/constants'
import { getDeliveredItems } from '../src/items'

import {
  baseLogisticsInfo,
  createLogisticsInfo,
  createLogisticsInfoItem,
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

    it('should return new completed logisticsInfo if logisticsInfo param is passed', () => {
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
        selectedSlaObj: slas.biggerWindowScheduledDeliverySla,
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
        selectedSlaObj: slas.normalSla,
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
        selectedSlaObj: {
          ...slas.normalScheduledDeliverySla,
          deliveryWindow: availableDeliveryWindows[1],
        },
        address: addresses.residentialAddress,
        shippingEstimate: slas.normalScheduledDeliverySla.shippingEstimate,
        shippingEstimateDate:
          slas.normalScheduledDeliverySla.shippingEstimateDate,
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
        selectedSlaObj: slas.pickupSla,
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

    it('should return the pickup point address receiverName', () => {
      const items = createItems(1)
      const packages = [createPackage([{ itemIndex: 0, quantity: 1 }])]
      const itemsWithIndex = items.map((item, index) => ({ ...item, index }))
      const packagesWithIndex = packages.map((pack, index) => ({
        ...pack,
        index,
      }))
      const logisticsInfo = [
        {
          ...baseLogisticsInfo.pickup,
          itemIndex: 0,
          slas: [slas.pickupSla],
        },
      ]
      const selectedAddresses = [addresses.pickupPointAddress]
      const deliveredItems = getDeliveredItems({
        items: itemsWithIndex,
        packages: packagesWithIndex,
      })
      const pkg = deliveredItems.delivered[0]

      const result = hydratePackageWithLogisticsExtraInfo(
        pkg,
        logisticsInfo,
        selectedAddresses
      )

      expect(result.address.receiverName).toBe(
        addresses.pickupPointAddress.receiverName
      )
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

    it('should return logisticsInfo with selectedSlas if valid params are passed', () => {
      const logisticsInfo = [
        ...createLogisticsInfo(['normalSla', 'expressSla'], 1),
        ...createLogisticsInfo(['normalSla', 'pickupSla'], 1),
        ...createLogisticsInfo(['normalSla', 'normalScheduledDeliverySla'], 1),
      ]

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        slas.normalSla.id
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return logisticsInfo with selectedSlas if valid delivery params are passed', () => {
      const logisticsInfo = [
        ...createLogisticsInfo(['normalSla', 'expressSla'], 1),
        ...createLogisticsInfo(['normalSla', 'pickupSla'], 1),
        ...createLogisticsInfo(['normalSla', 'normalScheduledDeliverySla'], 1),
      ]

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        slas.normalSla.id
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return logisticsInfo with selectedSlas if valid scheduled delivery params are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(['normalSla', 'expressSla'], 1)[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        slas.normalScheduledDeliverySla.id
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return logisticsInfo with selectedSlas if scheduled delivery with specific deliveryWindows are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(['normalSla', 'expressSla'], 1)[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]
      const selectDeliveryWindows = availableDeliveryWindows.slice(0, 2)
      logisticsInfo[1].slas[1].availableDeliveryWindows = selectDeliveryWindows

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        slas.normalScheduledDeliverySla.id,
        selectDeliveryWindows
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return logisticsInfo with selectedSlas if valid pickup params are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(['normalSla', 'expressSla'], 1)[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: 'pickup-in-point',
          selectedSla: slas.pickupSla.id,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfo(
        logisticsInfo,
        slas.pickupSla.id
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })

  describe('getNewLogisticsInfoWithSelectedScheduled', () => {
    it('should return null if empty params are passed', () => {
      const newLogisticsInfo1 = getNewLogisticsInfoWithSelectedScheduled()
      const newLogisticsInfo2 = getNewLogisticsInfoWithSelectedScheduled([])

      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
    })

    it('should return logisticsInfo with selectedSlas if valid scheduled delivery params are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'biggerWindowScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.biggerWindowScheduledDeliverySla.id,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfoWithSelectedScheduled(
        logisticsInfo
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return new logisticsInfo with scheduled delivery as selected slas if valid params are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'biggerWindowScheduledDeliverySla'],
            1
          )[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
          itemIndex: 2,
          itemId: 2,
        },
      ]

      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.biggerWindowScheduledDeliverySla.id,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalSla.id,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfoWithSelectedScheduled(
        logisticsInfo
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return same logisticsInfo with selectedSlas if slas are already selected', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'biggerWindowScheduledDeliverySla'],
            1
          )[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.biggerWindowScheduledDeliverySla.id,
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
          itemIndex: 2,
          itemId: 2,
        },
      ]

      const expectedLogisticsInfo = [...logisticsInfo]

      const newLogisticsInfo = getNewLogisticsInfoWithSelectedScheduled(
        logisticsInfo
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })

  describe('filterLogisticsInfo', () => {
    it('should return empty array if invalid params are passed', () => {
      const newLogisticsInfo1 = filterLogisticsInfo()
      const newLogisticsInfo2 = filterLogisticsInfo([])
      const newLogisticsInfo3 = filterLogisticsInfo([], {})

      expect(newLogisticsInfo1).toEqual([])
      expect(newLogisticsInfo2).toEqual([])
      expect(newLogisticsInfo3).toEqual([])
    })

    it('should return logisticsInfo filtered when items with itemIndex are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]
      const items = [{ itemIndex: 0 }, { itemIndex: 2 }]

      const expectedLogisticsInfo = [logisticsInfo[0], logisticsInfo[2]]

      const newLogisticsInfo = filterLogisticsInfo(logisticsInfo, { items })

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return logisticsInfo filtered when items with index are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]
      const items = [{ index: 0 }, { index: 2 }]

      const expectedLogisticsInfo = [logisticsInfo[0], logisticsInfo[2]]

      const newLogisticsInfo = filterLogisticsInfo(logisticsInfo, { items })

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return new logisticsInfo with null on missing elements if keepSize argument is passed as true', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]
      const items = [{ index: 0 }, { index: 2 }]

      const expectedLogisticsInfo = [logisticsInfo[0], null, logisticsInfo[2]]

      const keepSize = true

      const newLogisticsInfo = filterLogisticsInfo(
        logisticsInfo,
        { items },
        keepSize
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })

  describe('getNewLogisticsInfoWithScheduledDeliveryChoice', () => {
    it('should return null if invalid params are passed', () => {
      const newLogisticsInfo1 = getNewLogisticsInfoWithScheduledDeliveryChoice()
      const newLogisticsInfo2 = getNewLogisticsInfoWithScheduledDeliveryChoice(
        []
      )
      const newLogisticsInfo3 = getNewLogisticsInfoWithScheduledDeliveryChoice(
        [{ index: 0 }],
        { deliveryWindow: null, selectedSla: null }
      )

      expect(newLogisticsInfo1).toBeNull()
      expect(newLogisticsInfo2).toBeNull()
      expect(newLogisticsInfo3).toBeNull()
    })

    it('should return logisticsInfo with selectedSlas and delivery window if valid scheduled delivery params are passed', () => {
      const logisticsInfo = [
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 0,
          itemId: 0,
        },
        {
          ...createLogisticsInfo(['normalSla', 'pickupSla'], 1)[0],
          itemIndex: 1,
          itemId: 1,
        },
        {
          ...createLogisticsInfo(
            ['normalSla', 'normalScheduledDeliverySla'],
            1
          )[0],
          itemIndex: 2,
          itemId: 2,
        },
      ]
      const scheduledDeliveryItems = [logisticsInfo[0], logisticsInfo[2]]
      const deliveryWindow = availableDeliveryWindows[0]
      const selectedSla = slas.normalScheduledDeliverySla.id
      const scheduledDeliveryChoice = {
        selectedSla,
        deliveryWindow,
      }

      const expectedNewScheduledDeliverySlas = logisticsInfo[0].slas.map(
        sla => ({
          ...sla,
          deliveryWindow: sla.id === selectedSla ? deliveryWindow : null,
        })
      )
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
          deliveryWindow,
          slas: expectedNewScheduledDeliverySlas,
        },
        {
          ...logisticsInfo[1],
          selectedDeliveryChannel: null,
          selectedSla: null,
        },
        {
          ...logisticsInfo[2],
          selectedDeliveryChannel: 'delivery',
          selectedSla: slas.normalScheduledDeliverySla.id,
          deliveryWindow,
          slas: expectedNewScheduledDeliverySlas,
        },
      ]

      const newLogisticsInfo = getNewLogisticsInfoWithScheduledDeliveryChoice(
        logisticsInfo,
        scheduledDeliveryChoice,
        scheduledDeliveryItems
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })

  describe('replaceAddressIdOnLogisticsInfo', () => {
    it('should return null if invalid params are passed', () => {
      const newLogisticsInfo1 = replaceAddressIdOnLogisticsInfo()
      const newLogisticsInfo2 = replaceAddressIdOnLogisticsInfo([])
      const newLogisticsInfo3 = replaceAddressIdOnLogisticsInfo([], [])

      expect(newLogisticsInfo1).toBeUndefined()
      expect(newLogisticsInfo2).toEqual([])
      expect(newLogisticsInfo3).toEqual([])
    })

    it('should return same logisticsInfo if all addressId are ok', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalSla',
          addressId: addresses.residentialAddress.addressId,
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalScheduledDeliverySla',
          addressId: addresses.residentialAddress.addressId,
          index: 1,
        }),
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const expectedLogisticsInfo = logisticsInfo

      const newLogisticsInfo = replaceAddressIdOnLogisticsInfo(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return correct logisticsInfo if all addressId are invalid', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalScheduledDeliverySla',
          index: 1,
        }),
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.residentialAddress.addressId,
        },
      ]

      const newLogisticsInfo = replaceAddressIdOnLogisticsInfo(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return correct logisticsInfo if one addressId are not present on selectedAddresses', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalSla',
          addressId: addresses.residentialAddress2.addressId,
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalScheduledDeliverySla',
          addressId: addresses.residentialAddress.addressId,
          index: 1,
        }),
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.residentialAddress.addressId,
        },
      ]

      const newLogisticsInfo = replaceAddressIdOnLogisticsInfo(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return correct logisticsInfo if all addressId are not present on selectedAddresses', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalSla',
          addressId: addresses.residentialAddress2.addressId,
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'normalScheduledDeliverySla'],
          selectedSla: 'normalScheduledDeliverySla',
          addressId: addresses.residentialAddress2.addressId,
          index: 1,
        }),
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.residentialAddress.addressId,
        },
      ]

      const newLogisticsInfo = replaceAddressIdOnLogisticsInfo(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return correct logisticsInfo if pickup slas are selected', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'normalScheduledDeliverySla'],
          selectedSla: 'pickupSla',
          addressId: addresses.residentialAddress.addressId,
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'pickupNormalSla'],
          selectedSla: 'pickupNormalSla',
          addressId: addresses.residentialAddress.addressId,
          index: 1,
        }),
      ]
      const selectedAddresses = [
        addresses.residentialAddress,
        addresses.pickupPointAddress,
        addresses.pickupPointAddress2,
      ]
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.pickupPointAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.pickupPointAddress2.addressId,
        },
      ]

      const newLogisticsInfo = replaceAddressIdOnLogisticsInfo(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })

  describe('getNewLogisticsMatchingSelectedAddresses', () => {
    it('should return empty if empty params are passed', () => {
      const {
        logisticsInfo: logisticsInfo1,
        selectedAddresses: selectedAddresses1,
      } = getNewLogisticsMatchingSelectedAddresses()

      const {
        logisticsInfo: logisticsInfo2,
        selectedAddresses: selectedAddresses2,
      } = getNewLogisticsMatchingSelectedAddresses([])

      const {
        logisticsInfo: logisticsInfo3,
        selectedAddresses: selectedAddresses3,
      } = getNewLogisticsMatchingSelectedAddresses([], [])

      expect(logisticsInfo1).toEqual([])
      expect(selectedAddresses1).toBeUndefined()

      expect(logisticsInfo2).toEqual([])
      expect(selectedAddresses2).toBeUndefined()

      expect(logisticsInfo3).toEqual([])
      expect(selectedAddresses3).toEqual([])
    })

    it('should maintain same logisticsInfo and selectedAddresses if nothing changed', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['normalSla', 'expressSla'],
          addressId: addresses.residentialAddress.addressId,
          selectedSla: 'normalSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'expressSla'],
          addressId: addresses.residentialAddress.addressId,
          selectedSla: 'normalSla',
          index: 1,
        }),
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const expectedLogisticsInfo = [...logisticsInfo]
      const expectedSelectedAddresses = [...selectedAddresses]

      const {
        logisticsInfo: newLogisticsInfo,
        selectedAddresses: newSelectedAddresses,
      } = getNewLogisticsMatchingSelectedAddresses(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
      expect(newSelectedAddresses).toEqual(expectedSelectedAddresses)
    })

    it('should create pickup address and match it if not present', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'normalScheduledDeliverySla'],
          selectedSla: 'pickupSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'pickupNormalSla'],
          selectedSla: 'pickupNormalSla',
          index: 1,
        }),
      ]
      const selectedAddresses = []
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.pickupPointAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.pickupPointAddress2.addressId,
        },
      ]
      const expectedSelectedAddresses = [
        { ...addresses.pickupPointAddress, addressType: SEARCH },
        { ...addresses.pickupPointAddress2, addressType: SEARCH },
      ]

      const {
        logisticsInfo: newLogisticsInfo,
        selectedAddresses: newSelectedAddresses,
      } = getNewLogisticsMatchingSelectedAddresses(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
      expect(newSelectedAddresses).toEqual(expectedSelectedAddresses)
    })

    it('should reassign addressIds on delivery changes', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'expressSla', 'normalScheduledDeliverySla'],
          addressId: addresses.residentialAddress2.addressId,
          selectedSla: 'normalScheduledDeliverySla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'expressSla', 'pickupNormalSla'],
          addressId: addresses.residentialAddress2.addressId,
          selectedSla: 'normalSla',
          index: 1,
        }),
      ]
      const selectedAddresses = [addresses.residentialAddress]
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.residentialAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.residentialAddress.addressId,
        },
      ]
      const expectedSelectedAddresses = [...selectedAddresses]

      const {
        logisticsInfo: newLogisticsInfo,
        selectedAddresses: newSelectedAddresses,
      } = getNewLogisticsMatchingSelectedAddresses(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
      expect(newSelectedAddresses).toEqual(expectedSelectedAddresses)
    })

    it('should reassign addressIds on delivery changes from pickups', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'expressSla', 'normalScheduledDeliverySla'],
          addressId: addresses.residentialAddress2.addressId,
          selectedSla: 'pickupSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['normalSla', 'expressSla', 'pickupNormalSla'],
          addressId: addresses.residentialAddress2.addressId,
          selectedSla: 'pickupNormalSla',
          index: 1,
        }),
      ]
      const selectedAddresses = [
        addresses.residentialAddress2,
        addresses.pickupPointAddress,
      ]
      const expectedLogisticsInfo = [
        {
          ...logisticsInfo[0],
          addressId: addresses.pickupPointAddress.addressId,
        },
        {
          ...logisticsInfo[1],
          addressId: addresses.pickupPointAddress2.addressId,
        },
      ]
      const expectedSelectedAddresses = [
        ...selectedAddresses,
        { ...addresses.pickupPointAddress2, addressType: SEARCH },
      ]

      const {
        logisticsInfo: newLogisticsInfo,
        selectedAddresses: newSelectedAddresses,
      } = getNewLogisticsMatchingSelectedAddresses(
        logisticsInfo,
        selectedAddresses
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
      expect(newSelectedAddresses).toEqual(expectedSelectedAddresses)
    })
  })

  describe('fillGapsInLogisticsInfo', () => {
    it('should return empty array when passing empty array', () => {
      expect(fillGapsInLogisticsInfo([])).toEqual([])
    })

    it('should return same logisticsInfo with no gaps', () => {
      const logisticsInfo = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      const expectedLogisticsInfo = logisticsInfo

      const newLogisticsInfo = fillGapsInLogisticsInfo(logisticsInfo)

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should complete the gaps of logisticsInfo', () => {
      const logisticsInfo = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      logisticsInfo[1] = null
      const expectedLogisticsInfo = [
        logisticsInfo[0],
        { itemIndex: 1 },
        logisticsInfo[2],
      ]

      const newLogisticsInfo = fillGapsInLogisticsInfo(logisticsInfo)

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
    it('should complete the gaps of logisticsInfo with null values if fillWithIndex is passed as false', () => {
      const logisticsInfo = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      logisticsInfo[1] = null
      const fillWithIndex = false
      const expectedLogisticsInfo = [logisticsInfo[0], null, logisticsInfo[2]]

      const newLogisticsInfo = fillGapsInLogisticsInfo(
        logisticsInfo,
        fillWithIndex
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })

  describe('mergeLogisticsInfos', () => {
    it('should return empty array when passing empty array', () => {
      expect(mergeLogisticsInfos()).toEqual([])
      expect(mergeLogisticsInfos([])).toEqual([])
      expect(mergeLogisticsInfos([], [])).toEqual([])
    })

    it('should return same logisticsInfo if empty logisticsInfo2 is passed', () => {
      const logisticsInfo1 = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      const expectedLogisticsInfo = logisticsInfo1

      const newLogisticsInfo = mergeLogisticsInfos(logisticsInfo1, [])

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return logisticsInfo2 if logisticsInfo1 is different than logisticsInfo2 and have the same size', () => {
      const logisticsInfo1 = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      const logisticsInfo2 = createLogisticsInfo(
        ['pickupSla', 'normalScheduledDeliverySla'],
        3
      )
      const expectedLogisticsInfo = logisticsInfo2

      const newLogisticsInfo = mergeLogisticsInfos(
        logisticsInfo1,
        logisticsInfo2
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return merged logisticsInfo if logisticsInfo1 is different than logisticsInfo2 and dont the same indexes', () => {
      const logisticsInfo1 = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      const logisticsInfo2 = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'normalScheduledDeliverySla'],
          selectedSla: 'pickupSla',
          index: 1,
        }),
      ]
      const expectedLogisticsInfo = [
        logisticsInfo1[0],
        logisticsInfo2[0],
        logisticsInfo1[2],
      ]

      const newLogisticsInfo = mergeLogisticsInfos(
        logisticsInfo1,
        logisticsInfo2
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return merged logisticsInfo if logisticsInfo1 is different than logisticsInfo2, dont the same indexes and both have null gaps', () => {
      const logisticsInfo1 = createLogisticsInfo(['pickupSla', 'expressSla'], 3)
      logisticsInfo1[1] = null
      const logisticsInfo2 = [
        null,
        createLogisticsInfoItem({
          slas: ['pickupSla', 'normalScheduledDeliverySla'],
          selectedSla: 'pickupSla',
          index: 1,
        }),
      ]
      const expectedLogisticsInfo = [
        logisticsInfo1[0],
        logisticsInfo2[1],
        logisticsInfo1[2],
      ]

      const newLogisticsInfo = mergeLogisticsInfos(
        logisticsInfo1,
        logisticsInfo2
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })

    it('should return merged logisticsInfo if logisticsInfo1 is different than logisticsInfo2, dont the same indexes and both have gaps', () => {
      const logisticsInfo1 = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'expressSla'],
          selectedSla: 'expressSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['pickupSla', 'expressSla'],
          selectedSla: 'expressSla',
          index: 2,
        }),
      ]
      const logisticsInfo2 = [
        createLogisticsInfoItem({
          slas: ['pickupSla', 'normalScheduledDeliverySla'],
          selectedSla: 'pickupSla',
          index: 1,
        }),
      ]
      const expectedLogisticsInfo = [
        logisticsInfo1[0],
        logisticsInfo2[0],
        logisticsInfo1[1],
      ]

      const newLogisticsInfo = mergeLogisticsInfos(
        logisticsInfo1,
        logisticsInfo2
      )

      expect(newLogisticsInfo).toEqual(expectedLogisticsInfo)
    })
  })
})

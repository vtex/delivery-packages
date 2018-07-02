import {
  getSelectedSla,
  getSlaObj,
  findSlaWithChannel,
  getSelectedSlaInSlas,
  getSelectedSlaIfMatchSlaId,
  hasDeliveryWindows,
  hasSLAs,
  excludePickupTypeFromSlas,
} from '../src/sla'
import { DELIVERY, PICKUP_IN_STORE } from '../src/constants'

import {
  createLogisticsInfo,
  slas,
  availableDeliveryWindows,
} from './mockGenerator'

describe('Sla', () => {
  describe('getSelectedSla', () => {
    it('should return null if empty params are passed', () => {
      const selectedSla1 = getSelectedSla()
      const selectedSla2 = getSelectedSla({})

      expect(selectedSla1).toBeNull()
      expect(selectedSla2).toBeNull()
    })

    it('should return correct logisticInfo if only itemIndex is passed', () => {
      const logisticsInfo = createLogisticsInfo(
        ['normalSla', 'expressSla', 'pickupSla'],
        3
      )

      const expectedSelectedSla = slas.expressSla

      const selectedSla = expectedSelectedSla.id

      logisticsInfo[0].selectedSla = selectedSla

      const newSelectedSla = getSelectedSla({
        logisticsInfo,
        itemIndex: 0,
      })

      expect(newSelectedSla).toEqual(expectedSelectedSla)
    })

    it('should return correct logisticInfo if valid selectedSla and itemIndex is passed', () => {
      const logisticsInfo = createLogisticsInfo(
        ['normalSla', 'expressSla', 'pickupSla'],
        3
      )

      const expectedSelectedSla = slas.expressSla

      const selectedSla = expectedSelectedSla.id

      logisticsInfo[0].selectedSla = selectedSla

      const newSelectedSla = getSelectedSla({
        logisticsInfo,
        selectedSla,
        itemIndex: 0,
      })

      expect(newSelectedSla).toEqual(expectedSelectedSla)
    })
  })

  describe('getSlaObj', () => {
    it('should return null if empty params are passed', () => {
      const sla1 = getSlaObj()
      const sla2 = getSlaObj([])
      const sla3 = getSlaObj([], '')

      expect(sla1).toBeNull()
      expect(sla2).toBeNull()
      expect(sla3).toBeNull()
    })

    it('should return null if slas and slaId is not found', () => {
      const logisticsInfoItem = createLogisticsInfo(
        ['normalSla', 'expressSla', 'pickupSla'],
        1
      )[0]
      const invalidSlaId = slas.normalScheduledDeliverySla.id

      const newSelectedSla = getSlaObj(logisticsInfoItem.slas, invalidSlaId)

      expect(newSelectedSla).toBeNull()
    })

    it('should return correct slaObj if slas and valid slaId is passed', () => {
      const logisticsInfoItem = createLogisticsInfo(
        ['normalSla', 'expressSla', 'pickupSla'],
        1
      )[0]

      const expectedSelectedSla = slas.expressSla
      const slaId = expectedSelectedSla.id

      const newSelectedSla = getSlaObj(logisticsInfoItem.slas, slaId)

      expect(newSelectedSla).toEqual(expectedSelectedSla)
    })
  })

  describe('findSlaWithChannel', () => {
    it('should return null if empty params are passed', () => {
      const sla1 = findSlaWithChannel()
      const sla2 = findSlaWithChannel(null, null)
      const sla3 = findSlaWithChannel({}, '')
      const sla4 = findSlaWithChannel({ slas: [] }, DELIVERY)

      expect(sla1).toBeNull()
      expect(sla2).toBeNull()
      expect(sla3).toBeNull()
      expect(sla4).toBeNull()
    })

    it('should find correct first sla if valid params are passed', () => {
      const slaDelivery = findSlaWithChannel(
        { slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla] },
        DELIVERY
      )

      const slaPickup = findSlaWithChannel(
        {
          slas: [
            slas.pickupSla,
            slas.normalSla,
            slas.expressSla,
            slas.pickupNormalSla,
          ],
        },
        PICKUP_IN_STORE
      )

      expect(slaDelivery).toEqual(slas.normalSla)

      expect(slaPickup).toEqual(slas.pickupSla)
    })
  })

  describe('getSelectedSlaInSlas', () => {
    it('should return null if empty params are passed', () => {
      const sla1 = getSelectedSlaInSlas()
      const sla2 = getSelectedSlaInSlas(null, null)
      const sla3 = getSelectedSlaInSlas({}, '')
      const sla4 = getSelectedSlaInSlas({ slas: [] }, slas.expressSla)

      expect(sla1).toBeNull()
      expect(sla2).toBeNull()
      expect(sla3).toBeNull()
      expect(sla4).toBeNull()
    })

    it('should return correct sla if complete item is passed', () => {
      const slaDelivery = getSelectedSlaInSlas({
        slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla],
        selectedSla: slas.normalSla.id,
      })
      const slaPickup = getSelectedSlaInSlas({
        slas: [
          slas.pickupSla,
          slas.normalSla,
          slas.expressSla,
          slas.pickupNormalSla,
        ],
        selectedSla: slas.pickupSla.id,
      })

      expect(slaDelivery).toEqual(slas.normalSla)
      expect(slaPickup).toEqual(slas.pickupSla)
    })

    it('should return correct sla if item and selectedSla are passed', () => {
      const slaDelivery = getSelectedSlaInSlas(
        {
          slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla],
          selectedSla: null,
        },
        slas.normalSla.id
      )
      const slaPickup = getSelectedSlaInSlas(
        {
          slas: [
            slas.pickupSla,
            slas.normalSla,
            slas.expressSla,
            slas.pickupNormalSla,
          ],
          selectedSla: null,
        },
        slas.pickupSla.id
      )

      expect(slaDelivery).toEqual(slas.normalSla)
      expect(slaPickup).toEqual(slas.pickupSla)
    })
  })

  describe('getSelectedSlaIfMatchSlaId', () => {
    it('should return null if empty params are passed', () => {
      const sla1 = getSelectedSlaIfMatchSlaId()
      const sla2 = getSelectedSlaIfMatchSlaId(null, null)
      const sla3 = getSelectedSlaIfMatchSlaId({}, '')
      const sla4 = getSelectedSlaIfMatchSlaId({ slas: [] }, slas.expressSla)
      const sla5 = getSelectedSlaIfMatchSlaId(
        {
          slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla],
          selectedSla: slas.normalSla.id,
        },
        ''
      )

      expect(sla1).toBeNull()
      expect(sla2).toBeNull()
      expect(sla3).toBeNull()
      expect(sla4).toBeNull()
      expect(sla5).toBeNull()
    })

    it('should return null if complete item but a no matching sla is passed', () => {
      const slaDelivery = getSelectedSlaIfMatchSlaId(
        {
          slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla],
          selectedSla: slas.normalSla.id,
        },
        slas.normalSla.id
      )
      const slaPickup = getSelectedSlaIfMatchSlaId(
        {
          slas: [
            slas.pickupSla,
            slas.normalSla,
            slas.expressSla,
            slas.pickupNormalSla,
          ],
          selectedSla: slas.pickupSla.id,
        },
        slas.pickupSla.id
      )

      expect(slaDelivery).toEqual(slas.normalSla)
      expect(slaPickup).toEqual(slas.pickupSla)
    })

    it('should return correct sla if complete item and matching sla is passed', () => {
      const slaDelivery = getSelectedSlaIfMatchSlaId(
        {
          slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla],
          selectedSla: slas.normalSla.id,
        },
        slas.normalSla.id
      )
      const slaPickup = getSelectedSlaIfMatchSlaId(
        {
          slas: [
            slas.pickupSla,
            slas.normalSla,
            slas.expressSla,
            slas.pickupNormalSla,
          ],
          selectedSla: slas.pickupSla.id,
        },
        slas.pickupSla.id
      )

      expect(slaDelivery).toEqual(slas.normalSla)
      expect(slaPickup).toEqual(slas.pickupSla)
    })
  })

  describe('hasDeliveryWindows', () => {
    it('should return false if empty params are passed', () => {
      const hasDeliveryWindow1 = hasDeliveryWindows()
      const hasDeliveryWindow2 = hasDeliveryWindows(null)
      const hasDeliveryWindow3 = hasDeliveryWindows({})

      expect(hasDeliveryWindow1).toBeFalsy()
      expect(hasDeliveryWindow2).toBeFalsy()
      expect(hasDeliveryWindow3).toBeFalsy()
    })

    it('should return false if empty availableDeliveryWindows is passed', () => {
      const hasDeliveryWindow = hasDeliveryWindows({
        availableDeliveryWindows: [],
      })

      expect(hasDeliveryWindow).toBeFalsy()
    })

    it('should return true if valid sla is passed', () => {
      const hasDeliveryWindow = hasDeliveryWindows({
        availableDeliveryWindows,
      })

      expect(hasDeliveryWindow).toBeTruthy()
    })

    it('should return true if valid array of slas is passed', () => {
      const hasDeliveryWindow = hasDeliveryWindows([
        { availableDeliveryWindows: [] },
        {},
        {
          availableDeliveryWindows,
        },
      ])

      expect(hasDeliveryWindow).toBeTruthy()
    })
  })

  describe('hasSLAs', () => {
    it('should return false if empty params are passed', () => {
      const hasSLAs1 = hasSLAs()
      const hasSLAs2 = hasSLAs(null)
      const hasSLAs3 = hasSLAs([])

      expect(hasSLAs1).toBeFalsy()
      expect(hasSLAs2).toBeFalsy()
      expect(hasSLAs3).toBeFalsy()
    })

    it('should return false if object with empty slas is passed', () => {
      const hasSLAs1 = hasSLAs({ slas: [] })

      expect(hasSLAs1).toBeFalsy()
    })

    it('should return true if object with valid slas is passed', () => {
      const hasSLAs1 = hasSLAs({
        slas: [slas.pickupSla, slas.normalSla, slas.pickupNormalSla],
      })
      const hasSLAs2 = hasSLAs({ slas: [slas.pickupSla] })

      expect(hasSLAs1).toBeTruthy()
      expect(hasSLAs2).toBeTruthy()
    })
  })

  describe('excludePickupTypeFromSlas', () => {
    it('should return false if empty params are passed', () => {
      const deliverySlas1 = excludePickupTypeFromSlas()
      const deliverySlas2 = excludePickupTypeFromSlas(null)
      const deliverySlas3 = excludePickupTypeFromSlas([])

      expect(deliverySlas1).toEqual([])
      expect(deliverySlas2).toEqual([])
      expect(deliverySlas3).toEqual([])
    })

    it('should return same slas if only passed delivery slas', () => {
      const slasObjs = [slas.expressSla, slas.normalSla, slas.normalFastestSla]

      const deliverySlas = excludePickupTypeFromSlas(slasObjs)

      expect(deliverySlas).toEqual(slasObjs)
    })

    it('should return only delivery slas if passed delivery slas and pickup slas', () => {
      const slasObjs = [
        slas.expressSla,
        slas.pickupNormalSla,
        slas.normalFastestSla,
      ]

      const expectedSlas = [
        slas.expressSla,
        slas.normalFastestSla,
      ]

      const deliverySlas = excludePickupTypeFromSlas(slasObjs)

      expect(deliverySlas).toEqual(expectedSlas)
    })
  })
})

import {
  getSelectedSla,
  findSlaWithChannel,
  getSelectedSlaInSlas,
  hasDeliveryWindows,
  hasSLAs,
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
})

import { createLogisticsInfo, slas } from './mockGenerator'

import { getSelectedSla, findSlaWithChannel } from '../src/sla'
import { DELIVERY, PICKUP_IN_STORE } from '../src/constants'

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
})

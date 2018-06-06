import { createLogisticsInfo, slas } from './mockGenerator'

import { getSelectedSla } from '../src/sla'

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
})

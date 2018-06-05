// import {
//   baseLogisticsInfo,
//   normalSla,
// } from './mockGenerator'

// import orderMock from './Order'
import { getSelectedSla } from '../src/sla'

describe('Sla', () => {
  describe('getSelectedSla', () => {
    it('should return null if empty params are passed', () => {
      const selectedSla1 = getSelectedSla()
      const selectedSla2 = getSelectedSla({})
      expect(selectedSla1).toBeNull()
      expect(selectedSla2).toBeNull()
    })
    //
    // it('should correct logisticInfo if valid selectedSla is passed', () => {
    //   const selectedSla = ''
    // })
  })
})

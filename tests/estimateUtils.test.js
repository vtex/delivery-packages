const getLatestSla = require('../src/estimateUtils')

describe('Check if getFastestSla works', () => {
  it('For nullable cases', () => {
    expect(getLatestSla()).toBeNull()
    expect(getLatestSla(null)).toBeNull()
    expect(getLatestSla([])).toBeNull()
  })

  it('For single sla case', () => {
    expect(getLatestSla([{ id: 1, shippingEstimate: '1d' }])).toEqual({
      id: 1,
      shippingEstimate: '1d',
    })
  })

  it('For multiple slas cases with bd unit', () => {
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '50bd' },
        { id: 2, shippingEstimate: '15bd' },
        { id: 3, shippingEstimate: '100bd' },
      ])
    ).toEqual({ id: 3, shippingEstimate: '100bd' })
  })

  it('For multiple slas cases with d unit', () => {
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '50d' },
        { id: 2, shippingEstimate: '15d' },
        { id: 3, shippingEstimate: '100d' },
      ])
    ).toEqual({ id: 3, shippingEstimate: '100d' })
  })

  it('For multiple slas cases with h unit', () => {
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '50h' },
        { id: 2, shippingEstimate: '15h' },
        { id: 3, shippingEstimate: '100h' },
      ])
    ).toEqual({ id: 3, shippingEstimate: '100h' })
  })

  it('For multiple slas cases with m unit', () => {
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '50m' },
        { id: 2, shippingEstimate: '15m' },
        { id: 3, shippingEstimate: '100m' },
      ])
    ).toEqual({ id: 3, shippingEstimate: '100m' })
  })

  it('For multiple slas cases mixing d and bd units', () => {
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '10bd' },
        { id: 2, shippingEstimate: '11bd' },
        { id: 3, shippingEstimate: '13d' },
      ])
    ).toEqual({ id: 2, shippingEstimate: '11bd' })
  })

  it('For multiple slas cases mixing many units', () => {
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '7bd' },
        { id: 2, shippingEstimate: '8d' },
        { id: 3, shippingEstimate: '90m' },
        { id: 4, shippingEstimate: '23h' },
      ])
    ).toEqual({ id: 1, shippingEstimate: '7bd' })
    expect(
      getLatestSla([
        { id: 1, shippingEstimate: '8d' },
        { id: 2, shippingEstimate: '23h' },
      ])
    ).toEqual({ id: 1, shippingEstimate: '8d' })
  })
})

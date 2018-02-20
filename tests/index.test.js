const packagify = require('../src/index')
const {
  pickupPointAddress,
  residentialAddress,
  pickupSla,
  expressSla,
  normalSla,
  baseLogisticsInfo,
  createPackage,
  createItems,
} = require('./mockGenerator')

it('has only a package', () => {
  const items = createItems(2)
  const packages = [
    createPackage([
      { itemIndex: 0, quantity: 1 },
      { itemIndex: 1, quantity: 1 },
    ]),
  ]
  const selectedAddresses = [residentialAddress]
  const logisticsInfo = [
    {
      ...baseLogisticsInfo.express,
      itemIndex: 0,
      slas: [expressSla],
    },
    {
      ...baseLogisticsInfo.express,
      itemIndex: 1,
      slas: [expressSla],
    },
  ]

  const result = packagify({
    items,
    packages,
    selectedAddresses,
    logisticsInfo,
  })

  expect(result).toHaveLength(1)
  expect(result[0].items).toHaveLength(2)
  expect(result[0].selectedSla).toBe(expressSla.id)
  expect(result[0].deliveryChannel).toBe(expressSla.deliveryChannel)
  expect(result[0].shippingEstimate).toBe(
    baseLogisticsInfo.express.shippingEstimate
  )
  expect(result[0].shippingEstimateDate).toBe(
    baseLogisticsInfo.express.shippingEstimateDate
  )
  expect(result[0].address.addressId).toBe(residentialAddress.addressId)
})

it('has a package and a delivery', () => {
  const items = createItems(2)
  const packages = [createPackage([{ itemIndex: 0, quantity: 1 }])]
  const selectedAddresses = [residentialAddress]
  const logisticsInfo = [
    {
      ...baseLogisticsInfo.express,
      itemIndex: 0,
      slas: [expressSla],
    },
    {
      ...baseLogisticsInfo.normal,
      itemIndex: 1,
      slas: [normalSla],
    },
  ]

  const result = packagify({
    items,
    packages,
    selectedAddresses,
    logisticsInfo,
  })

  expect(result).toHaveLength(2)
  expect(result[1].items).toHaveLength(1)
  expect(result[1].selectedSla).toBe(normalSla.id)
})

it('has two packages with different shipping estimates', () => {
  const items = createItems(2)
  const packages = [
    createPackage([
      { itemIndex: 0, quantity: 1 },
      { itemIndex: 1, quantity: 1 },
    ]),
  ]
  const selectedAddresses = [residentialAddress]
  const logisticsInfo = [
    {
      ...baseLogisticsInfo.express,
      itemIndex: 0,
      slas: [expressSla],
    },
    {
      ...baseLogisticsInfo.normal,
      itemIndex: 1,
      slas: [normalSla],
    },
  ]

  const result = packagify({
    items,
    packages,
    selectedAddresses,
    logisticsInfo,
  })

  expect(result).toHaveLength(1)
  expect(result[0].shippingEstimate).toBe(
    baseLogisticsInfo.normal.shippingEstimate
  )
})

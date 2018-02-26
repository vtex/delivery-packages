const packagify = require('../src/index')
const {
  pickupPointAddress,
  residentialAddress,
  pickupSla,
  pickupNormalSla,
  expressSla,
  normalSla,
  baseLogisticsInfo,
  createPackage,
  createItems,
} = require('./mockGenerator')

describe('has one package with all items', () => {
  it('should create one package', () => {
    const items = createItems(2)
    const packageAttachment = {
      packages: [
        createPackage([
          { itemIndex: 0, quantity: 1 },
          { itemIndex: 1, quantity: 1 },
        ]),
      ],
    }
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
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(2)
    expect(result[0].selectedSla).toBe(expressSla.id)
    expect(result[0].deliveryChannel).toBe(expressSla.deliveryChannel)
    expect(result[0].slas[0]).toBe(expressSla)
    expect(result[0].shippingEstimate).toBe(
      baseLogisticsInfo.express.shippingEstimate
    )
    expect(result[0].shippingEstimateDate).toBe(
      baseLogisticsInfo.express.shippingEstimateDate
    )
    expect(result[0].address.addressId).toBe(residentialAddress.addressId)
  })
})

describe('has one package and a delivery', () => {
  it('should create two packages', () => {
    const items = createItems(2)
    const packageAttachment = {
      packages: [createPackage([{ itemIndex: 0, quantity: 1 }])]
    }
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
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[1].items).toHaveLength(1)
    expect(result[1].selectedSla).toBe(normalSla.id)
  })
})

describe('has two packages with different shipping estimates', () => {
  it('should create one package with the latest estimate', () => {
    const items = createItems(2)
    const packageAttachment = {
      packages: [
        createPackage([
          { itemIndex: 0, quantity: 1 },
          { itemIndex: 1, quantity: 1 },
        ]),
      ],
    }
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
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(1)
    expect(result[0].shippingEstimate).toBe(
      baseLogisticsInfo.normal.shippingEstimate
    )
  })
})

describe('has two deliveries with different shipping estimates', () => {
  it('should create two packages', () => {
    const items = createItems(2)
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normalFastest,
        itemIndex: 0,
        slas: [normalSla],
      },
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 1,
        slas: [normalSla],
      },
    ]

    const result = packagify({
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[0].shippingEstimate).toBe(
      baseLogisticsInfo.normalFastest.shippingEstimate
    )
    expect(result[1].shippingEstimate).toBe(
      baseLogisticsInfo.normal.shippingEstimate
    )
  })
})

describe('has two deliveries of different sellers', () => {
  it('should create two packages', () => {
    const items = [
      {
        id: 0,
        quantity: 1,
        seller: '1',
      },
      {
        id: 1,
        quantity: 1,
        seller: '2',
      },
    ]

    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 0,
        slas: [normalSla],
      },
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 1,
        slas: [normalSla],
      },
    ]

    const result = packagify({
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[0].seller).toBe(items[0].seller)
    expect(result[1].seller).toBe(items[1].seller)
  })
})

describe('has two deliveries with different delivery channels', () => {
  it('should create two packages', () => {
    const items = [
      {
        id: 0,
        quantity: 1,
        seller: '1',
      },
      {
        id: 1,
        quantity: 1,
        seller: '2',
      },
    ]

    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 0,
        slas: [normalSla],
      },
      {
        ...baseLogisticsInfo.pickupNormal,
        itemIndex: 1,
        slas: [pickupNormalSla],
      },
    ]

    const result = packagify({
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[0].selectedSla).toBe(normalSla.id)
    expect(result[0].pickup)
    expect(result[1].selectedSla).toBe(pickupNormalSla.id)
  })

  it('should return the pickup point address', () => {
    const items = [
      {
        id: 0,
        quantity: 1,
        seller: '1',
      },
      {
        id: 1,
        quantity: 1,
        seller: '2',
      },
    ]

    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 0,
        slas: [normalSla],
      },
      {
        ...baseLogisticsInfo.pickup,
        itemIndex: 1,
        slas: [pickupSla],
      },
    ]

    const result = packagify({
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[1].selectedSla).toBe(pickupSla.id)
    expect(result[1].address.addressId).toBe(pickupPointAddress.addressId)
  })
})

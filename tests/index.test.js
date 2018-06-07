import {
  baseLogisticsInfo,
  createItems,
  createPackage,
  expressSla,
  normalFastestSla,
  normalSla,
  pickupNormalSla,
  pickupSla,
  residentialAddress,
} from './mockGenerator'

import orderMock from './Order'
import parcelify from '../src/index'

describe('has one package with all items', () => {
  it('should create one parcel', () => {
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

    const order = {
      items,
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order)

    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(2)
    expect(result[0].selectedSla).toBe(expressSla.id)
    expect(result[0].deliveryChannel).toBe(
      baseLogisticsInfo.express.selectedDeliveryChannel
    )
    expect(result[0].slas[0].id).toBe(expressSla.id)
    expect(result[0].shippingEstimate).toBe(normalSla.shippingEstimate)
    expect(result[0].shippingEstimateDate).toBe(normalSla.shippingEstimateDate)
    expect(result[0].address.addressId).toBe(residentialAddress.addressId)
    expect(result[0].package).toBeDefined()
  })
})

describe('has an item with quantity 3 and only one unit is in a package', () => {
  it('should create two parcels, one with a package and one delivery', () => {
    const items = [{ id: 0, quantity: 3, seller: '1' }]
    const packageAttachment = {
      packages: [createPackage([{ itemIndex: 0, quantity: 1 }])],
    }
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.express,
        itemIndex: 0,
        slas: [expressSla],
      },
    ]

    const result = parcelify({
      items,
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].quantity).toBe(1)
    expect(result[1].items).toHaveLength(1)
    expect(result[1].items[0].quantity).toBe(2)
  })
})

describe('has an item with quantity 3 and one unit is in a package and other unit in another', () => {
  it('should create three parcels, two with packages and one delivery', () => {
    const items = [{ id: 0, quantity: 3, seller: '1' }]
    const packageAttachment = {
      packages: [
        createPackage([{ itemIndex: 0, quantity: 1 }]),
        createPackage([{ itemIndex: 0, quantity: 1 }]),
      ],
    }
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.express,
        itemIndex: 0,
        slas: [expressSla],
      },
    ]

    const result = parcelify({
      items,
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    })

    expect(result).toHaveLength(3)
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].quantity).toBe(1)
    expect(result[1].items).toHaveLength(1)
    expect(result[1].items[0].quantity).toBe(1)
    expect(result[2].items).toHaveLength(1)
    expect(result[2].items[0].quantity).toBe(1)
  })
})

describe('has one package and a delivery', () => {
  it('should create two parcels', () => {
    const items = createItems(2)
    const packageAttachment = {
      packages: [createPackage([{ itemIndex: 0, quantity: 1 }])],
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

    const result = parcelify({
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
  it('should create one parcel with the latest estimate', () => {
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

    const order = {
      items,
      packageAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order)

    expect(result).toHaveLength(1)
    expect(result[0].shippingEstimate).toBe(normalSla.shippingEstimate)
  })
})

describe("has two packages one with deliveryWindow and the other don't", () => {
  it('should create two parcel with same sla but different deliveryWindow', () => {
    const items = createItems(2)
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 0,
        slas: [
          {
            ...normalSla,
            availableDeliveryWindows: [{}],
            deliveryWindow: {},
          },
        ],
      },
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 1,
        slas: [normalSla],
        availableDeliveryWindows: [],
        deliveryWindow: null,
      },
    ]

    const order = {
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order, {
      criteria: {
        deliveryWindow: true,
      },
    })

    expect(result).toHaveLength(2)
    expect(result[0].items).toHaveLength(1)
    expect(result[1].items).toHaveLength(1)
    expect(result[0].selectedSla).toBe(normalSla.id)
    expect(result[1].selectedSla).toBe(normalSla.id)
    expect(result[1].slas[0].id).toBe(normalSla.id)
    expect(result[1].slas[0].id).toBe(normalSla.id)
    expect(result[0].deliveryWindow).toEqual({})
    expect(result[1].deliveryWindow).toBeUndefined()
  })
})

describe('has one package one with deliveryWindow', () => {
  it('should create one parcel with same deliveryWindow', () => {
    const items = createItems(2)
    const selectedAddresses = [residentialAddress]
    const deliveryWindow = {
      startDateUtc: '2018-05-09T00:00:00+00:00',
      endDateUtc: '2018-05-09T00:00:00+00:00',
      price: 0,
      lisPrice: 0,
      tax: 0,
    }
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 0,
        slas: [
          {
            ...normalSla,
            availableDeliveryWindows: [deliveryWindow],
            deliveryWindow: deliveryWindow,
          },
        ],
      },
      {
        ...baseLogisticsInfo.normal,
        itemIndex: 1,
        slas: [
          {
            ...normalSla,
            availableDeliveryWindows: [deliveryWindow],
            deliveryWindow: deliveryWindow,
          },
        ],
      },
    ]

    const order = {
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order, {
      criteria: {
        deliveryWindow: true,
      },
    })

    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(2)
    expect(result[0].selectedSla).toBe(normalSla.id)
    expect(result[0].slas[0].id).toBe(normalSla.id)
    expect(result[0].deliveryWindow).toEqual(deliveryWindow)
  })
})

describe('has two deliveries', () => {
  it('with no selected sla should not crash', () => {
    const items = createItems(2)
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normal,
        selectedSla: null,
        itemIndex: 0,
        slas: [normalSla],
      },
      {
        ...baseLogisticsInfo.normal,
        selectedSla: null,
        itemIndex: 1,
        slas: [normalSla],
      },
    ]

    const order = {
      items,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order)

    expect(result).toHaveLength(1)
  })

  describe('with different selected slas', () => {
    describe('of different shipping estimates', () => {
      const items = createItems(2)
      const selectedAddresses = [residentialAddress]
      const logisticsInfo = [
        {
          ...baseLogisticsInfo.normalFastest,
          itemIndex: 0,
          slas: [normalFastestSla],
        },
        {
          ...baseLogisticsInfo.normal,
          itemIndex: 1,
          slas: [normalSla],
        },
      ]

      const order = {
        items,
        shippingData: {
          selectedAddresses,
          logisticsInfo,
        },
      }

      it('should create two parcels', () => {
        const result = parcelify(order)

        expect(result).toHaveLength(2)
        expect(result[0].shippingEstimate).toBe(
          normalFastestSla.shippingEstimate
        )
        expect(result[1].shippingEstimate).toBe(normalSla.shippingEstimate)
      })

      it('should not create two parcels if shippingEstimate criterion is false', () => {
        const result = parcelify(order, {
          criteria: { shippingEstimate: false },
        })

        expect(result).toHaveLength(1)
        expect(result[0].items).toHaveLength(2)
      })
    })

    describe('of different sellers', () => {
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

      const order = {
        items,
        shippingData: {
          selectedAddresses,
          logisticsInfo,
        },
      }

      it('should create two parcels', () => {
        const result = parcelify(order)

        expect(result).toHaveLength(2)
        expect(result[0].seller).toBe(items[0].seller)
        expect(result[1].seller).toBe(items[1].seller)
      })

      it('should not create two parcels if seller criterion is false', () => {
        const result = parcelify(order, { criteria: { seller: false } })

        expect(result).toHaveLength(1)
        expect(result[0].items).toHaveLength(2)
        expect(result[0].seller).toBeUndefined()
      })
    })

    describe('of different delivery channels', () => {
      it('should create two parcels', () => {
        const items = [
          {
            id: 0,
            quantity: 1,
            seller: '1',
          },
          {
            id: 1,
            quantity: 1,
            seller: '1',
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

        const result = parcelify({
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
        expect(result[1].pickupFriendlyName).toBe(
          pickupNormalSla.pickupStoreInfo.friendlyName
        )
      })

      it("should separate parcels only by deliveryChannel if it's the only criterion as true", () => {
        const items = createItems(3)
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
          {
            ...baseLogisticsInfo.pickupNormal,
            itemIndex: 2,
            slas: [pickupNormalSla],
          },
        ]

        const order = {
          items,
          shippingData: {
            selectedAddresses,
            logisticsInfo,
          },
        }

        const result = parcelify(order, {
          criteria: {
            slaOptions: false,
            selectedSla: false,
            seller: false,
            shippingEstimate: false,
            deliveryChannel: true,
          },
        })

        expect(result).toHaveLength(2)
        expect(result[0].items).toHaveLength(2)
        expect(result[1].items).toHaveLength(1)
        expect(result[0].deliveryChannel).toBe(
          baseLogisticsInfo.normal.selectedDeliveryChannel
        )
        expect(result[1].deliveryChannel).toBe(
          baseLogisticsInfo.pickupNormal.selectedDeliveryChannel
        )
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

        const result = parcelify({
          items,
          shippingData: {
            selectedAddresses,
            logisticsInfo,
          },
        })

        expect(result).toHaveLength(2)
        expect(result[1].selectedSla).toBe(pickupSla.id)
        expect(result[1].address.addressId).toBe(
          baseLogisticsInfo.pickup.addressId
        )
      })
    })
  })

  describe('with the same selected slas', () => {
    describe('of different sla options', () => {
      const items = createItems(2)
      const selectedAddresses = [residentialAddress]

      it('should create two parcels if slaOptions criterion is true', () => {
        const logisticsInfo = [
          {
            ...baseLogisticsInfo.normal,
            itemIndex: 0,
            slas: [normalSla, expressSla],
          },
          {
            ...baseLogisticsInfo.normal,
            itemIndex: 1,
            slas: [normalSla],
          },
        ]

        const result = parcelify(
          {
            items,
            shippingData: {
              selectedAddresses,
              logisticsInfo,
            },
          },
          { criteria: { slaOptions: true } }
        )

        expect(result).toHaveLength(2)
      })

      it('should create one parcel if slaOptions criterion is false', () => {
        const logisticsInfo = [
          {
            ...baseLogisticsInfo.normal,
            itemIndex: 0,
            slas: [normalSla, expressSla],
          },
          {
            ...baseLogisticsInfo.normal,
            itemIndex: 1,
            slas: [normalSla],
          },
        ]

        const result = parcelify(
          {
            items,
            shippingData: {
              selectedAddresses,
              logisticsInfo,
            },
          },
          { criteria: { slaOptions: false } }
        )

        expect(result).toHaveLength(1)
      })
    })

    describe('of the same sla options', () => {
      it('should create one parcel if slaOptions criterion is true', () => {
        const items = createItems(2)
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

        const result = parcelify(
          {
            items,
            shippingData: {
              selectedAddresses,
              logisticsInfo,
            },
          },
          { criteria: { slaOptions: true } }
        )

        expect(result).toHaveLength(1)
      })
    })

    describe('an order with multiple items, some parcels already sent and some are still on hold', () => {
      it('should have 7 packages since 5 packages were sent and there are two items left with different selected SLAs', () => {
        const result = parcelify(orderMock)

        expect(result).toHaveLength(7)
      })

      it('should not have package information, since it was not sent yet ', () => {
        const result = parcelify(orderMock)

        expect(result[5].package).toEqual(undefined)
      })

      it('should return the correct package info, package sent with pickup-points', () => {
        const result = parcelify(orderMock)

        expect(result[1].package).toEqual({
          ...orderMock.packageAttachment.packages[1],
          index: 1,
        })
      })

      it('should return the correct package info, it was sent with courier TESTEQA and item is Produto com anexo obrigatorio Sku anexo obrigatorio ', () => {
        const result = parcelify(orderMock)

        expect(result[2].package).toEqual({
          ...orderMock.packageAttachment.packages[3],
          index: 3,
        })
      })

      it('should return the correct package info, it was sent with courier TESTEQA and item is Produto Variação Cor e Tam SKU Variação Cor2 e Tam 5', () => {
        const result = parcelify(orderMock)

        expect(result[4].package).toEqual({
          ...orderMock.packageAttachment.packages[0],
          index: 0,
        })
      })

      it('should return shippingEstimate from logisticsInfo when it is null inside slas array', () => {
        const items = createItems(1)
        const packageAttachment = {
          packages: [createPackage([{ itemIndex: 0, quantity: 1 }])],
        }
        const logisticsInfo = [
          {
            ...baseLogisticsInfo.express,
            itemIndex: 0,
            shippingEstimate: '8d',
            slas: null,
          },
        ]

        const order = {
          items,
          packageAttachment,
          shippingData: {
            logisticsInfo,
          },
        }

        const result = parcelify(order)
        expect(result[0].shippingEstimate).toBe(
          logisticsInfo[0].shippingEstimate
        )
      })

      it('should return correct parcel shippingEstimateDate', () => {
        const result = parcelify(orderMock)

        expect(result[0].shippingEstimateDate).toEqual(
          '2017-10-17T14:45:00.4699353+00:00'
        )
        expect(result[1].shippingEstimateDate).toEqual(
          '2017-10-16T17:00:00.0000000+00:00'
        )
        expect(result[2].shippingEstimateDate).toEqual(
          '2017-10-16T14:45:00.0858904+00:00'
        )
        expect(result[3].shippingEstimateDate).toEqual(
          '2017-10-16T17:00:00.0000000+00:00'
        )
        expect(result[4].shippingEstimateDate).toEqual(
          '2017-10-19T14:45:00.0858904+00:00'
        )
        expect(result[5].shippingEstimateDate).toEqual(
          '2017-10-19T14:45:00.0839018+00:00'
        )
        expect(result[6].shippingEstimateDate).toEqual(
          '2017-10-16T17:00:00.0000000+00:00'
        )
      })
    })
  })
})

it('should handle an order in OMS format', () => {
  const items = createItems(1)
  const packageAttachment = {
    packages: [createPackage([{ itemIndex: 0, quantity: 1 }])],
  }
  const selectedAddresses = [residentialAddress]
  const logisticsInfo = [
    {
      ...baseLogisticsInfo.normalOms,
      itemIndex: 0,
      slas: [normalSla],
    },
  ]

  const order = {
    items,
    packageAttachment,
    shippingData: {
      selectedAddresses,
      logisticsInfo,
    },
  }

  const result = parcelify(order)

  expect(result).toHaveLength(1)
  expect(result[0].items).toHaveLength(1)
  expect(result[0].selectedSla).toBe(normalSla.id)
  expect(result[0].deliveryIds).toBeDefined()
  expect(result[0].deliveryChannel).toBe(normalSla.deliveryChannel)
})

it('should handle devolution packages', () => {
  const items = createItems(1)
  const packageAttachment = {
    packages: [
      {
        ...createPackage([{ itemIndex: 0, quantity: 1 }]),
        type: 'Output',
      },
      {
        ...createPackage([{ itemIndex: 0, quantity: 1 }]),
        type: 'Input',
      },
    ],
  }
  const selectedAddresses = [residentialAddress]
  const logisticsInfo = [
    {
      ...baseLogisticsInfo.normalOms,
      itemIndex: 0,
      slas: [normalSla],
    },
  ]

  const order = {
    items,
    packageAttachment,
    shippingData: {
      selectedAddresses,
      logisticsInfo,
    },
  }

  const result = parcelify(order)

  expect(result).toHaveLength(2)
})

describe('the order has changes', () => {
  it('should remove the item completely when the change has all the quantity', () => {
    const items = createItems(1)
    const packageAttachment = { packages: [] }
    const changesAttachment = {
      changesData: [
        {
          itemsRemoved: [{ id: '0', quantity: 1 }],
        },
      ],
    }
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normalOms,
        itemIndex: 0,
        slas: [normalSla],
      },
    ]

    const order = {
      items,
      packageAttachment,
      changesAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order)

    expect(result).toHaveLength(0)
  })

  it('should remove the right quantity from the item', () => {
    const items = [{ id: '0', quantity: 2, seller: '1' }]
    const packageAttachment = { packages: [] }
    const changesAttachment = {
      changesData: [
        {
          itemsRemoved: [{ id: '0', quantity: 1 }],
        },
      ],
    }
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normalOms,
        itemIndex: 0,
        slas: [normalSla],
      },
    ]

    const order = {
      items,
      packageAttachment,
      changesAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order)

    expect(result).toHaveLength(1)
    expect(result[0].items[0].quantity).toBe(1)
  })

  it('should add the right quantity to the item', () => {
    const items = createItems(1)
    const packageAttachment = { packages: [] }
    const changesAttachment = {
      changesData: [
        {
          itemsAdded: [{ id: '0', quantity: 1 }],
        },
      ],
    }
    const selectedAddresses = [residentialAddress]
    const logisticsInfo = [
      {
        ...baseLogisticsInfo.normalOms,
        itemIndex: 0,
        slas: [normalSla],
      },
    ]

    const order = {
      items,
      packageAttachment,
      changesAttachment,
      shippingData: {
        selectedAddresses,
        logisticsInfo,
      },
    }

    const result = parcelify(order)

    expect(result).toHaveLength(1)
    expect(result[0].items[0].quantity).toBe(2)
  })
})

const addresses = {
  pickupPointAddress: {
    addressId: '141125d',
    addressType: 'pickup',
    city: 'Rio de Janeiro',
    complement: '',
    country: 'BRA',
    geoCoordinates: [-43.18080139160156, -22.96540069580078],
    neighborhood: 'Copacabana',
    number: '5',
    postalCode: '22011050',
    receiverName: 'auto auto',
    reference: null,
    state: 'RJ',
    street: 'Rua General Azevedo Pimentel',
  },
  residentialAddress: {
    addressId: '-4556418741084',
    addressType: 'residential',
    receiverName: 'John Doe',
    street: 'Rua Barão',
    number: '2',
    complement: null,
    neighborhood: 'Botafogo',
    postalCode: '22231-100',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'BRA',
    reference: null,
    geoCoordinates: [],
  },
}

const slas = {
  pickupSla: {
    id: 'Retirada na loja (17c6a89)',
    shippingEstimate: '5h',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'pickup-in-point',
    availableDeliveryWindows: [],
    deliveryWindow: null,
    price: 0,
    listPrice: 0,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: true,
      friendlyName: 'Shopping da Gávea',
      address: addresses.pickupPointAddress,
    },
  },
  pickupNormalSla: {
    id: 'Normal',
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'pickup-in-point',
    availableDeliveryWindows: [],
    deliveryWindow: null,
    price: 0,
    listPrice: 0,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: true,
      friendlyName: 'Shopping da Gávea',
      address: addresses.pickupPointAddress,
    },
  },
  expressSla: {
    id: 'Expressa',
    shippingEstimate: '5bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    availableDeliveryWindows: [],
    deliveryWindow: null,
    price: 10000,
    listPrice: 10000,
    tax: 0,
  },
  normalSla: {
    id: 'Normal',
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    availableDeliveryWindows: [],
    deliveryWindow: null,
    price: 5000,
    listPrice: 5000,
    tax: 0,
  },
  normalFastestSla: {
    id: 'Normal',
    shippingEstimate: '3bd',
    shippingEstimateDate: '2018-02-21T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    deliveryWindow: null,
    price: 20000,
    listPrice: 20000,
    tax: 0,
  },
}

const baseLogisticsInfo = {
  pickup: {
    addressId: addresses.pickupPointAddress.addressId,
    selectedSla: slas.pickupSla.id,
    selectedDeliveryChannel: 'pickup-in-point',
  },
  pickupNormal: {
    addressId: addresses.pickupPointAddress.addressId,
    selectedSla: slas.pickupNormalSla.id,
    selectedDeliveryChannel: 'pickup-in-point',
  },
  express: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.expressSla.id,
    selectedDeliveryChannel: 'delivery',
  },
  normal: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalSla.id,
    selectedDeliveryChannel: 'delivery',
  },
  normalFastest: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalFastestSla.id,
    selectedDeliveryChannel: 'delivery',
  },
  normalOms: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalSla.id,
    deliveryIds: [{ courierId: '123' }],
  },
}

const createItems = quantity => {
  return Array.from(Array(quantity), (_, index) => ({
    id: `${index}`,
    quantity: 1,
    seller: '1',
  }))
}

const createPackage = items => ({
  courierStatus: { finished: false },
  trackingNumber: '123',
  trackingUrl: '',
  invoiceNumber: '456',
  items,
})

const createLogisticsInfo = (slaTypes, quantity) => {
  const liSlas = slaTypes.map(slaType => ({
    ...slas[slaType],
  }))

  const deliveryChannels = liSlas.reduce((result, sla) => {
    const resultDeliveryChannel = result.filter(
      deliveryChannel => deliveryChannel === sla.deliveryChannel
    )[0]

    return result.concat(resultDeliveryChannel ? [] : [sla.deliveryChannel])
  }, [])

  return Array.from(Array(quantity), (_, itemIndex) => ({
    itemIndex,
    selectedSla: null,
    selectedDeliveryChannel: null,
    addressId: null,
    shipsTo: ['BRA'],
    itemId: itemIndex,
    deliveryChannels,
    slas: liSlas,
  }))
}

module.exports = {
  addresses,
  slas,
  baseLogisticsInfo,
  createPackage,
  createItems,
  createLogisticsInfo,
}

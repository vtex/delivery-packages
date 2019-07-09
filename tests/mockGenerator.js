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
    receiverName: null,
    reference: null,
    state: 'RJ',
    street: 'Rua General Azevedo Pimentel',
  },
  pickupPointAddress2: {
    addressId: '141125e',
    addressType: 'pickup',
    city: 'Rio de Janeiro',
    complement: '',
    country: 'BRA',
    geoCoordinates: [-43.18080139160156, -22.96540069580078],
    neighborhood: 'Copacabana',
    number: '5',
    postalCode: '22011050',
    receiverName: null,
    reference: null,
    state: 'RJ',
    street: 'Rua General Azevedo Pimentel',
  },
  searchAddress: {
    addressId: '-4556418741084',
    addressType: 'search',
    receiverName: 'John Doe',
    street: 'Rua Barão',
    number: '2',
    complement: null,
    neighborhood: 'Botafogo',
    postalCode: '22250-040',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'BRA',
    reference: null,
    geoCoordinates: [],
  },
  residentialAddress: {
    addressId: '-4556418741085',
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
  residentialAddress2: {
    addressId: '-4556418741088',
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
  giftRegistryAddress: {
    addressId: '-4556418741086',
    addressType: 'giftRegistry',
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
  commercialAddress: {
    addressId: '-4556418741087',
    addressType: 'commercial',
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

const availableDeliveryWindows = [
  {
    startDateUtc: '2018-05-26T09:00:00+00:00',
    endDateUtc: '2018-05-26T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-26T12:00:00+00:00',
    endDateUtc: '2018-05-26T13:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-27T09:00:00+00:00',
    endDateUtc: '2018-05-27T21:00:00+00:00',
    price: 1000,
    lisPrice: 1000,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-27T12:00:00+00:00',
    endDateUtc: '2018-05-27T13:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-28T09:00:00+00:00',
    endDateUtc: '2018-05-28T21:00:00+00:00',
    price: 1000,
    lisPrice: 1000,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-28T12:00:00+00:00',
    endDateUtc: '2018-05-28T13:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-29T09:00:00+00:00',
    endDateUtc: '2018-05-29T21:00:00+00:00',
    price: 1000,
    lisPrice: 1000,
    tax: 0,
  },
  {
    startDateUtc: '2018-05-29T12:00:00+00:00',
    endDateUtc: '2018-05-29T13:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
]

const checkedInPickupPointId = 'lojabruzzi_1f03419'

const pickupNormalSla = {
  id: 'Retirada normal',
  shippingEstimate: '6bd',
  shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
  deliveryChannel: 'pickup-in-point',
  availableDeliveryWindows: [],
  deliveryWindow: null,
  price: 0,
  listPrice: 0,
  sellingPrice: 0,
  tax: 0,
  pickupStoreInfo: {
    isPickupStore: true,
    friendlyName: 'Shopping da Gávea',
    address: addresses.pickupPointAddress2,
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
    sellingPrice: 0,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: true,
      friendlyName: 'Shopping da Gávea',
      address: addresses.pickupPointAddress,
    },
  },
  pickupNormalSla,
  pickupCheckedInSla: {
    ...pickupNormalSla,
    id: 'Retirar agora (1f03419)',
    shippingEstimate: '0bd',
    pickupPointId: checkedInPickupPointId,
  },
  pickupCheckInSla: {
    id: 'retirada na loja (1072f1c)',
    name: 'retirada na loja (1072f1c)',
    shippingEstimate: '0bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'pickup-in-point',
    availableDeliveryWindows: [],
    deliveryWindow: null,
    price: 0,
    listPrice: 0,
    tax: 0,
    pickupPointId: '1_1072f1c',
    pickupStoreInfo: {
      isPickupStore: true,
      friendlyName: 'Rio de Janeiro | Botafogo',
      address: {
        ...addresses.pickupPointAddress,
        receiverName: null,
      },
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
    sellingPrice: 10000,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: false,
    },
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
    sellingPrice: 5000,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: false,
    },
  },
  normalFastestSla: {
    id: 'Normal',
    shippingEstimate: '3bd',
    shippingEstimateDate: '2018-02-21T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    deliveryWindow: null,
    price: 20000,
    listPrice: 20000,
    sellingPrice: 20000,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: false,
    },
  },
  normalScheduledDeliverySla: {
    id: 'Agendada',
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    deliveryWindow: null,
    availableDeliveryWindows: availableDeliveryWindows.slice(0, 3),
    price: 5000,
    listPrice: 5000,
    sellingPrice: 5000,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: false,
    },
  },
  biggerWindowScheduledDeliverySla: {
    id: 'SuperAgendada',
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-05-26T09:00:00+00:00',
    deliveryChannel: 'delivery',
    deliveryWindow: null,
    availableDeliveryWindows,
    price: 5000,
    listPrice: 5000,
    sellingPrice: 5000,
    tax: 0,
    pickupStoreInfo: {
      isPickupStore: false,
    },
  },
}

const baseLogisticsInfo = {
  pickup: {
    addressId: addresses.pickupPointAddress.addressId,
    selectedSla: slas.pickupSla.id,
    selectedDeliveryChannel: 'pickup-in-point',
    selectedSlaObj: slas.pickupSla,
    selectedSlaType: 'pickup-in-point',
    listPrice: slas.pickupSla.listPrice,
    price: slas.pickupSla.price,
    sellingPrice: slas.pickupSla.sellingPrice,
  },
  pickupNormal: {
    addressId: addresses.pickupPointAddress.addressId,
    selectedSla: slas.pickupNormalSla.id,
    selectedDeliveryChannel: 'pickup-in-point',
    selectedSlaObj: slas.pickupNormalSla,
    selectedSlaType: 'pickup-in-point',
    listPrice: slas.pickupNormalSla.listPrice,
    price: slas.pickupNormalSla.price,
    sellingPrice: slas.pickupNormalSla.sellingPrice,
  },
  express: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.expressSla.id,
    selectedDeliveryChannel: 'delivery',
    selectedSlaObj: slas.expressSla,
    selectedSlaType: 'delivery',
    listPrice: slas.expressSla.listPrice,
    price: slas.expressSla.price,
    sellingPrice: slas.expressSla.sellingPrice,
  },
  normal: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalSla.id,
    selectedDeliveryChannel: 'delivery',
    selectedSlaObj: slas.normalSla,
    selectedSlaType: 'delivery',
    listPrice: slas.normalSla.listPrice,
    price: slas.normalSla.price,
    sellingPrice: slas.normalSla.sellingPrice,
  },
  normalFastest: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalFastestSla.id,
    selectedDeliveryChannel: 'delivery',
    selectedSlaObj: slas.normalFastestSla,
    selectedSlaType: 'delivery',
    listPrice: slas.normalFastestSla.listPrice,
    price: slas.normalFastestSla.price,
    sellingPrice: slas.normalFastestSla.sellingPrice,
  },
  scheduled: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalScheduledDeliverySla.id,
    selectedDeliveryChannel: 'delivery',
    selectedSlaObj: slas.normalScheduledDeliverySla,
    selectedSlaType: 'delivery',
    listPrice: slas.normalScheduledDeliverySla.listPrice,
    price: slas.normalScheduledDeliverySla.price,
    sellingPrice: slas.normalScheduledDeliverySla.sellingPrice,
  },
  normalOms: {
    addressId: addresses.residentialAddress.addressId,
    selectedSla: slas.normalSla.id,
    selectedSlaObj: slas.normalSla,
    selectedSlaType: 'delivery',
    deliveryIds: [{ courierId: '123' }],
    listPrice: slas.normalSla.listPrice,
    price: slas.normalSla.price,
    sellingPrice: slas.normalSla.sellingPrice,
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

const createLogisticsInfo = (slaTypes, quantity, price = 0) => {
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
    price: price,
    listPrice: price,
    sellingPrice: price,
  }))
}

const createLogisticsInfoItem = ({
  slas: slaTypes,
  selectedSla: selectedSlaType,
  price,
  addressId,
  index,
}) => {
  return {
    ...createLogisticsInfo(slaTypes, 1, price)[0],
    selectedSla: slas[selectedSlaType].id,
    selectedDeliveryChannel: slas[selectedSlaType].deliveryChannel,
    addressId,
    itemIndex: index,
    itemId: index,
  }
}

module.exports = {
  addresses,
  checkedInPickupPointId,
  slas,
  availableDeliveryWindows,
  baseLogisticsInfo,
  createPackage,
  createItems,
  createLogisticsInfo,
  createLogisticsInfoItem,
}

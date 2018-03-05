const pickupPointAddress = {
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
}

const residentialAddress = {
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
}

const createPackage = items => ({
  courierStatus: { finished: false },
  trackingNumber: '123',
  trackingUrl: '',
  invoiceNumber: '456',
  items,
})

const pickupSla = {
  id: 'Retirada na loja (17c6a89)',
  shippingEstimate: '5h',
  shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
  deliveryChannel: 'pickup-in-point',
  pickupStoreInfo: {
    friendlyName: 'Shopping da Gávea',
    address: pickupPointAddress,
  },
}

const pickupNormalSla = {
  id: 'Normal',
  shippingEstimate: '6bd',
  shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
  deliveryChannel: 'pickup-in-point',
  pickupStoreInfo: {
    friendlyName: 'Shopping da Gávea',
    address: pickupPointAddress,
  },
}

const expressSla = {
  id: 'Expressa',
  shippingEstimate: '5bd',
  shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
  deliveryChannel: 'delivery',
}

const normalSla = {
  id: 'Normal',
  shippingEstimate: '6bd',
  shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
  deliveryChannel: 'delivery',
}

const normalFastestSla = {
  id: 'Normal',
  shippingEstimate: '3bd',
  shippingEstimateDate: '2018-02-21T19:01:07.0336412+00:00',
  deliveryChannel: 'delivery',
}

const createItems = quantity => {
  return Array.from(Array(quantity), (_, index) => ({
    id: index,
    quantity: 1,
    seller: '1',
  }))
}

const baseLogisticsInfo = {
  pickup: {
    addressId: pickupPointAddress.addressId,
    selectedSla: pickupSla.id,
    selectedDeliveryChannel: 'pickup-in-point',
  },
  pickupNormal: {
    addressId: pickupPointAddress.addressId,
    selectedSla: pickupNormalSla.id,
    selectedDeliveryChannel: 'pickup-in-point',
  },
  express: {
    addressId: residentialAddress.addressId,
    selectedSla: expressSla.id,
    selectedDeliveryChannel: 'delivery',
  },
  normal: {
    addressId: residentialAddress.addressId,
    selectedSla: normalSla.id,
    selectedDeliveryChannel: 'delivery',
  },
  normalFastest: {
    addressId: residentialAddress.addressId,
    selectedSla: normalFastestSla.id,
    selectedDeliveryChannel: 'delivery',
  },
}

module.exports = {
  pickupPointAddress,
  residentialAddress,
  pickupSla,
  pickupNormalSla,
  expressSla,
  normalSla,
  normalFastestSla,
  baseLogisticsInfo,
  createPackage,
  createItems,
}

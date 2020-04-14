# delivery-packages

> Library of functions that help to separate items in parcels and select delivery items on UIs

## Motivation

The UX of displaying to the user how their items are going to be delivered can be tricky to be expressed and developed.

There are many criteria to split items in different parcels. They are:

1. Seller
2. SLAs options
3. Selected SLA ID
4. Selected SLA Shipping Estimate
5. Selected SLA Delivery Channel
6. Packages already delivered (post purchase scenario)
7. Group SLAs based on having a valid availableDeliveryWindows
8. Selected SLA Type, distinguishing pickup from pickup checked in (take away)

This module provides a consistent way to handle all those criteria.

And provide also helper functions for other use cases.

## Install

```sh
$ npm install @vtex/delivery-packages
```

## API

- [parcelify](#parcelifyorder-options)

#### Address

- [addAddressId](#addaddressid-address)
- [addPickupPointAddresses](#addpickuppointaddresses-addresses-pickupslas)
- [findAddressIndex](#findaddressindex-addresses-searchaddress)
- [findAddress](#findaddress-addresses-searchaddress)
- [findAddressByPostalCode](#findaddressbypostalcode-addresses-searchaddress)
- [isAddressComplete](#isaddresscomplete-address)
- [isPickupAddress](#ispickupaddress-address)
- [isDeliveryAddress](#isdeliveryaddress-address)
- [getDeliveryAvailableAddresses](#getdeliveryavailableaddresses-addresses)
- [groupByAddressType](#groupbyaddresstype-addresses)
- [addOrReplaceAddressTypeOnList](#addorreplaceaddresstypeonlist-addresses-newaddress)
- [addOrReplaceAddressOnList](#addorreplaceaddressonlist-addresses-newaddress)
- [addOrReplaceDeliveryAddressOnList](#addorreplacedeliveryaddressonlist-addresses-newaddress)

#### Delivery Channel

- [getDeliveryChannel](#getdeliverychannel-deliverychannelsource)
- [isPickup](#ispickup-deliverychannelsource)
- [isDelivery](#isdelivery-deliverychannelsource)
- [findChannelById](#findchannelbyid-logisticsinfoitem-deliverychannelsource)

#### Items

- [getNewItems](#getnewitems-items-changes)
- [getDeliveredItems](#getdelivereditems--items-packages-)
- [getItemsIndexes](#getitemsindexes-items)

#### Scheduled Delivery

- [areAvailableDeliveryWindowsEquals](#areavailabledeliverywindowsequals-availabledeliverywindows1-availabledeliverywindows2)
- [selectDeliveryWindow](#selectdeliverywindow-logisticsinfo--selectedsla-deliverywindow-)
- [getFirstScheduledDelivery](#getfirstscheduleddelivery-logisticsinfo-availabledeliverywindows--null)

#### Shipping

- [getNewLogisticsInfo](#getnewlogisticsinfo-logisticsinfo-selectedsla-availabledeliverywindows--null)
- [getNewLogisticsInfoWithSelectedScheduled](#getnewlogisticsinfowithselectedscheduled-logisticsinfo)
- [getNewLogisticsInfoWithScheduledDeliveryChoice](#getnewlogisticsinfowithscheduleddeliverychoice-logisticsinfo-scheduleddeliverychoice-scheduleddeliveryitems--null)
- [filterLogisticsInfo](#filterlogisticsinfo-logisticsinfo-filters-keepsize--false)
- [getNewLogisticsMatchingSelectedAddresses](#getnewlogisticsmatchingselectedaddresses-logisticsinfo-selectedaddresses)
- [mergeLogisticsInfos](#mergelogisticsinfos-logisticsinfo1-logisticsinfo2)

#### SLA

- [hasSLAs](#hasslas-slassource)
- [hasDeliveryWindows](#hasdeliverywindows-slas)
- [excludePickupTypeFromSlas](#excludepickuptypefromslas-slas)
- [getSlaObj](#getslaobj-slas-slaid)
- [getSlaType](#getslatype)
- [changeSelectedSla](#changeselectedsla-logisticsinfoitem-sla)
- [getSelectedSla](#getselectedsla-logisticsinfo-itemindex-selectedsla)
- [getSelectedSlas](#getselectedslas-logisticsinfo)
- [getPickupSelectedSlas](#getpickupselectedslas-logisticsinfo)

### parcelify(order, options)

Returns an array of [Parcel](#Parcel)s.

#### order

An order shaped like an [orderForm](https://github.com/vtex/vtex.js/blob/master/docs/checkout/order-form.md).

#### options.criteria

Type: `Object`<br/>
Default:<br/>

```js
{
  groupBySelectedSlaType: false,
  groupByAvailableDeliveryWindows: false,
  slaOptions: false,
  selectedSla: true,
  seller: true,
  shippingEstimate: true,
  deliveryChannel: true,
  useMarketplaceItems: true
}
```

This param will be merged with the default options.

## Parcel

> @vtex/delivery-packages/

A Parcel object shape

```js
{
  address: Object,
  listPrice: Number,
  price: Number,
  sellingPrice: Number,
  pickupFriendlyName: String,
  seller: String,
  items: [Object],
  package: Object,
  selectedSla: String,
  selectedSlaObj: Object,
  slas: [Object],
  shippingEstimate: String,
  shippingEstimateDate: String,
  deliveryChannel: String,
  selectedSlaType: String,
  deliveryIds: [Object]
}
```

#### address

The `address` used for that parcel. If it is a pickup point, the address of the pickup point is returned.

#### pickupFriendlyName

If the parcel is delivered to a pickup point, this field has its friendly name.

#### items

The items of the parcel.

#### seller

The seller of the parcel.

#### package

The `package` object from `packageAttachment`, if it is one.

#### slas, selectedSla, shippingEstimate, shippingEstimateDate, deliveryChannel, deliveryIds

These properties are taken from the `logisticsInfo` of the parcel.

## Example

```js
const parcelify = require('@vtex/delivery-packages')

const order = {
  items: [
    // You can pass all the properties of the item. That's simplified.
    { id: 0, quantity: 1, seller: '1' },
    { id: 1, quantity: 1, seller: '1' },
  ],
  shippingData: {
    selectedAddresses: [{ addressId: '-4556418741084', street: 'Rua Barão' }],
    logisticsInfo: [
      {
        // You can pass all the properties of the logisticsInfo
        addressId: '-4556418741084',
        selectedSla: 'Expressa',
        shippingEstimate: '5bd',
        shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
        deliveryChannel: 'delivery',
        itemIndex: 0,
        slas: [
          // You can pass all the properties of the sla
          { id: 'Expressa', deliveryChannel: 'delivery', price: 20000 },
        ],
      },
      {
        addressId: '-4556418741084',
        selectedSla: 'Normal',
        shippingEstimate: '6bd',
        shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
        deliveryChannel: 'delivery',
        itemIndex: 1,
        slas: [{ id: 'Normal', deliveryChannel: 'delivery', price: 20000 }],
      },
    ],
  },
  packageAttachment: {
    packages: [
      {
        // You can pass all the properties of tha package.
        courierStatus: { finished: false },
        trackingNumber: '123',
        trackingUrl: '',
        invoiceNumber: '456',
        items: [{ itemIndex: 0, quantity: 1 }],
      },
    ],
  },
}

parcelify(order, { criteria: { seller: false } })
// [
//   {
//     "package": {
//       "courierStatus": { "finished": false },
//       "trackingNumber": "123",
//       "trackingUrl": "",
//       "invoiceNumber": "456",
//       "items": [
//         { "itemIndex": 0, "quantity": 1 }
//       ],
//       "index": 0
//     },
//     "address": { "addressId": "-4556418741084", "street": "Rua Barão" },
//     "price": 20000,
//     "pickupFriendlyName": null,
//     "selectedSla": "Expressa",
//     "selectedSlaObj": { "id": "Expressa", "deliveryChannel": "delivery" },
//     "slas": [{ "id": "Expressa", "deliveryChannel": "delivery" }],
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "selectedSlaType": "delivery",
//     "items": [
//       { "id": 0, "quantity": 1, "seller": "1", "index": 0 }
//     ],
//     "seller": "1"
//   },
//   {
//     "address": { "addressId": "-4556418741084", "street": "Rua Barão" },
//     "price": 10000,
//     "pickupFriendlyName": null,
//     "selectedSla": "Normal",
//     "selectedSlaObj": { "id": "Normal", "deliveryChannel": "delivery" },
//     "slas": [{ "id": "Normal", "deliveryChannel": "delivery" }],
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "selectedSlaType": "delivery",
//     "items": [
//       { "id": 1, "quantity": 1, "seller": "1", "index": 1 }
//     ],
//     "seller": "1"
//   }
// ]
```

## Address
> @vtex/delivery-packages/dist/address

### addAddressId (address)

Add property addressId with random hash string (uuid) if not present on address object passed

#### Usage
```js
const { addAddressId } = require('@vtex/delivery-packages/dist/address')

addAddressId({
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
})
// -> {
//   addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
//   addressType: 'residential',
//   receiverName: 'John Doe',
//   street: 'Rua Barão',
//   number: '2',
//   complement: null,
//   neighborhood: 'Botafogo',
//   postalCode: '22231-100',
//   city: 'Rio de Janeiro',
//   state: 'RJ',
//   country: 'BRA',
//   reference: null,
//   geoCoordinates: [],
// }

addAddressId({
  addressId: '1234',
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
})
// -> {
//   addressId: '1234',
//   addressType: 'residential',
//   receiverName: 'John Doe',
//   street: 'Rua Barão',
//   number: '2',
//   complement: null,
//   neighborhood: 'Botafogo',
//   postalCode: '22231-100',
//   city: 'Rio de Janeiro',
//   state: 'RJ',
//   country: 'BRA',
//   reference: null,
//   geoCoordinates: [],
// }
```

**params:**
- **address**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm

**returns:**
- **newAddress**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm with an addressId included

### addPickupPointAddresses (addresses, pickupSlas)

Add all addresses present on pickupSlas that are not already on addresses list

#### Usage
```js
const { addPickupPointAddresses } = require('@vtex/delivery-packages/dist/address')

addPickupPointAddresses([{
  addressId: '1234',
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
}], [{
  id: 'Retirada normal',
  deliveryChannel: 'pickup-in-point',
  pickupStoreInfo: {
    isPickupStore: true,
    friendlyName: 'Shopping da Gávea',
    address: {
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
  },
}])
// -> [{
//   addressId: '1234',
//   addressType: 'residential',
//   receiverName: 'John Doe',
//   street: 'Rua Barão',
//   number: '2',
//   complement: null,
//   neighborhood: 'Botafogo',
//   postalCode: '22231-100',
//   city: 'Rio de Janeiro',
//   state: 'RJ',
//   country: 'BRA',
//   reference: null,
//   geoCoordinates: [],
// }, {
//   addressId: '141125e',
//   addressType: 'pickup',
//   city: 'Rio de Janeiro',
//   complement: '',
//   country: 'BRA',
//   geoCoordinates: [-43.18080139160156, -22.96540069580078],
//   neighborhood: 'Copacabana',
//   number: '5',
//   postalCode: '22011050',
//   receiverName: null,
//   reference: null,
//   state: 'RJ',
//   street: 'Rua General Azevedo Pimentel',
// }]
```
**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on availableAddresses of orderForm
- **pickupSlas**
Type: `Array<object>`
An array which each item is an object containing a list of slas of the pickup-in-point deliveryChannel

**returns:**
- **newAddresses**
Type: `Array<object>`
New list of addresses containing the pickup addresses

### findAddressIndex (addresses, searchAddress)

Find a reference address index on addresses list according to the reference addressId or -1 if it doesn't find it

#### Usage
```js
const { findAddressIndex } = require('@vtex/delivery-packages/dist/address')

findAddressIndex([{
  addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
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
}, {
  addressId: '783978bd-e71c-4602-4bc6-387cc68f226d',
  addressType: 'commercial',
  receiverName: 'John Doe',
  street: 'Rua dos bobos',
  number: '0',
  complement: null,
  neighborhood: 'Botafogo',
  postalCode: '22250-040',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'BRA',
  reference: null,
  geoCoordinates: [],
}], { addressId: '935befd9-dcc3-45f3-e327-9d8611e43630' })
// -> 0

findAddressIndex([{
  addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
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
}, {
  addressId: '783978bd-e71c-4602-4bc6-387cc68f226d',
  addressType: 'commercial',
  receiverName: 'John Doe',
  street: 'Rua dos bobos',
  number: '0',
  complement: null,
  neighborhood: 'Botafogo',
  postalCode: '22250-040',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'BRA',
  reference: null,
  geoCoordinates: [],
}], { addressId: 'not-found' })
// -> -1
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on availableAddresses of orderForm
- **searchAddress**
Type: `object`
An object with addressId reference to be used to search

**returns:**
- **index**
Type: `number`
Position on addresses of the searchAddress reference according to its addressId

### findAddress (addresses, searchAddress)

Find a reference address on addresses list according to the reference addressId or null if it doesn't find it

#### Usage
```js
const { findAddress } = require('@vtex/delivery-packages/dist/address')

findAddress([{
  addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
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
}, {
  addressId: '783978bd-e71c-4602-4bc6-387cc68f226d',
  addressType: 'commercial',
  receiverName: 'John Doe',
  street: 'Rua dos bobos',
  number: '0',
  complement: null,
  neighborhood: 'Botafogo',
  postalCode: '22250-040',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'BRA',
  reference: null,
  geoCoordinates: [],
}], { addressId: '935befd9-dcc3-45f3-e327-9d8611e43630' })
// -> {
//   addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
//   addressType: 'residential',
//   receiverName: 'John Doe',
//   street: 'Rua Barão',
//   number: '2',
//   complement: null,
//   neighborhood: 'Botafogo',
//   postalCode: '22231-100',
//   city: 'Rio de Janeiro',
//   state: 'RJ',
//   country: 'BRA',
//   reference: null,
//   geoCoordinates: []
// }

findAddress([{
  addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
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
}, {
  addressId: '783978bd-e71c-4602-4bc6-387cc68f226d',
  addressType: 'commercial',
  receiverName: 'John Doe',
  street: 'Rua dos bobos',
  number: '0',
  complement: null,
  neighborhood: 'Botafogo',
  postalCode: '22250-040',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'BRA',
  reference: null,
  geoCoordinates: [],
}], { addressId: 'not-found' })
// -> null
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on availableAddresses of orderForm
- **searchAddress**
Type: `object`
An object with addressId reference to be used to search

**returns:**
- **addressFound**
Type: `object`
The address found

### findAddressByPostalCode (addresses, searchAddress)

Works like findAddress above but the searchAddress postalCode property is used instead

#### Usage
```js
const { findAddress } = require('@vtex/delivery-packages/dist/address')

findAddress([{
  addressId: '935befd9-dcc3-45f3-e327-9d8611e43630',
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
}, {
  addressId: '783978bd-e71c-4602-4bc6-387cc68f226d',
  addressType: 'commercial',
  receiverName: 'John Doe',
  street: 'Rua dos bobos',
  number: '0',
  complement: null,
  neighborhood: 'Botafogo',
  postalCode: '22250-040',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'BRA',
  reference: null,
  geoCoordinates: [],
}], { postalCode: '22250-040' })
// -> {
//   addressId: '783978bd-e71c-4602-4bc6-387cc68f226d',
//   addressType: 'commercial',
//   receiverName: 'John Doe',
//   street: 'Rua dos bobos',
//   number: '0',
//   complement: null,
//   neighborhood: 'Botafogo',
//   postalCode: '22250-040',
//   city: 'Rio de Janeiro',
//   state: 'RJ',
//   country: 'BRA',
//   reference: null,
//   geoCoordinates: [],
// }
```

### isAddressComplete (address)

Verify address has all required basic fields

##### Usage
```js
const { isAddressComplete } = require('@vtex/delivery-packages/dist/address')

isAddressComplete({
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
})
// -> true

isAddressComplete({
  addressId: '-4556418741084',
  addressType: 'residential',
  receiverName: null,
  reference: null,
  geoCoordinates: [],
})
// -> false

isAddressComplete({
  addressId: '-4556418741084',
  addressType: 'residential',
  receiverName: 'John Doe',
  street: 'Rua Barão',
  number: null,
  complement: null,
  neighborhood: 'Botafogo',
  postalCode: '22231-100',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'BRA',
  reference: null,
  geoCoordinates: [],
}, [
  'state',
  'city',
  'neighborhood',
  'street',
])
// -> true
```

**params:**
- **address**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm

- **requiredFields**
Type: `array`
An array containing all required fields. The default required address fields are `state`, `city`, `neighborhood`, `street` and `number`.

**returns:**
- **isAddressComplete**
Type: `boolean`
If the address has all required fields

## isPickupAddress (address)

Verify address refers to a pickup point

##### Usage
```js
const { isPickupAddress } = require('@vtex/delivery-packages/dist/address')

isPickupAddress({
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
})
// -> false

isPickupAddress({
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
})
// -> true
```

**params:**
- **address**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm

**returns:**
- **isPickupAddress**
Type: `boolean`
If the address refers to a pickup point

## isDeliveryAddress (address)

Verify address refers to a residential address (to deliver items)

##### Usage
```js
const { isDeliveryAddress } = require('@vtex/delivery-packages/dist/address')

isDeliveryAddress({
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
})
// -> true

isDeliveryAddress({
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
})
// -> false
```

**params:**
- **address**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm

**returns:**
- **isDeliveryAddress**
Type: `boolean`
If the address refers to a residential address (to deliver items)

## isGiftRegistry (address)

Verify address refers to a gift list address

##### Usage
```js
const { isGiftRegistry } = require('@vtex/delivery-packages/dist/address')

isGiftRegistry({
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
})
// -> false

isGiftRegistry({
  addressId: '141125d',
  addressType: 'giftRegistry',
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
})
// -> true
```

**params:**
- **address**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm

**returns:**
- **isGiftRegistry**
Type: `boolean`
If the address refers to a gift list address


## getDeliveryAvailableAddresses (addresses)

Filter only residential and complete address

##### Usage
```js
const { getDeliveryAvailableAddresses } = require('@vtex/delivery-packages/dist/address')

getDeliveryAvailableAddresses([
  {
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
  {
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
])
// -> [
//   {
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   }
// ]
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on availableAddresses of orderForm

**returns:**
- **filteredAddresses**
Type: `Array<object>`
Filtered addresses that contain only residential and complete address

## groupByAddressType (addresses)

Create an object where each key is an address type and each value is an array of addresses grouped by each address type

##### Usage
```js
const { groupByAddressType } = require('@vtex/delivery-packages/dist/address')

groupByAddressType([
  {
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
  {
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
])
// -> {
//   residential: [{
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   }],
//   pickup: [{
//     addressId: '141125d',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [-43.18080139160156, -22.96540069580078],
//     neighborhood: 'Copacabana',
//     number: '5',
//     postalCode: '22011050',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Rua General Azevedo Pimentel',
//   }]
// }
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on selectedAddresses of orderForm

**returns:**
- **group of addresses**
Type: `object`
An object where each key is an address type and each value is an array of addresses grouped by each address type

## addOrReplaceAddressTypeOnList (addresses, newAddress)

Adds new address if the addressType of newAddress is not found or replace an existing address of that type

##### Usage
```js
const { addOrReplaceAddressTypeOnList } = require('@vtex/delivery-packages/dist/address')

addOrReplaceAddressTypeOnList([
  {
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
],
{
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
})
// -> [
//   {
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   },
//   {
//     addressId: '141125d',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [-43.18080139160156, -22.96540069580078],
//     neighborhood: 'Copacabana',
//     number: '5',
//     postalCode: '22011050',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Rua General Azevedo Pimentel',
//   }
// ]

addOrReplaceAddressTypeOnList([
  {
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
  {
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
], {
  addressId: '1234',
  addressType: 'pickup',
  city: 'Rio de Janeiro',
  complement: '',
  country: 'BRA',
  geoCoordinates: [],
  neighborhood: 'Botafogo',
  number: '300',
  postalCode: '22250040',
  receiverName: 'auto auto',
  reference: null,
  state: 'RJ',
  street: 'Praia de botafogo',
})
// -> [
//   {
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   },
//   {
//     addressId: '1234',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [],
//     neighborhood: 'Botafogo',
//     number: '300',
//     postalCode: '22250040',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Praia de botafogo',
//   }
// ]
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on selectedAddresses of orderForm
- **newAddress**
Type: `string`
New address to be included on the list of addresses

**returns:**
- **new addresses**
Type: `object`
New list of addresses with the newAddress included

## addOrReplaceAddressOnList (addresses, newAddress)

Adds new address if the newAddress is not found or replace an existing address with the same addressId

##### Usage
```js
const { addOrReplaceAddressOnList } = require('@vtex/delivery-packages/dist/address')

addOrReplaceAddressOnList([
  {
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
],
{
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
})
// -> [
//   {
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   },
//   {
//     addressId: '141125d',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [-43.18080139160156, -22.96540069580078],
//     neighborhood: 'Copacabana',
//     number: '5',
//     postalCode: '22011050',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Rua General Azevedo Pimentel',
//   }
// ]

addOrReplaceAddressTypeOnList([
  {
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
  {
    addressId: '1234',
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
], {
  addressId: '1234',
  addressType: 'pickup',
  city: 'Rio de Janeiro',
  complement: '',
  country: 'BRA',
  geoCoordinates: [],
  neighborhood: 'Botafogo',
  number: '300',
  postalCode: '22250040',
  receiverName: 'auto auto',
  reference: null,
  state: 'RJ',
  street: 'Praia de botafogo',
})
// -> [
//   {
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   },
//   {
//     addressId: '1234',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [],
//     neighborhood: 'Botafogo',
//     number: '300',
//     postalCode: '22250040',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Praia de botafogo',
//   }
// ]
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on selectedAddresses of orderForm
- **newAddress**
Type: `string`
New address to be included on the list of addresses

**returns:**
- **new addresses**
Type: `object`
New list of addresses with the newAddress included

## addOrReplaceDeliveryAddressOnList (addresses, newAddress)

Adds new address if no delivery address exists on addresses and if addressType of newAddress is delivery or replace an existing address of the delivery type

##### Usage
```js
const { addOrReplaceDeliveryAddressOnList } = require('@vtex/delivery-packages/dist/address')

addOrReplaceDeliveryAddressOnList([
  {
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
],

{
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
  })
// -> [
//   {
//     addressId: '141125d',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [-43.18080139160156, -22.96540069580078],
//     neighborhood: 'Copacabana',
//     number: '5',
//     postalCode: '22011050',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Rua General Azevedo Pimentel',
//   },
//   {
//     addressId: '-4556418741084',
//     addressType: 'residential',
//     receiverName: 'John Doe',
//     street: 'Rua Barão',
//     number: '2',
//     complement: null,
//     neighborhood: 'Botafogo',
//     postalCode: '22231-100',
//     city: 'Rio de Janeiro',
//     state: 'RJ',
//     country: 'BRA',
//     reference: null,
//     geoCoordinates: [],
//   },
// ]

addOrReplaceDeliveryAddressOnList([
  {
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
  {
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
], {
  addressId: '1234',
  addressType: 'commercial',
  city: 'Rio de Janeiro',
  complement: '',
  country: 'BRA',
  geoCoordinates: [],
  neighborhood: 'Botafogo',
  number: '300',
  postalCode: '22250040',
  receiverName: 'auto auto',
  reference: null,
  state: 'RJ',
  street: 'Praia de botafogo',
})
// -> [
//   {
//     addressId: '1234',
//     addressType: 'commercial',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [],
//     neighborhood: 'Botafogo',
//     number: '300',
//     postalCode: '22250040',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Praia de botafogo',
//   },
//   {
//     addressId: '1234',
//     addressType: 'pickup',
//     city: 'Rio de Janeiro',
//     complement: '',
//     country: 'BRA',
//     geoCoordinates: [],
//     neighborhood: 'Botafogo',
//     number: '300',
//     postalCode: '22250040',
//     receiverName: 'auto auto',
//     reference: null,
//     state: 'RJ',
//     street: 'Praia de botafogo',
//   }
// ]
```

**params:**
- **addresses**
Type: `Array<object>`
An array which each item is an object containing all address fields like on selectedAddresses of orderForm
- **newAddress**
Type: `object`
New address to be included on the list of addresses

**returns:**
- **new addresses**
Type: `Array<object>`
New list of addresses with the newAddress included

## Delivery Channel

> @vtex/delivery-packages/dist/delivery-channel

### getDeliveryChannel (deliveryChannelSource)

Get the delivery channel string of a delivery channel source.

##### Usage

```js
const {
  getDeliveryChannel,
} = require('@vtex/delivery-packages/dist/delivery-channel')

getDeliveryChannel({ id: 'pickup-in-point' })
// -> 'pickup-in-point'
```

**params:**

- **deliveryChannelSource**
  Type: `object` or `string`
  An object containing a deliveryChannel string or the string itself

**returns:**

- **deliveryChannel**
  Type: `string`
  The deliveryChannel string (generally 'pickup-in-point' or 'delivery')

### isPickup (deliveryChannelSource)

Check if the delivery channel source is a pickup point.

##### Usage

```js
const { isPickup } = require('@vtex/delivery-packages/dist/delivery-channel')

isPickup({ id: 'pickup-in-point' })
// -> true

isPickup({ selectedDeliveryChannel: 'pickup-in-point' })
// true

isPickup({ deliveryChannel: 'pickup-in-point' })
// true

isPickup({ id: 'delivery' })
// -> false
```

**params:**

- **deliveryChannelSource**
  Type: `object` or `string`
  An object containing a deliveryChannel string or the string itself

**returns:**

- **isPickup**
  Type: `boolean`
  true or false

### isDelivery (deliveryChannelSource)

Check if the delivery channel source is a delivery.

##### Usage

```js
const { isDelivery } = require('@vtex/delivery-packages/dist/delivery-channel')

isDelivery({ id: 'pickup-in-point' })
// -> false

isDelivery({ selectedDeliveryChannel: 'delivery' })
// true

isDelivery({ deliveryChannel: 'delivery' })
// true

isDelivery({ id: 'delivery' })
// -> true
```

**params:**

- **deliveryChannelSource**
  Type: `object` or `string`
  An object containing a deliveryChannel string or the string itself

**returns:**

- **isDelivery**
  Type: `boolean`
  true or false

### findChannelById (logisticsInfoItem, deliveryChannelSource)

Search for a delivery channel object from an object container a list of delivery channel objects (usually it will be a logisticsInfo item).

##### Usage

```js
const {
  findChannelById,
} = require('@vtex/delivery-packages/dist/delivery-channel')

findChannelById({ deliveryChannels: [{ id: 'delivery' }] }, 'pickup-in-point')
// -> null

findChannelById(
  { deliveryChannels: [{ id: 'delivery' }, { id: 'pickup-in-point' }] },
  'delivery'
)
// -> { id: 'delivery' }
```

**params:**

- **logisticsInfoItem**
  Type: `object`
  An object containing a deliveryChannels array
- **deliveryChannelSource**
  Type: `object` or `string`
  An object containing a deliveryChannel string or the string itself

**returns:**

- **deliveryChannel**
  Type: `object`
  Object like `{ id: 'delivery' }` or `{ id: 'pickup-in-point' }`

## Items

> @vtex/delivery-packages/dist/items

### getNewItems (items, changes)

Get new items based on the ones passed and an array of changes.

##### Usage

```js
const { getNewItems } = require('@vtex/delivery-packages/dist/items')

const items = [
  { id: 10, quantity: 1, seller: '1' },
  { id: 11, quantity: 1, seller: '1' },
]
const changes = [
  { itemsAdded: [{ id: 12, quantity: 1, seller: '1' }] },
  { itemsRemoved: [{ id: 11, quantity: 1, seller: '1' }] },
]

getNewItems(items, changes)
// -> [{ id: 10, quantity: 1, seller: '1' }, { id: 12, quantity: 1, seller: '1'}]
```

**params:**

- **items**
  Type: `Array<object>`
  Array of items (like the ones in an orderForm)

- **changes**
  Type: `Array<object>`
  Array of changes, each change on the format `{ itemsAdded: Array<item>, itemsRemoved: Array<item> }`

**returns:**

- **new items**
  Type: `Array<object>`
  New array of items with the changes applied

### getDeliveredItems ({ items, packages })

Merge items with packages and organize them based if they were already delivered or will be delivered.

##### Usage

```js
const { getDeliveredItems } = require('@vtex/delivery-packages/dist/items')

const items = [
  { id: 10, quantity: 1, seller: '1', index: 0 },
  { id: 11, quantity: 1, seller: '1', index: 1 },
]
const packages = [
  {
    courierStatus: { finished: false },
    index: 0,
    invoiceNumber: '456',
    items: [{ itemIndex: 0, quantity: 1 }, { itemIndex: 1, quantity: 1 }],
    trackingNumber: '123',
    trackingUrl: '',
  },
]

getDeliveredItems({ items, packages })
// -> {
//   delivered: [
//     {
//       item: { id: '10', index: 0, quantity: 1, seller: '1' },
//       package: {
//         courierStatus: { finished: false },
//         index: 0,
//         invoiceNumber: '456',
//         items: [{ itemIndex: 0, quantity: 1 }, { itemIndex: 1, quantity: 1 }],
//         trackingNumber: '123',
//         trackingUrl: '',
//       },
//     },
//   ],
//   toBeDelivered: [{ item: { id: '1', index: 1, quantity: 1, seller: '1' } }],
// }
```

**params:**

- **deliveryContext**
  Type: `object`
  Object on the format `{ items, packages }` containing the items and packages of an order, with the index of each item and package

**returns:**

- **items with packages**
  Type: `object`
  Object contained the keys delivered and toBeDelivered containing the right items and packages

### getItemsIndexes (items)

Return multiple values with information about the items indexes

##### Usage
```js
const { getItemsIndexes } = require('@vtex/delivery-packages/dist/items')

const items = [
  { itemIndex: 0, sla: 'sla1' },
  { itemIndex: 2, sla: 'sla2' },
]

getItemsIndexes(items)
// -> {
//   indexes: [0, 2],
//   otherIndexes: [1],
//   indexesMap: { 0: items[0], 2: items[1] },
//   maxIndex: 2,
// }
```

**params:**
- **items**
Type: `Array<object>`
Array of items with itemIndex keys like the logisticsInfo of the orderForm

**returns:**
- **indexes context**
Type: { indexes: `Array<number>`, otherIndexes: `Array<number>`, indexesMap: `object`, maxIndex: `number`}

indexes: an array with all the numbers matching the items passed

otherIndexes: an array with all the numbers not matching the items passed until maxIndex

indexesMap: an object where the keys are the indexes and the values are the original items

maxIndex: the maximum index found in the list of items

## Scheduled Delivery

> @vtex/delivery-packages/dist/scheduled-delivery

### areAvailableDeliveryWindowsEquals (availableDeliveryWindows1, availableDeliveryWindows2)

Check if two available delivery windows are equal.

##### Usage

```js
const {
  areAvailableDeliveryWindowsEquals,
} = require('@vtex/delivery-packages/dist/scheduled-delivery')

const availableDeliveryWindows1 = [
  {
    startDateUtc: '2018-05-26T09:00:00+00:00',
    endDateUtc: '2018-05-26T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
]

const availableDeliveryWindows2 = [
  {
    startDateUtc: '2018-05-26T09:00:00+00:00',
    endDateUtc: '2018-05-26T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
]

const availableDeliveryWindows3 = [
  {
    startDateUtc: '2018-06-20T09:00:00+00:00',
    endDateUtc: '2018-06-20T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
]

areAvailableDeliveryWindowsEquals(
  availableDeliveryWindows1,
  availableDeliveryWindows2
)
// -> true

areAvailableDeliveryWindowsEquals(
  availableDeliveryWindows1,
  availableDeliveryWindows3
)
// -> false
```

**params:**

- **availableDeliveryWindows1**
  Type: `Array<object>`
  Array of objects, each object with `startDateUtc`, `endDateUtc`, `price`, `lisPrice` and `tax` properties (like inside logisticsInfo[i].slas that have scheduled deliveries)

- **availableDeliveryWindows2**
  Type: `Array<object>`
  Array of objects, each object with `startDateUtc`, `endDateUtc`, `price`, `lisPrice` and `tax` properties (like inside logisticsInfo[i].slas that have scheduled deliveries)

**returns:**

- **are equal**
  Type: `boolean`
  true or false

### selectDeliveryWindow (logisticsInfo, { selectedSla, deliveryWindow })

Get new logisticsInfo with the deliveryWindow of the selectedSla inserted.

##### Usage

```js
const {
  selectDeliveryWindow,
} = require('@vtex/delivery-packages/dist/scheduled-delivery')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    addressId: '-4556418741084',
    selectedSla: 'Agendada',
    shippingEstimate: '5bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 0,
    slas: [
      // You can pass all the properties of the sla
      {
        id: 'Agendada',
        deliveryChannel: 'delivery',
        availableDeliveryWindows: [
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
        ],
      },
    ],
  },
  {
    addressId: '-4556418741084',
    selectedSla: 'Normal',
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 1,
    slas: [{ id: 'Normal', deliveryChannel: 'delivery' }],
  },
]

selectDeliveryWindow(logisticsInfo, {
  selectedSla: 'Agendada',
  deliveryWindow: {
    startDateUtc: '2018-05-26T09:00:00+00:00',
    endDateUtc: '2018-05-26T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  },
})
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": "Agendada",
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "deliveryWindow": {
//       startDateUtc: '2018-05-26T09:00:00+00:00',
//       endDateUtc: '2018-05-26T21:00:00+00:00',
//       price: 500,
//       lisPrice: 500,
//       tax: 0,
//     },
//     "slas": [
//       // You can pass all the properties of the sla
//       {
//         "id": "Agendada",
//         "deliveryChannel": "delivery",
//         "deliveryWindow": {
//           startDateUtc: '2018-05-26T09:00:00+00:00',
//           endDateUtc: '2018-05-26T21:00:00+00:00',
//           price: 500,
//           lisPrice: 500,
//           tax: 0,
//         },
//         "availableDeliveryWindows": [
//           {
//             startDateUtc: '2018-05-26T09:00:00+00:00',
//             endDateUtc: '2018-05-26T21:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           },
//           {
//             startDateUtc: '2018-05-26T12:00:00+00:00',
//             endDateUtc: '2018-05-26T13:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "addressId": "-4556418741084",
//     "selectedSla": "Normal",
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 1,
//     "slas": [
//       { "id": "Normal", "deliveryChannel": "delivery" }
//     ]
//   }
// ]
```

**params:**

- **logisticsInfo**
  Type: `Array<object>`
  The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`

- **action**
  Type: `object`
  Object on the format `{ selectedSla, deliveryWindow }`, selectedSla being a string with the id of the selectedSla of each logisticsInfo item and deliveryWindow being an object of the availableDeliveryWindows on these items

**returns:**

- **new logisticsInfo**
  Type: `Array<object>`
  The new logisticsInfo with the deliveryWindow selected on the matching items that have the selectedSla passed

### getFirstScheduledDelivery (logisticsInfo, availableDeliveryWindows = null)

Get the first sla with scheduled delivery matching the availableDeliveryWindows passed.

##### Usage

```js
const {
  getFirstScheduledDelivery,
} = require('@vtex/delivery-packages/dist/scheduled-delivery')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    addressId: '-4556418741084',
    selectedSla: 'Agendada',
    shippingEstimate: '5bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 0,
    slas: [
      // You can pass all the properties of the sla
      {
        id: 'Agendada',
        deliveryChannel: 'delivery',
        availableDeliveryWindows: [
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
        ],
      },
    ],
  },
  {
    addressId: '-4556418741084',
    selectedSla: 'Normal',
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 1,
    slas: [{ id: 'Normal', deliveryChannel: 'delivery' }],
  },
]

getFirstScheduledDelivery(logisticsInfo, [
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
])
// ->
// {
//   "id": "Agendada",
//   "deliveryChannel": "delivery",
//   "availableDeliveryWindows": [
//     {
//       startDateUtc: '2018-05-26T09:00:00+00:00',
//       endDateUtc: '2018-05-26T21:00:00+00:00',
//       price: 500,
//       lisPrice: 500,
//       tax: 0,
//     },
//     {
//       startDateUtc: '2018-05-26T12:00:00+00:00',
//       endDateUtc: '2018-05-26T13:00:00+00:00',
//       price: 500,
//       lisPrice: 500,
//       tax: 0,
//     }
//   ]
// }
```

**params:**

- **logisticsInfo**
  Type: `Array<object>`
  The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`

- **availableDeliveryWindows1**
  Type: `Array<object>`
  Array of objects, each object with `startDateUtc`, `endDateUtc`, `price`, `lisPrice` and `tax` properties (like inside logisticsInfo[i].slas that have scheduled deliveries). The default value for this parameter is null

**returns:**

- **sla**
  Type: `object`
  If availableDeliveryWindows is passed, return the first sla with scheduled delivery matching the availableDeliveryWindows. If availableDeliveryWindows is not passed, return the first scheduled delivery sla that exists

## Shipping

> @vtex/delivery-packages/dist/shipping

### getNewLogisticsInfo (logisticsInfo, selectedSla, availableDeliveryWindows = null)

Get new logisticsInfo with the selectedSla on all items that can receive it as selected.

##### Usage

```js
const { getNewLogisticsInfo } = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '5bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 0,
    slas: [
      // You can pass all the properties of the sla
      {
        id: 'Agendada',
        deliveryChannel: 'delivery',
        availableDeliveryWindows: [
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
        ],
      },
    ],
  },
  {
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 1,
    slas: [{ id: 'Normal', deliveryChannel: 'delivery' }],
  },
]

getNewLogisticsInfo(logisticsInfo, 'Normal')
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": null,
//     "selectedDeliveryChannel": null,
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "slas": [
//       // You can pass all the properties of the sla
//       {
//         "id": "Agendada",
//         "deliveryChannel": "delivery",
//         "availableDeliveryWindows": [
//           {
//             startDateUtc: '2018-05-26T09:00:00+00:00',
//             endDateUtc: '2018-05-26T21:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           },
//           {
//             startDateUtc: '2018-05-26T12:00:00+00:00',
//             endDateUtc: '2018-05-26T13:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "addressId": "-4556418741084",
//     "selectedSla": "Normal",
//     "selectedDeliveryChannel": "delivery",
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 1,
//     "slas": [
//       { "id": "Normal", "deliveryChannel": "delivery" }
//     ]
//   }
// ]

getNewLogisticsInfo(logisticsInfo, 'Agendada', [
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
])
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": "Agendada",
//     "selectedDeliveryChannel": "delivery",
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "slas": [
//       // You can pass all the properties of the sla
//       {
//         "id": "Agendada",
//         "deliveryChannel": "delivery",
//         "availableDeliveryWindows": [
//           {
//             startDateUtc: '2018-05-26T09:00:00+00:00',
//             endDateUtc: '2018-05-26T21:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           },
//           {
//             startDateUtc: '2018-05-26T12:00:00+00:00',
//             endDateUtc: '2018-05-26T13:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "addressId": "-4556418741084",
//     "selectedSla": null,
//     "selectedDeliveryChannel": null,
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 1,
//     "slas": [
//       { "id": "Normal", "deliveryChannel": "delivery" }
//     ]
//   }
// ]
```

**params:**

- **logisticsInfo**
  Type: `Array<object>`
  The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`

- **selectedSla**
  Type: `string`
  The id of the selected sla on logisticsInfo items

- **availableDeliveryWindows**
  Type: `Array<object>`
  Array of objects, each object with `startDateUtc`, `endDateUtc`, `price`, `lisPrice` and `tax` properties (like inside logisticsInfo[i].slas that have scheduled deliveries). The default value for this parameter is null

**returns:**

- **new logisticsInfo**
  Type: `Array<object>`
  New logisticsInfo with selectedSla and selectedDeliveryChannel filled correctly on each item with slas that can be selected. Optionally the availableDeliveryWindows can be passed to filter the scheduled delivery slas

### getNewLogisticsInfoWithSelectedScheduled (logisticsInfo)

Get new logisticsInfo selecting first sla that has availableDeliveryWindows on each item that can be scheduled delivered.

##### Usage

```js
const {
  getNewLogisticsInfoWithSelectedScheduled,
} = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '5bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 0,
    slas: [
      // You can pass all the properties of the sla
      {
        id: 'Agendada',
        deliveryChannel: 'delivery',
        availableDeliveryWindows: [
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
        ],
      },
    ],
  },
  {
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 1,
    slas: [{ id: 'Normal', deliveryChannel: 'delivery' }],
  },
]

getNewLogisticsInfoWithSelectedScheduled(logisticsInfo)
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": 'Agendada',
//     "selectedDeliveryChannel": 'delivery',
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "slas": [
//       // You can pass all the properties of the sla
//       {
//         "id": "Agendada",
//         "deliveryChannel": "delivery",
//         "availableDeliveryWindows": [
//           {
//             startDateUtc: '2018-05-26T09:00:00+00:00',
//             endDateUtc: '2018-05-26T21:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           },
//           {
//             startDateUtc: '2018-05-26T12:00:00+00:00',
//             endDateUtc: '2018-05-26T13:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "addressId": "-4556418741084",
//     "selectedSla": null,
//     "selectedDeliveryChannel": null,
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 1,
//     "slas": [
//       { "id": "Normal", "deliveryChannel": "delivery" }
//     ]
//   }
// ]
```

**params:**

- **logisticsInfo**
  Type: `Array<object>`
  The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`

**returns:**

- **new logisticsInfo**
  Type: `Array<object>`
  New logisticsInfo with selectedSla and selectedDeliveryChannel filled correctly on each item with slas that has availableDeliveryWindows

### getNewLogisticsInfoWithScheduledDeliveryChoice (logisticsInfo, scheduledDeliveryChoice, scheduledDeliveryItems = null)

Get new logisticsInfo selecting the sla and delivery window passed and optionally filtering by a logistics items array.

##### Usage

```js
const {
  getNewLogisticsInfoWithScheduledDeliveryChoice,
} = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '5bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 0,
    slas: [
      // You can pass all the properties of the sla
      {
        id: 'Agendada',
        deliveryChannel: 'delivery',
        availableDeliveryWindows: [
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
        ],
      },
    ],
  },
  {
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 1,
    slas: [{ id: 'Normal', deliveryChannel: 'delivery' }],
  },
]

const deliveryWindow = {
  startDateUtc: '2018-05-26T12:00:00+00:00',
  endDateUtc: '2018-05-26T13:00:00+00:00',
  price: 500,
  lisPrice: 500,
  tax: 0,
}

getNewLogisticsInfoWithScheduledDeliveryChoice(
  logisticsInfo,
  { selectedSla: 'Agendada', deliveryWindow },
  [{ itemIndex: 0 }]
)
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": 'Agendada',
//     "selectedDeliveryChannel": 'delivery',
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "deliveryWindow": {
//       startDateUtc: '2018-05-26T12:00:00+00:00',
//       endDateUtc: '2018-05-26T13:00:00+00:00',
//       price: 500,
//       lisPrice: 500,
//       tax: 0,
//     },
//     "slas": [
//       // You can pass all the properties of the sla
//       {
//         "id": "Agendada",
//         "deliveryChannel": "delivery",
//         "deliveryWindow": {
//           startDateUtc: '2018-05-26T12:00:00+00:00',
//           endDateUtc: '2018-05-26T13:00:00+00:00',
//           price: 500,
//           lisPrice: 500,
//           tax: 0,
//         },
//         "availableDeliveryWindows": [
//           {
//             startDateUtc: '2018-05-26T09:00:00+00:00',
//             endDateUtc: '2018-05-26T21:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           },
//           {
//             startDateUtc: '2018-05-26T12:00:00+00:00',
//             endDateUtc: '2018-05-26T13:00:00+00:00',
//             price: 500,
//             lisPrice: 500,
//             tax: 0,
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "addressId": "-4556418741084",
//     "selectedSla": null,
//     "selectedDeliveryChannel": null,
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 1,
//     "slas": [
//       { "id": "Normal", "deliveryChannel": "delivery" }
//     ]
//   }
// ]
```

**params:**

- **logisticsInfo**
  Type: `Array<object>`
  The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`
- **scheduledDeliveryChoice**
  Type: `object`
  An object like `{ selectedSla, deliveryWindow }` saying what sla and deliveryWindow to choose the delivery
- **scheduledDeliveryItems**
  Type: `Array<object>`
  An array of objects, each like `{ itemIndex: number }` or `{ index: number }` so that you can filter what items should change their selected sla and delivery window

**returns:**

- **new logisticsInfo**
  Type: `Array<object>`
  New logisticsInfo with selectedSla, selectedDeliveryChannel and deliveryWindow filled correctly according to the params

### filterLogisticsInfo (logisticsInfo, filters, keepSize = false)

Get new logisticsInfo filtered by filters object and optionally choosing if the missing items are maintained on the new array as `null` values, to keep the original size.

On each criteria, like in the `items` filter, the algorithm is to include everything that match any `item` filter (using an `||` logic).

##### Usage

```js
const { filterLogisticsInfo } = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '1bd',
    shippingEstimateDate: '2018-02-23T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 0,
    slas: [
      // You can pass all the properties of the sla
      { id: 'Expressa', deliveryChannel: 'delivery' },
    ],
  },
  {
    addressId: '-4556418741084',
    selectedSla: null,
    selectedDeliveryChannel: null,
    shippingEstimate: '6bd',
    shippingEstimateDate: '2018-02-24T19:01:07.0336412+00:00',
    deliveryChannel: 'delivery',
    itemIndex: 1,
    slas: [{ id: 'Normal', deliveryChannel: 'delivery' }],
  },
]

const items = [{ index: 0 }] // or const items = [{ itemIndex: 0 }, { itemIndex: 2 }]

filterLogisticsInfo(logisticsInfo, { items })
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": null,
//     "selectedDeliveryChannel": null,
//     "shippingEstimate": "1bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "slas": [
//       // You can pass all the properties of the sla
//       {"id": "Expressa", "deliveryChannel": "delivery"}
//     ]
//   }
// ]

const keepSize = true
filterLogisticsInfo(logisticsInfo, { items }, keepSize)
// -> [
//   {
//     // You can pass all the properties of the logisticsInfo
//     "addressId": "-4556418741084",
//     "selectedSla": null,
//     "selectedDeliveryChannel": null,
//     "shippingEstimate": "1bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "itemIndex": 0,
//     "slas": [
//       // You can pass all the properties of the sla
//       {"id": "Expressa", "deliveryChannel": "delivery"}
//     ]
//   },
//   null
// ]
```

**params:**

- **logisticsInfo**
  Type: `Array<object>`
  The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`
- **filters**
  Type: `object`
  An object like `{ items: [{ index or itemIndex: number }, ...], }` saying what items to filter on logisticsInfo
- **keepSize**
  Type: `boolean`
  Flag to inform if the missing items are maintained on the new array as `null` values, to keep the original size, or they are just removed (default)

**returns:**

- **new logisticsInfo**
  Type: `Array<object>`
  New logisticsInfo filtered by the `filters` param and with the size according to `keepSize` param

### getNewLogisticsMatchingSelectedAddresses (logisticsInfo, selectedAddresses)

Get new logisticsInfo and selectedAddresses making sure all pickup addresses that are on a selectedSla are included on selectedAddresses list and then making sure all logisticsInfo items have addressIds matching the ones on selectedAddresses.

##### Usage
```js
const { getNewLogisticsMatchingSelectedAddresses } = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    "addressId": "-4556418741084",
    "selectedSla": "MeuPickupPoint",
    "selectedDeliveryChannel": "pickup-in-point",
    "itemIndex": 0,
    "slas": [
      {
      	"id": "MeuPickupPoint",
      	"deliveryChannel": "pickup-in-point",
      	"name": "VTEX RJ (1b4e9b2)",
      	"shippingEstimate": "0bd",
      	"price": 0,
      	"pickupPointId": "1_1b4e9b2",
      	"pickupStoreInfo": {
      		"isPickupStore": true,
      		"friendlyName": "VTEX RJ",
      		"address": {
      			"addressType": "pickup",
      			"receiverName": null,
      			"addressId": "1b4e9b2",
      			"postalCode": "22250040",
      			"city": "Rio de Janeiro",
      			"state": "RJ",
      			"country": "BRA",
      			"street": "Praia de Botafogo",
      			"number": "300",
      			"neighborhood": "Botafogo",
      			"complement": "",
      			"reference": null,
      			"geoCoordinates": [-43.1822662, -22.9459858]
      		}
      	}
      }
    ]
  },
  {
    "addressId": null,
    "selectedSla": "Normal",
    "selectedDeliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      // You can pass all the properties of the sla
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
]

const selectedAddresses = [{
  "addressId": "-4556418741084",
  "addressType": "residential",
  "receiverName": "John Doe",
  "street": "Rua Barão",
  "number": "2",
  "complement": null,
  "neighborhood": "Botafogo",
  "postalCode": "22231-100",
  "city": "Rio de Janeiro",
  "state": "RJ",
  "country": "BRA",
  "reference": null,
  "geoCoordinates": [],
}]

getNewLogisticsMatchingSelectedAddresses(logisticsInfo, selectedAddresses)
// -> {
//   logisticsInfo: [{
//     "addressId": "1b4e9b2",
//     "selectedSla": "MeuPickupPoint",
//     "selectedDeliveryChannel": "pickup-in-point",
//     "itemIndex": 0,
//     "slas": [
//       {
//       	"id": "MeuPickupPoint",
//       	"deliveryChannel": "pickup-in-point",
//       	"name": "VTEX RJ (1b4e9b2)",
//       	"shippingEstimate": "0bd",
//       	"price": 0,
//       	"pickupPointId": "1_1b4e9b2",
//       	"pickupStoreInfo": {
//       		"isPickupStore": true,
//       		"friendlyName": "VTEX RJ",
//       		"address": {
//       			"addressType": "pickup",
//       			"receiverName": null,
//       			"addressId": "1b4e9b2",
//       			"postalCode": "22250040",
//       			"city": "Rio de Janeiro",
//       			"state": "RJ",
//       			"country": "BRA",
//       			"street": "Praia de Botafogo",
//       			"number": "300",
//       			"neighborhood": "Botafogo",
//       			"complement": "",
//       			"reference": null,
//       			"geoCoordinates": [-43.1822662, -22.9459858]
//       		}
//       	}
//       }
//     ]
//   },
//   {
//     "addressId": "-4556418741084",
//     "selectedSla": "Normal",
//     "selectedDeliveryChannel": "delivery",
//     "itemIndex": 1,
//     "slas": [
//       { "id": "Normal", "deliveryChannel": "delivery" }
//     ]
//   }],
//   selectedAddresses: [{
//     "addressId": "-4556418741084",
//     "addressType": "residential",
//     "receiverName": "John Doe",
//     "street": "Rua Barão",
//     "number": "2",
//     "complement": null,
//     "neighborhood": "Botafogo",
//     "postalCode": "22231-100",
//     "city": "Rio de Janeiro",
//     "state": "RJ",
//     "country": "BRA",
//     "reference": null,
//     "geoCoordinates": [],
//   }, {
//     "addressType": "pickup",
//     "receiverName": null,
//     "addressId": "1b4e9b2",
//     "postalCode": "22250040",
//     "city": "Rio de Janeiro",
//     "state": "RJ",
//     "country": "BRA",
//     "street": "Praia de Botafogo",
//     "number": "300",
//     "neighborhood": "Botafogo",
//     "complement": "",
//     "reference": null,
//     "geoCoordinates": [-43.1822662, -22.9459858]
//   }]
// }
```

**params:**
- **logisticsInfo**
Type: `Array<object>`
The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`
- **selectedAddresses**
Type: `Array<object>`
The selectedAddresses like the one inside `orderForm.shippingData` with address objects that are related to the order
**returns:**
- **new object with new logisticsInfo and new selectedAddresses**
Type: `{ logisticsInfo: Array<object>, selectedAddresses: Array<object> }`
New logisticsInfo and selectedAddresses with matching addressIds and with all pickup addresses included

### mergeLogisticsInfos (logisticsInfo1, logisticsInfo2)

Get new logisticsInfo with the merged items from logisticsInfo1 and logisticsInfo2

##### Usage
```js
const { mergeLogisticsInfos } = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo1 = [
  {
    // You can pass all the properties of the logisticsInfo
    "itemIndex": 0,
    "selectedSla": "sla1",
  },
  {
    // You can pass all the properties of the logisticsInfo
    "itemIndex": 2,
    "selectedSla": "sla3",
  }
]
const logisticsInfo2 = [
  {
    // You can pass all the properties of the logisticsInfo
    "itemIndex": 1,
    "selectedSla": "sla2",
  }
]
mergeLogisticsInfos(logisticsInfo1, logisticsInfo2)
// -> [
//   {
//     "itemIndex": 0,
//     "selectedSla": "sla1",
//   },
//   {
//     "itemIndex": 1,
//     "selectedSla": "sla2",
//   },
//   {
//     "itemIndex": 2,
//     "selectedSla": "sla3",
//   },
// ]
```

**params:**
- **logisticsInfo1**
Type: `Array<object>`
The logisticsInfo like the one inside `orderForm.shippingData` with `itemIndex`
- **logisticsInfo2**
Type: `Array<object>`
The logisticsInfo like the one inside `orderForm.shippingData` with `itemIndex`
**returns:**
- **new logisticsInfo**
Type: `Array<object>`
Return all items of logisticsInfo2 completing its missing items from the logisticsInfo1 (merge operation)

## SLA

> @vtex/delivery-packages/dist/sla

### hasSLAs (slasSource)

Check if the object or array passed have one or more slas

##### Usage

```js
const { hasSLAs } = require('@vtex/delivery-packages/dist/sla')

hasSLAs({
  slas: [
    { id: 'Normal', deliveryChannel: 'delivery' },
    { id: 'Expressa', deliveryChannel: 'delivery' },
  ],
})
// -> true

hasSLAs([
  { id: 'Normal', deliveryChannel: 'delivery' },
  { id: 'Expressa', deliveryChannel: 'delivery' },
])
// -> true

hasSLAs({ slas: [] })
// -> false
```

**params:**

- **slasSource**
  Type: `object` or `Array<object>`
  Object with slas key or array of objects

**returns:**

- **hasSLAs**
  Type: `boolean`
  true or false

### hasDeliveryWindows (slas)

Check if the object or array passed have at least of sla that can be scheduled delivered.

##### Usage

```js
const { hasDeliveryWindows } = require('@vtex/delivery-packages/dist/sla')

hasDeliveryWindows([
  { id: 'Normal', deliveryChannel: 'delivery' },
  { id: 'Expressa', deliveryChannel: 'delivery' },
])
// -> false

hasDeliveryWindows([
  {
    id: 'Agendada',
    deliveryChannel: 'delivery',
    availableDeliveryWindows: [
      {
        startDateUtc: '2018-05-26T09:00:00+00:00',
        endDateUtc: '2018-05-26T21:00:00+00:00',
        price: 500,
        lisPrice: 500,
        tax: 0,
      },
    ],
  },
  { id: 'Expressa', deliveryChannel: 'delivery' },
])
// -> true

hasDeliveryWindows({
  id: 'Agendada',
  deliveryChannel: 'delivery',
  availableDeliveryWindows: [
    {
      startDateUtc: '2018-05-26T09:00:00+00:00',
      endDateUtc: '2018-05-26T21:00:00+00:00',
      price: 500,
      lisPrice: 500,
      tax: 0,
    },
  ],
})
// -> true
```

**params:**

- **slas**
  Type: `object` or `Array<object>`
  Object with a single sla or an array of slas

**returns:**

- **hasDeliveryWindows**
  Type: `boolean`
  true or false

### excludePickupTypeFromSlas (slas)

Return only delivery slas from a list of slas passed.

##### Usage

```js
const {
  excludePickupTypeFromSlas,
} = require('@vtex/delivery-packages/dist/sla')

excludePickupTypeFromSlas([
  { id: 'Normal', deliveryChannel: 'delivery' },
  {
    id: 'Pickup',
    deliveryChannel: 'delivery',
    pickupStoreInfo: { isPickupStore: true, friendlyName: 'Shopping da Gávea' },
  },
])
// -> [ { "id": "Normal", "deliveryChannel": "delivery" } ]
```

**params:**

- **slas**
  Type: `Array<object>`
  An array of slas

**returns:**

- **delivery slas**
  Type: `Array<object>`
  An array with only the delivery slas (no pickup point sla)

### getSlaObj (slas, slaId)

Get the sla object on slas that match the slaId passed.

##### Usage

```js
const { getSlaObj } = require('@vtex/delivery-packages/dist/sla')

getSlaObj(
  [
    { id: 'Normal', deliveryChannel: 'delivery' },
    { id: 'Expressa', deliveryChannel: 'delivery' },
  ],
  'Normal'
)
// -> { "id": "Normal", "deliveryChannel": "delivery" }

getSlaObj(
  [
    { id: 'Normal', deliveryChannel: 'delivery' },
    { id: 'Expressa', deliveryChannel: 'delivery' },
  ],
  'Agendada'
)
// -> null
```

**params:**

- **slas**
  Type: `Array<object>`
  An array of slas

- **slaId**
  Type: `string`
  The id of a sla of the list passed

**returns:**

- **sla**
  Type: `object`
  the sla object on the array that match the slaId passed or null if it doesn't find it

### getSlaType (slaObj, order)

Get the sla type (`delivery`, `pickup-in-point` or `take-away`) based on the sla deliveryChannel and if order is checkedIn

##### Usage

```js
const { getSlaType } = require('@vtex/delivery-packages/dist/sla')

getSlaType(
  { id: 'Normal', deliveryChannel: 'delivery' }
)
// -> "delivery"

getSlaType(
  { id: 'Pickup', deliveryChannel: 'pickup-in-point' }
)
// -> "pickup-in-point"

getSlaType(
  { id: 'Pickup checked In', deliveryChannel: 'pickup-in-point', pickupPointId: '1_2' },
  { orderId: '123', checkedInPickupPointId: '1_2' }
)
// -> "take-away"
```

**params:**

- **sla**
  Type: `object`
  An sla object

- **order**
  Type: `object`
  An optional order object with the `checkedInPickupPointId` information

**returns:**

- **sla type**
  Type: `string`
  the sla type (`delivery`, `pickup-in-point` or `take-away`)

### changeSelectedSla (logisticsInfoItem, sla)

Change logisticsInfoItem info to match the sla passed

##### Usage
```js
const { changeSelectedSla } = require('@vtex/delivery-packages/dist/sla')

changeSelectedSla(
  // Pode passar qualquer outra propriedade de um logisticsInfo item
  { "itemIndex": 0, "selectedSla": "Pickup", "selectedDeliveryChannel": "pickup-in-point" },
  { "id": "Normal", "deliveryChannel": "delivery" }
)
// -> { "itemIndex": 0, "selectedSla": "Normal", "selectedDeliveryChannel": "delivery" }
```

**params:**
- **logisticsInfoItem**
Type: `object`
An object like the ones on logisticsInfo of the orderForm
- **sla**
Type: `object`
An object like the ones on logisticsInfoItem.slas

**returns:**
- **newLogisticsInfoItem**
Type: `object`
The new logisticsInfoItem with the selectedSla infos changed to match the sla param

### getSelectedSla ({logisticsInfo, itemIndex, selectedSla})

Get the select sla object on logisticsInfo at the itemIndex position and optionally passing another selectedSla as reference.

##### Usage

```js
const { getSelectedSla } = require('@vtex/delivery-packages/dist/sla')

getSelectedSla({
  logisticsInfo: [
    {
      // other logisticsInfo properties can be passed also
      selectedSla: 'Normal',
      slas: [
        { id: 'Normal', deliveryChannel: 'delivery' },
        { id: 'Expressa', deliveryChannel: 'delivery' },
      ],
    },
    {
      // other logisticsInfo properties can be passed also
      selectedSla: 'Expressa',
      slas: [
        { id: 'Normal', deliveryChannel: 'delivery' },
        { id: 'Expressa', deliveryChannel: 'delivery' },
      ],
    },
  ],
  itemIndex: 0,
})
// -> { "id": "Normal", "deliveryChannel": "delivery" }

getSelectedSla({
  logisticsInfo: [
    {
      // other logisticsInfo properties can be passed also
      selectedSla: 'Normal',
      slas: [
        { id: 'Normal', deliveryChannel: 'delivery' },
        { id: 'Expressa', deliveryChannel: 'delivery' },
      ],
    },
    {
      // other logisticsInfo properties can be passed also
      selectedSla: 'Expressa',
      slas: [
        { id: 'Normal', deliveryChannel: 'delivery' },
        { id: 'Expressa', deliveryChannel: 'delivery' },
      ],
    },
  ],
  itemIndex: 1,
  selectedSla: 'Normal',
})
// -> { "id": "Normal", "deliveryChannel": "delivery" }
```

**params:**

- **selectedSlaContext**
  Type: `object`
  Object on the format `{logisticsInfo, itemIndex, selectedSla}` with logisticsInfo being an object like the one inside an orderForm, itemIndex a number referring the position of a logisticsInfo item and selectedSla an optional string with the id of the wanted sla

**returns:**

- **selectedSla**
Type: `object`
the selectedSla object on the logisticsInfo item that itemIndex refers and optionally using another selectedSla then the one on logisticsInfo item

### getSelectedSlas (logisticsInfo)

Get all selected slas objects on logisticsInfo.

##### Usage
```js
const { getSelectedSlas } = require('@vtex/delivery-packages/dist/sla')

let logisticsInfo = [
  {
    // other logisticsInfo properties can be passed also
    selectedSla: 'Normal',
    itemIndex: 0,
    slas: [
      { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
    ]
  },
  {
    // other logisticsInfo properties can be passed also
    selectedSla: 'Expressa',
    itemIndex: 1,
    slas: [
      { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
    ]
  }
]

getSelectedSlas(logisticsInfo)
// -> [{ itemIndex: 0, "id": "Normal", "deliveryChannel": "delivery" }, { itemIndex: 1, "id": "Expressa", "deliveryChannel": "delivery" }]

logisticsInfo = [
  {
    // other logisticsInfo properties can be passed also
    selectedSla: 'Normal',
    itemIndex: 0,
    slas: [
      { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
    ]
  },
  {
    // other logisticsInfo properties can be passed also
    selectedSla: null,
    itemIndex: 1,
    slas: [
      { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
    ]
  }
]

getSelectedSlas(logisticsInfo)
// -> [{ itemIndex: 0, "id": "Normal", "deliveryChannel": "delivery" }, null]
```

**params:**
- **logisticsInfo**
Type: `Array<object>`
The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`

**returns:**
- **selectedSlas**
Type: `Array<object>`
the selected slas objects on the logisticsInfo items hydrated with itemIndex reference or empty array in case of wrong or empty params passed

## getPickupSelectedSlas (logisticsInfo)

Get the selected slas objects on logisticsInfo filtered by pickup points type.

##### Usage
```js
const { getPickupSelectedSlas } = require('@vtex/delivery-packages/dist/sla')

let logisticsInfo = [
  {
    // other logisticsInfo properties can be passed also
    selectedSla: 'Normal',
    itemIndex: 0,
    slas: [
      { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
    ]
  },
  {
    // other logisticsInfo properties can be passed also
    selectedSla: 'Pickup',
    itemIndex: 1,
    slas: [
      { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Pickup", "deliveryChannel": "pickup-in-point" }
    ]
  }
]

getPickupSelectedSlas(logisticsInfo)
// -> [{ "itemIndex": 1,  "id": "Pickup", "deliveryChannel": "pickup-in-point" }]
```

**params:**
- **logisticsInfo**
Type: `Array<object>`
The logisticsInfo like the one inside `orderForm.shippingData` with `selectedSla` and `slas`

**returns:**
- **selectedPickupSlas**
Type: `Array<object>`
the selected slas objects on the logisticsInfo items hydrated with itemIndex reference and filtered by pickup type or empty array in case of wrong or empty params passed

## License

MIT © [VTEX](https://www.vtex.com)

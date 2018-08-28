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

This module provides a consistent way to handle all those criteria.

And provide also helper functions for other use cases.

## Install

```sh
$ npm install @vtex/delivery-packages
```

## Usage

```js
const parcelify = require('@vtex/delivery-packages')

parcelify(order)
// [
//   {
//     "seller": "1",
//     "pickupFriendlyName": null,
//     "selectedSla": "Normal",
//     "slas": [
//       {
//         "id": "Normal",
//         "deliveryChannel": "delivery",
//         ...
//       }
//     ],
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "items": [
//       {
//         "index": 0,
//         "id": 0,
//         "quantity": 1,
//         "seller": "1",
//         ...
//       }
//     ],
//     "address": {
//       "addressId": "-4556418741084",
//       "addressType": "residential",
//       "receiverName": "John Doe",
//       ...
//     }
//   },
//   {
//     "seller": "2",
//     "pickupFriendlyName": "Shopping da Gávea",
//     "selectedSla": "Retirada na loja (17c6a89)",
//     "slas": [
//       {
//         "id": "Retirada na loja (17c6a89)",
//         "deliveryChannel": "pickup-in-point",
//         ...
//       }
//     ],
//     "shippingEstimate": "5h",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "pickup-in-point",
//     "items": [
//       {
//         "id": 1,
//         "quantity": 1,
//         "seller": "2",
//         "index": 1
//       }
//     ],
//     "address": {
//       "addressId": "141125d",
//       "addressType": "pickup",
//       "geoCoordinates": [-43.18080139160156, -22.96540069580078],
//       ...
//     }
//   }
// ]
```

## API

### parcelify(order, options)

Returns an array of [Parcel](#Parcel)s.

#### order

An order shaped like an [orderForm](https://github.com/vtex/vtex.js/blob/master/docs/checkout/order-form.md).

#### options.criteria

Type: `Object`<br/>
Default:<br/>
```js
{
  groupByAvailableDeliveryWindows: false,
  slaOptions: false,
  selectedSla: true,
  seller: true,
  shippingEstimate: true,
  deliveryChannel: true
}
```

This param will be merged with the default options.

## Parcel

A Parcel object shape

```js
{
  address: Object,
  pickupFriendlyName: String,
  seller: String,
  items: [Object],
  package: Object,  
  selectedSla: String,
  slas: [Object],
  shippingEstimate: String,
  shippingEstimateDate: String,
  deliveryChannel: String,
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
const order = {
  items: [
    // You can pass all the properties of the item. That's simplified.
    { "id": 0, "quantity": 1, "seller": "1" },
    { "id": 1, "quantity": 1, "seller": "1" }
  ],
  shippingData: {
    selectedAddresses: [
      { "addressId": "-4556418741084", "street": "Rua Barão" }
    ],
    logisticsInfo: [
      {
        // You can pass all the properties of the logisticsInfo
        "addressId": "-4556418741084",
        "selectedSla": "Expressa",
        "shippingEstimate": "5bd",
        "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
        "deliveryChannel": "delivery",
        "itemIndex": 0,
        "slas": [
          // You can pass all the properties of the sla
          { "id": "Expressa", "deliveryChannel": "delivery" }
        ]
      },
      {
        "addressId": "-4556418741084",
        "selectedSla": "Normal",
        "shippingEstimate": "6bd",
        "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
        "deliveryChannel": "delivery",
        "itemIndex": 1,
        "slas": [
          { "id": "Normal", "deliveryChannel": "delivery" }
        ]
      }
    ]
  },
  packageAttachment: {
    packages: [
      {
        // You can pass all the properties of tha package.
        "courierStatus": { "finished": false },
        "trackingNumber": "123",
        "trackingUrl": "",
        "invoiceNumber": "456",
        "items": [
          { "itemIndex": 0, "quantity": 1 }
        ]
      }
    ]
  }
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
//     "pickupFriendlyName": null,
//     "selectedSla": "Expressa",
//     "slas": [{ "id": "Expressa", "deliveryChannel": "delivery" }],
//     "shippingEstimate": "5bd",
//     "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "items": [
//       { "id": 0, "quantity": 1, "seller": "1", "index": 0 }
//     ],
//     "seller": "1"
//   },
//   {
//     "address": { "addressId": "-4556418741084", "street": "Rua Barão" },
//     "pickupFriendlyName": null,
//     "selectedSla": "Normal",
//     "slas": [{ "id": "Normal", "deliveryChannel": "delivery" }],
//     "shippingEstimate": "6bd",
//     "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
//     "deliveryChannel": "delivery",
//     "items": [
//       { "id": 1, "quantity": 1, "seller": "1", "index": 1 }
//     ],
//     "seller": "1"
//   }
// ]
```

## Other important functions

This module provide a lot of helper functions besides parcelify, that are worth checking below.

## Address
> @vtex/delivery-packages/dist/address

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
```

**params:**
- **address**
Type: `object`
An object containing all address fields like on availableAddresses of orderForm

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

## Delivery Channel
> @vtex/delivery-packages/dist/delivery-channel

### getDeliveryChannel (deliveryChannelSource)

Get the delivery channel string of a delivery channel source.

##### Usage
```js
const { getDeliveryChannel } = require('@vtex/delivery-packages/dist/delivery-channel')

getDeliveryChannel({ id: 'pickup-in-point'})
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

isPickup({ id: 'pickup-in-point'})
// -> true

isPickup({ selectedDeliveryChannel: 'pickup-in-point' })
// true

isPickup({ deliveryChannel:  'pickup-in-point' })
// true

isPickup({ id: 'delivery'})
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

isDelivery({ id: 'pickup-in-point'})
// -> false

isDelivery({ selectedDeliveryChannel: 'delivery' })
// true

isDelivery({ deliveryChannel:  'delivery' })
// true

isDelivery({ id: 'delivery'})
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
const { findChannelById } = require('@vtex/delivery-packages/dist/delivery-channel')

findChannelById({ deliveryChannels: [{ id: 'delivery' }] }, 'pickup-in-point')
// -> null

findChannelById({ deliveryChannels: [{ id: 'delivery' }, { id: 'pickup-in-point' }] }, 'delivery')
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
    items: [
      { itemIndex: 0, quantity: 1 },
      { itemIndex: 1, quantity: 1 },
    ],
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

## Scheduled Delivery
> @vtex/delivery-packages/dist/scheduled-delivery

### areAvailableDeliveryWindowsEquals (availableDeliveryWindows1, availableDeliveryWindows2)

Check if two available delivery windows are equal.

##### Usage
```js
const { areAvailableDeliveryWindowsEquals } = require('@vtex/delivery-packages/dist/scheduled-delivery')

const availableDeliveryWindows1 = [
  {
    startDateUtc: '2018-05-26T09:00:00+00:00',
    endDateUtc: '2018-05-26T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  }
]

const availableDeliveryWindows2 = [
  {
    startDateUtc: '2018-05-26T09:00:00+00:00',
    endDateUtc: '2018-05-26T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  }
]

const availableDeliveryWindows3 = [
  {
    startDateUtc: '2018-06-20T09:00:00+00:00',
    endDateUtc: '2018-06-20T21:00:00+00:00',
    price: 500,
    lisPrice: 500,
    tax: 0,
  }
]

areAvailableDeliveryWindowsEquals(availableDeliveryWindows1, availableDeliveryWindows2)
// -> true

areAvailableDeliveryWindowsEquals(availableDeliveryWindows1, availableDeliveryWindows3)
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
const { selectDeliveryWindow } = require('@vtex/delivery-packages/dist/scheduled-delivery')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    "addressId": "-4556418741084",
    "selectedSla": "Agendada",
    "shippingEstimate": "5bd",
    "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 0,
    "slas": [
      // You can pass all the properties of the sla
      {
        "id": "Agendada",
        "deliveryChannel": "delivery",
        "availableDeliveryWindows": [
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
          }
        ]
      }
    ]
  },
  {
    "addressId": "-4556418741084",
    "selectedSla": "Normal",
    "shippingEstimate": "6bd",
    "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`

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
const { getFirstScheduledDelivery } = require('@vtex/delivery-packages/dist/scheduled-delivery')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    "addressId": "-4556418741084",
    "selectedSla": "Agendada",
    "shippingEstimate": "5bd",
    "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 0,
    "slas": [
      // You can pass all the properties of the sla
      {
        "id": "Agendada",
        "deliveryChannel": "delivery",
        "availableDeliveryWindows": [
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
          }
        ]
      }
    ]
  },
  {
    "addressId": "-4556418741084",
    "selectedSla": "Normal",
    "shippingEstimate": "6bd",
    "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
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
  }
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`

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
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "5bd",
    "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 0,
    "slas": [
      // You can pass all the properties of the sla
      {
        "id": "Agendada",
        "deliveryChannel": "delivery",
        "availableDeliveryWindows": [
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
          }
        ]
      }
    ]
  },
  {
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "6bd",
    "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
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
  }
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`

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
const { getNewLogisticsInfoWithSelectedScheduled } = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "5bd",
    "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 0,
    "slas": [
      // You can pass all the properties of the sla
      {
        "id": "Agendada",
        "deliveryChannel": "delivery",
        "availableDeliveryWindows": [
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
          }
        ]
      }
    ]
  },
  {
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "6bd",
    "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`

**returns:**
- **new logisticsInfo**
Type: `Array<object>`
New logisticsInfo with selectedSla and selectedDeliveryChannel filled correctly on each item with slas that has availableDeliveryWindows


### getNewLogisticsInfoWithScheduledDeliveryChoice (logisticsInfo, scheduledDeliveryChoice, scheduledDeliveryItems = null)

Get new logisticsInfo selecting the sla and delivery window passed and optionally filtering by a logistics items array.

##### Usage
```js
const { getNewLogisticsInfoWithScheduledDeliveryChoice } = require('@vtex/delivery-packages/dist/shipping')

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticsInfo
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "5bd",
    "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 0,
    "slas": [
      // You can pass all the properties of the sla
      {
        "id": "Agendada",
        "deliveryChannel": "delivery",
        "availableDeliveryWindows": [
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
          }
        ]
      }
    ]
  },
  {
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "6bd",
    "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
]

const deliveryWindow = {
  startDateUtc: '2018-05-26T12:00:00+00:00',
  endDateUtc: '2018-05-26T13:00:00+00:00',
  price: 500,
  lisPrice: 500,
  tax: 0,
}

getNewLogisticsInfoWithScheduledDeliveryChoice(logisticsInfo, { selectedSla: 'Agendada', deliveryWindow }, [{ itemIndex: 0 }])
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`
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
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "1bd",
    "shippingEstimateDate": "2018-02-23T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 0,
    "slas": [
      // You can pass all the properties of the sla
      {"id": "Expressa", "deliveryChannel": "delivery"}
    ]
  },
  {
    "addressId": "-4556418741084",
    "selectedSla": null,
    "selectedDeliveryChannel": null,
    "shippingEstimate": "6bd",
    "shippingEstimateDate": "2018-02-24T19:01:07.0336412+00:00",
    "deliveryChannel": "delivery",
    "itemIndex": 1,
    "slas": [
      { "id": "Normal", "deliveryChannel": "delivery" }
    ]
  }
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`
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

## SLA
> @vtex/delivery-packages/dist/sla

### hasSLAs (slasSource)

Check if the object or array passed have one or more slas

##### Usage
```js
const { hasSLAs } = require('@vtex/delivery-packages/dist/sla')

hasSLAs({
  slas: [{ "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }],
})
// -> true

hasSLAs([{ "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }],)
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
  { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
])
// -> false

hasDeliveryWindows([
  {
    "id": "Agendada",
    "deliveryChannel": "delivery",
    "availableDeliveryWindows":
    [
      {
        startDateUtc: '2018-05-26T09:00:00+00:00',
        endDateUtc: '2018-05-26T21:00:00+00:00',
        price: 500,
        lisPrice: 500,
        tax: 0,
      }
    ]
  },
  { "id": "Expressa", "deliveryChannel": "delivery" }
])
// -> true

hasDeliveryWindows({
  "id": "Agendada",
  "deliveryChannel": "delivery",
  "availableDeliveryWindows":
  [
    {
      startDateUtc: '2018-05-26T09:00:00+00:00',
      endDateUtc: '2018-05-26T21:00:00+00:00',
      price: 500,
      lisPrice: 500,
      tax: 0,
    }
  ]
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
const { excludePickupTypeFromSlas } = require('@vtex/delivery-packages/dist/sla')

excludePickupTypeFromSlas([
  { "id": "Normal", "deliveryChannel": "delivery" },
  { "id": "Pickup", "deliveryChannel": "delivery", pickupStoreInfo: { isPickupStore: true, friendlyName: 'Shopping da Gávea' }, }
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

getSlaObj([
  { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
], 'Normal')
// -> { "id": "Normal", "deliveryChannel": "delivery" }

getSlaObj([
  { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
], 'Agendada')
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
        { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
      ]
    },
    {
      // other logisticsInfo properties can be passed also
      selectedSla: 'Expressa',
      slas: [
        { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
      ]
    }
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
        { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
      ]
    },
    {
      // other logisticsInfo properties can be passed also
      selectedSla: 'Expressa',
      slas: [
        { "id": "Normal", "deliveryChannel": "delivery" }, { "id": "Expressa", "deliveryChannel": "delivery" }
      ]
    }
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
The logisticsInfo like the one inside `orderForm` with `selectedSla` and `slas`

**returns:**
- **selectedSlas**
Type: `Array<object>`
the selected slas objects on the logisticsInfo items hydrated with itemIndex reference or empty array in case of wrong or empty params passed

## License

MIT © [VTEX](https://www.vtex.com)

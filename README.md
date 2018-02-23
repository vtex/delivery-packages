# delivery-packages

> Small library to separate items in packages

## Install

```sh
$ npm install @vtex/delivery-packages
```

## Usage

```js
const packagify = require('@vtex/delivery-packages')

packagify({
  items,
  selectedAddresses,
  logisticsInfo
})
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

### packagify({ items, selectedAddresses, logisticsInfo, packages })

Returns an array of [Package](#Package)

#### items

The `items` array from the order.

#### selectedAddresses

The `selectedAddress` array from the order's `shippingData`.

#### logisticsInfo

The `logisticsInfo` array from the order's `shippingData`.

#### packages (optional)

The `packages` array from the order's `packageAttachment`. This property is only available using OMS API.

## Package

A Package object shape

```js
{
  address: Object,
  pickupFriendlyName: String,
  seller: String,
  package: Object,  
  selectedSla: String,
  slas: [Object],
  shippingEstimate: String,
  shippingEstimateDate: String,
  deliveryChannel: String,
}
```

#### address

The `address` used for that package. If it is a pickup point, the address of the pickup point is returned.

#### pickupFriendlyName

If the package is delivered to a pickup point, this field has its friendly name.

#### seller

The seller of the package.

#### package

The `package` object from `packageAttachment`, if it is one.

#### slas, selectedSla, shippingEstimate, shippingEstimateDate, deliveryChannel

These properties are taken from the `logisticsInfo` of the package.

## Example

```js
const items = [
  // You can pass all the properties of the item. That's simplified.
  { "id": 0, "quantity": 1, "seller": "1" },
  { "id": 1, "quantity": 1, "seller": "1" }
]

const selectedAddresses = [
  {
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
    "geoCoordinates": []
  }
]

const logisticsInfo = [
  {
    // You can pass all the properties of the logisticInfo
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

const packages = [
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

packagify({items, selectedAddresses, logisticsInfo, packages})

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
//     "address": {
//       "addressId": "-4556418741084",
//       "addressType": "residential",
//       "receiverName": "John Doe",
//       "street": "Rua Barão",
//       "number": "2",
//       "complement": null,
//       "neighborhood": "Botafogo",
//       "postalCode": "22231-100",
//       "city": "Rio de Janeiro",
//       "state": "RJ",
//       "country": "BRA",
//       "reference": null,
//       "geoCoordinates": []
//     },
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
//     "address": {
//       "addressId": "-4556418741084",
//       "addressType": "residential",
//       "receiverName": "John Doe",
//       "street": "Rua Barão",
//       "number": "2",
//       "complement": null,
//       "neighborhood": "Botafogo",
//       "postalCode": "22231-100",
//       "city": "Rio de Janeiro",
//       "state": "RJ",
//       "country": "BRA",
//       "reference": null,
//       "geoCoordinates": []
//     },
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

## License

MIT © [VTEX](https://www.vtex.com)
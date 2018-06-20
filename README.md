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

### getDeliveryChannel

**import:** const { getDeliveryChannel } = require('@vtex/delivery-packages/delivery-channel')

**params:** deliveryChannelSource (object or string)

**return** deliveryChannel (string)

### isPickup

**import:** const { isPickup } = require('@vtex/delivery-packages/delivery-channel')

**params:** deliveryChannelSource (object or string)

**return** true or false

### isDelivery

**import:** const { isDelivery } = require('@vtex/delivery-packages/delivery-channel')

**params:** deliveryChannelSource (object or string)

**return** true or false

### findChannelById

**import:** const { findChannelById } = require('@vtex/delivery-packages/delivery-channel')

**params:** logisticsInfoItem (object), deliveryChannel (string)

**return** deliveryChannel (string) in logisticsInfoItem or null if doesn't find it

### getNewItems

**import:** const { getNewItems } = require('@vtex/delivery-packages/items')

**params:** items (array of objects), changes (array of objects)

**return** the items received with the changes (itemsAdded and itemsRemoved) passed

### getDeliveredItems

**import:** const { getDeliveredItems } = require('@vtex/delivery-packages/items')

**params:** { items, packages } (items and packages are array of objects)

**return** object with items merged with packages and splitted by delivered and toBeDelivered

### areAvailableDeliveryWindowsEquals

**import:** const { areAvailableDeliveryWindowsEquals } = require('@vtex/delivery-packages/scheduled-delivery')

**params:** availableDeliveryWindows1, availableDeliveryWindows2 (both arrays of deliveryWindow)

**return** true or false

### selectDeliveryWindow

**import:** const { selectDeliveryWindow } = require('@vtex/delivery-packages/scheduled-delivery')

**params:** logisticsInfo (array of objects), { selectedSla, deliveryWindow } (selectedSla and deliveryWindow are strings)

**return** new logisticsInfo selecting deliveryWindow on the selectedSla passed

### getFirstScheduledDelivery

**import:** const { getFirstScheduledDelivery } = require('@vtex/delivery-packages/scheduled-delivery')

**params:** logisticInfo (array of objects), availableDeliveryWindows (array of objects, default: null)

**return** the first scheduled delivery sla with the availableDeliveryWindows passed (or the first scheduled delivery sla that exists if availableDeliveryWindows param is not passed)

### getNewLogisticsInfo

**import:** const { getNewLogisticsInfo } = require('@vtex/delivery-packages/scheduled-delivery')

**params:** logisticsInfo (array of objects), selectedSla (string), availableDeliveryWindows (array of objects, default: null)

**return** new logisticInfo with the selectedSla on all items that it can be selected and optionally only set the selectSla for the slas that match the availableDeliveryWindows passed

### getNewLogisticsInfoWithSelectedScheduled

**import:** const { getNewLogisticsInfoWithSelectedScheduled } = require('@vtex/delivery-packages/scheduled-delivery')

**params:** logisticsInfo (array of objects)

**return** new logisticInfo selecting first sla that has availableDeliveryWindows on each item that can be scheduled delivered

### hasSLAs

**import:** const { hasSLAs } = require('@vtex/delivery-packages/sla')

**params:** slasSource (object with slas key or array of objects)

**return** true or false

### hasDeliveryWindows

**import:** const { hasDeliveryWindows } = require('@vtex/delivery-packages/sla')

**params:** slas (array of objects)

**return** true or false

### getSlaObj

**import:** const { getSlaObj } = require('@vtex/delivery-packages/sla')

**params:** slas (array of objects), slaId (string)

**return** the sla object on the passed array that match the slaId or null if not found

### getSelectedSla

**import:** const { getSelectedSla } = require('@vtex/delivery-packages/sla')

**params:** {logisticsInfo, itemIndex, selectedSla} (logisticInfo is an array of objects, itemIndex is a number and selectedSla is a string)

**return** the selectedSla object on the logisticsInfoItem that itemIndex refer on logisticInfo and optionally using another selectedSla then the one on logisticsInfoItem

## License

MIT © [VTEX](https://www.vtex.com)

import {
  getShippingEstimateQuantityInSeconds,
} from '@vtex/estimate-calculator'

import './polyfills'
import { hasDeliveryWindows, getSlaObj, getSlaType } from './sla'
import { getNewItems, getDeliveredItems } from './items'
import { hydratePackageWithLogisticsExtraInfo } from './shipping'
import {
  areAvailableDeliveryWindowsEquals,
  getScheduledDeliverySLA,
} from './scheduled-delivery'
import { DEFAULT_CRITERIA } from './constants'

/** PRIVATE **/

function groupPackages(items, criteria, order) {
  return addToPackage(items, criteria, order, (packages, item) => {
    return packages.find(pack => pack.package.index === item.package.index)
  })
}

function groupDeliveries(items, criteria, order) {
  return addToPackage(items, criteria, order, (packages, item) => {
    return packages.find(pack => {
      if (criteria.groupBySelectedSlaType) {
        if (pack.selectedSlaType === getSlaType(item, order)) {
          return true
        }

        return false
      }

      if (
        criteria.shippingEstimate &&
        criteria.selectedSla &&
        pack.shippingEstimate !== item.shippingEstimate
      ) {
        return false
      }

      if (criteria.slaOptions) {
        const packSlas = pack.slas.reduce((acc, sla) => acc + sla.id, '')
        const itemSlas = item.slas.reduce((acc, sla) => acc + sla.id, '')

        if (packSlas !== itemSlas) {
          return false
        }
      }

      if (criteria.seller && pack.seller !== item.item.seller) {
        return false
      }

      if (criteria.selectedSla && pack.selectedSla !== item.selectedSla) {
        return false
      }

      const hasDeliveryWindow = pack.deliveryWindow && item.deliveryWindow

      const areWindowsDifferent = hasDeliveryWindow &&
        pack.deliveryWindow.startDateUtc !== item.deliveryWindow.startDateUtc &&
        pack.deliveryWindow.endDateUtc !== item.deliveryWindow.endDateUtc

      if (
        criteria.selectedSla &&
        ((hasDeliveryWindow && areWindowsDifferent) ||
          !!pack.deliveryWindow !== !!item.deliveryWindow)
      ) {
        return false
      }

      if (
        criteria.deliveryChannel &&
        pack.deliveryChannel !== item.deliveryChannel
      ) {
        return false
      }

      const scheduledSla = getSlaObj(item.slas, item.selectedSla) ||
        getScheduledDeliverySLA(item)

      if (
        criteria.groupByAvailableDeliveryWindows &&
        hasDeliveryWindows(item.slas) &&
        (!pack.availableDeliveryWindows ||
          !areAvailableDeliveryWindowsEquals(
            pack.availableDeliveryWindows,
            scheduledSla.availableDeliveryWindows
          ))
      ) {
        return false
      }

      return true
    })
  })
}

function getItemSelectedSlaPrices(item, shouldSumDeliveryWindow = false) {
  if (!item || !item.selectedSlaObj) {
    return {
      listPrice: 0,
      price: 0,
      sellingPrice: 0,
    }
  }

  let prices = {
    listPrice: item.selectedSlaObj.listPrice,
    price: item.selectedSlaObj.price,
    sellingPrice: item.selectedSlaObj.sellingPrice,
  }

  if (item.deliveryWindow && shouldSumDeliveryWindow) {
    prices = {
      listPrice: prices.listPrice + item.deliveryWindow.lisPrice,
      price: prices.price + item.deliveryWindow.price,
      sellingPrice: prices.sellingPrice + item.deliveryWindow.price,
    }
  }

  return prices
}

function addToPackage(items, criteria, order, fn) {
  return items.reduce(
    (packages, item) => {
      const pack = fn(packages, item)

      if (pack) {
        if (
          criteria.selectedSla &&
          pack.shippingEstimateDate < item.shippingEstimateDate
        ) {
          pack.shippingEstimate = item.shippingEstimate
          pack.shippingEstimateDate = item.shippingEstimateDate
        }

        if (!criteria.selectedSla) {
          pack.slas = pack.slas.concat(item.slas)
        }

        pack.items = pack.items.concat(item.item)
        const slaPrices = getItemSelectedSlaPrices(item)
        pack.listPrice += slaPrices.listPrice
        pack.price += slaPrices.price
        pack.sellingPrice += slaPrices.sellingPrice

        return packages
      }

      const selectedSlaObj = getSlaObj(item.slas, item.selectedSla)

      const selectedSlaType = getSlaType(selectedSlaObj, order)

      const scheduledSla = selectedSlaObj || getScheduledDeliverySLA(item)

      const newPackage = {
        ...getItemSelectedSlaPrices(item, true),
        items: [item.item],
        package: item.package,
        slas: item.slas,
        pickupFriendlyName: criteria.selectedSla
          ? item.pickupFriendlyName
          : undefined,
        seller: criteria.seller ? item.item.seller : undefined,
        address: criteria.selectedSla
          ? item.address ||
              (selectedSlaObj &&
                selectedSlaObj.pickupStoreInfo &&
                selectedSlaObj.pickupStoreInfo.address) ||
              undefined
          : undefined,
        selectedSla: criteria.selectedSla ? item.selectedSla : undefined,
        selectedSlaObj,
        selectedSlaType,
        deliveryIds: item.deliveryIds,
        deliveryChannel: criteria.deliveryChannel
          ? item.deliveryChannel
          : undefined,
        hasAvailableDeliveryWindows: criteria.groupByAvailableDeliveryWindows
          ? hasDeliveryWindows(item.slas)
          : undefined,
        availableDeliveryWindows: criteria.groupByAvailableDeliveryWindows &&
          scheduledSla
          ? scheduledSla.availableDeliveryWindows
          : undefined,
        deliveryWindow: criteria.selectedSla ? item.deliveryWindow : undefined,
        shippingEstimate: criteria.selectedSla
          ? item.shippingEstimate
          : undefined,
        shippingEstimateDate: criteria.selectedSla
          ? item.shippingEstimateDate
          : undefined,
        item: undefined,
      }

      return packages.concat(newPackage)
    },
    []
  )
}

/** PUBLIC **/

export function parcelify(order, options = {}) {
  const {
    items = [],
    marketplaceItems = [],
    packageAttachment = {},
    shippingData = {},
    changesAttachment = {},
  } = order

  const criteria = {
    ...DEFAULT_CRITERIA,
    ...(options.criteria ? options.criteria : {}),
  }

  const packages = packageAttachment && packageAttachment.packages
    ? packageAttachment.packages
    : []
  const logisticsInfo = shippingData && shippingData.logisticsInfo
    ? shippingData.logisticsInfo
    : []
  const selectedAddresses = shippingData && shippingData.selectedAddresses
    ? shippingData.selectedAddresses
    : []
  const changes = changesAttachment && changesAttachment.changesData
    ? changesAttachment.changesData
    : []

  const FIXED_ITEM_INDEX = 0
  const useItems = criteria.useMarketplaceItems === false ||
    marketplaceItems.length === 0

  const itemsWithIndex = useItems
    ? items.map((item, index) => ({ ...item, index }))
    : marketplaceItems.map(item => ({
      ...item,
      index: FIXED_ITEM_INDEX,
    }))

  const packagesWithIndex = packages.map((pack, index) => ({ ...pack, index }))

  const itemsCleaned = getNewItems(itemsWithIndex, changes)

  const deliveredItems = getDeliveredItems({
    items: itemsCleaned,
    packages: packagesWithIndex,
  })

  const enhancePackage = pkg =>
    hydratePackageWithLogisticsExtraInfo(pkg, logisticsInfo, selectedAddresses)

  deliveredItems.delivered = deliveredItems.delivered.map(enhancePackage)
  deliveredItems.toBeDelivered = deliveredItems.toBeDelivered.map(
    enhancePackage
  )

  const deliveredPackages = groupPackages(
    deliveredItems.delivered,
    criteria,
    order
  )
  const toBeDeliveredPackages = groupDeliveries(
    deliveredItems.toBeDelivered,
    criteria,
    order
  )

  return deliveredPackages.concat(toBeDeliveredPackages)
}

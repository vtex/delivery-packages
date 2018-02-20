const endsWith = require('lodash/endsWith')
const convertBusinnesDaysToDays = require('./businessDays')

const SHIPPING_ESTIMATE_UNITS = {
  BUSINESS_DAYS: 'bd',
  DAYS: 'd',
  HOURS: 'h',
  MINUTES: 'm',
}

const MIN = 60 // in seconds
const HOUR = 60 * MIN
const DAY = 24 * HOUR

const SHIPPING_ESTIMATE_IN_SECONDS = {
  [SHIPPING_ESTIMATE_UNITS.BUSINESS_DAYS]: DAY,
  [SHIPPING_ESTIMATE_UNITS.DAYS]: DAY,
  [SHIPPING_ESTIMATE_UNITS.HOURS]: HOUR,
  [SHIPPING_ESTIMATE_UNITS.MINUTES]: MIN,
}

module.exports = function getLatestSla(slas) {
  return getGreaterSla(slas, sla =>
    getShippingEstimateQuantityInSeconds(sla.shippingEstimate))
}

function getGreaterSla(slas, greaterComparator) {
  if (!slas || slas.length === 0) {
    return null
  }

  let greaterSla = slas[0]
  let greaterCriteria = greaterComparator(greaterSla)
  slas.forEach(sla => {
    const currentCriteria = greaterComparator(sla)
    if (currentCriteria > greaterCriteria) {
      greaterCriteria = currentCriteria
      greaterSla = sla
    }
  })

  return greaterSla
}

function getShippingEstimateQuantityInSeconds(estimate) {
  const unit = getShippingEstimateUnit(estimate)
  let quantity = getShippingEstimateQuantity(estimate)
  if (unit === 'bd') {
    quantity = convertBusinnesDaysToDays(quantity)
  }
  const multiplierToSeconds = SHIPPING_ESTIMATE_IN_SECONDS[unit]
  const quantityInSeconds = quantity * multiplierToSeconds
  return quantityInSeconds
}

function getShippingEstimateQuantity(estimate) {
  const unit = getShippingEstimateUnit(estimate)
  const quantityText = estimate.replace(unit, '')
  return quantityText ? parseInt(quantityText, 10) : 0
}

function getShippingEstimateUnit(estimate) {
  let estimateUnit = 'bd'
  Object.keys(SHIPPING_ESTIMATE_UNITS).forEach(unitKey => {
    const unit = SHIPPING_ESTIMATE_UNITS[unitKey]
    if (endsWith(estimate, unit)) {
      const quantityText = estimate.replace(unit, '')
      // no letters
      if (parseInt(quantityText, 10).toString() === quantityText) {
        estimateUnit = unit
      }
    }
  })
  return estimateUnit
}

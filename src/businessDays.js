const isNumber = require('lodash/isNumber')

const DAY_IN_MS = 24 * 60 * 60 * 1000

module.exports = function convertBusinnesDaysToDays(businessDays) {
  const start = new Date()
  const end = addAvailableDaysToDate(start, businessDays)
  return diffInDays(end, start)
}

function addAvailableDaysToDate(date, availableDaysToAdd) {
  if (!date || !isNumber(availableDaysToAdd)) {
    return date
  }

  const estimateDate = normalizeHoursOfDay(date) // Copy date ignoring hours

  const dayIndex = estimateDate.getDay() // 0: Sunday -> 6: Saturday

  let remainingDaysToGetToAWorkDay = 0
  if (dayIndex === 0 || dayIndex === 6) {
    remainingDaysToGetToAWorkDay = dayIndex === 0 ? 1 : 2
  }

  const numberOfWeekends = Math.floor(
    (availableDaysToAdd - 1 + (dayIndex % 6 || 1)) / 5
  )

  const numberOfDaysToAdd = availableDaysToAdd +
    remainingDaysToGetToAWorkDay +
    numberOfWeekends * 2

  return addDays(estimateDate, numberOfDaysToAdd)
}

function normalizeHoursOfDay(date) {
  const normalizedDate = new Date(date.getTime())
  normalizedDate.setUTCHours(12, 0, 0, 0)
  return normalizedDate
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_IN_MS)
}

function diffInDays(dateA = new Date(), dateB = new Date()) {
  return Math.round(diffInMiliseconds(dateA, dateB) / DAY_IN_MS)
}

function diffInMiliseconds(dateA = new Date(), dateB = new Date()) {
  return dateA - dateB
}

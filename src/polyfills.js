if (!Array.prototype.findIndex) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError(
        'Array.prototype.findIndex called on null or undefined'
      )
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return i
      }
    }
    return -1
  }
}

if (!Array.prototype.find) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var i = list.findIndex(predicate)
    return list[i]
  }
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

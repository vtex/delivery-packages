const objectProto = Object.prototype

function isPrototype(value) {
  const Ctor = value && value.constructor
  const proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto

  return value === proto
}

export const isEmpty = elm => {
  if (typeof elm === 'number') {
    return false
  }

  if (!elm) {
    return true
  }

  if (Array.isArray(elm) && elm.length === 0) {
    return true
  }

  if (typeof elm === 'object' || isPrototype(elm)) {
    return !Object.keys(elm).length
  }

  return false
}

export const removeEmpty = arr => {
  if (isEmpty(arr)) {
    return []
  }

  return arr.filter(elm => !isEmpty(elm))
}

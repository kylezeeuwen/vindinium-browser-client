(function () {
  'use strict'

  let utils = window.utils = {}

  utils.each = function (obj, iterator) {
    let i = 0
    let key
    const keys = Object.keys(obj)
    const len = keys.length
    for (i; i < len; ++i) {
      key = keys[i]
      iterator(obj[key], key)
    }
  }
}())

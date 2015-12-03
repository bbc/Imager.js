'use strict';

export function returnFn (value) {
  return value;
}

export function noop () {
}

export function trueFn () {
  return true;
}

export function debounce (fn, wait) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      fn.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

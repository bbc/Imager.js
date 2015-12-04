'use strict';

export function applyEach (collection, callbackEach) {
  let i = 0;
  let length = collection.length;
  const new_collection = [];

  for (; i < length; i++) {
    new_collection[i] = callbackEach(collection[i], i);
  }

  return new_collection;
}

'use strict';

/**
 * Returns the closest upper value.
 *
 * ```js
 * var candidates = [1, 1.5, 2];
 *
 * getClosestValue(0.8, candidates); // -> 1
 * getClosestValue(1, candidates); // -> 1
 * getClosestValue(1.3, candidates); // -> 1.5
 * getClosestValue(3, candidates); // -> 2
 * ```
 *
 * @api
 * @since 1.0.1
 * @param {Number} baseValue
 * @param {Array.<Number>} candidates
 * @returns {Number}
 */
export function getClosestValue (baseValue, candidates) {
  let i = candidates.length;
  let selectedWidth = candidates[i - 1];

  baseValue = parseFloat(baseValue);

  while (i--) {
    if (baseValue <= candidates[i]) {
      selectedWidth = candidates[i];
    }
  }

  return selectedWidth;
}

export function createWidthsMap (widths, interpolator, pixelRatio) {
  const map = {};
  let i = widths.length;

  while (i--) {
    map[widths[i]] = interpolator(widths[i], pixelRatio);
  }

  return map;
}

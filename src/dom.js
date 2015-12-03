'use strict';

/**
 * Returns the naturalWidth of an image element.
 *
 * @since 1.3.1
 * @param {HTMLImageElement} image
 * @return {Number} Image width in pixels
 */
export const getNaturalWidth = (function () {
  if ('naturalWidth' in (new Image())) {
    return function (image) {
      return image.naturalWidth;
    };
  }
  // non-HTML5 browsers workaround
  return function (image) {
    var imageCopy = document.createElement('img');
    imageCopy.src = image.src;
    return imageCopy.width;
  };
})();

export function getPixelRatio (context) {
  return (context || window)['devicePixelRatio'] || 1;
}

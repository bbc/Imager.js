import { toArray } from './utils';

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
  return (context || window).devicePixelRatio || 1;
}

export function getPlaceholderElement (options) {
  const { className } = options;

  const placeholder = document.createElement('img');
  placeholder.src = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
  placeholder.className = className;
  placeholder.alt = '';

  // Needed as IE8 adds a default `width`/`height` attribute…
  // if (process.env.BROWSER_COMPATIBILITY.indexOf('ie8') !== -1) {
  placeholder.removeAttribute('height');
  placeholder.removeAttribute('width');
  // }

  return placeholder;
}

export function createPlaceholder (element, options) {
  const { className, placeholderElement } = options;

  // if the element is already a responsive image then we don't replace it again
  if (element.className.match(new RegExp('(^| )' + options.className + '( |$)'))) {
    return element;
  }

  const elementClassName = element.getAttribute('data-class');
  const elementWidth = element.getAttribute('data-width');
  const placeholder = placeholderElement.cloneNode(false);

  if (elementWidth) {
    placeholder.width = elementWidth;
    placeholder.setAttribute('data-width', elementWidth);
  }

  placeholder.className = (elementClassName ? elementClassName + ' ' : '') + className;
  placeholder.setAttribute('data-src', element.getAttribute('data-src'));
  placeholder.setAttribute('alt', element.getAttribute('data-alt') || placeholderElement.alt);

  element.parentNode.replaceChild(placeholder, element);

  return placeholder;
}

export function convertToPlaceholderImages (imgr, elements) {
  const placeholderOptions = {
    className: imgr.className,
    placeholderElement: imgr.gif
  };

  elements = toArray(elements).map(element => {
    return createPlaceholder(element, placeholderOptions);
  });

  if (imgr.initialized) {
    imgr.checkImagesNeedReplacing(elements);
  }

  return elements;
}

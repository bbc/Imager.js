'use strict';

import { applyEach } from './src/shims';
import { getClosestValue, createWidthsMap } from './src/calc';
import { getNaturalWidth, getPixelRatio } from './src/dom';
import { returnFn, noop, trueFn, debounce } from './src/utils';

import * as lazyloadPlugin from './src/plugins/lazyload';
import * as transforms from './src/transforms';

const doc = document;
const DEFAULT_WIDTHS = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];

/*
 Construct a new Imager instance, passing an optional configuration object.

 Example usage:

 {
 // Available widths for your images
 availableWidths: [Number],

 // Selector to be used to locate your div placeholders
 selector: '',

 // Class name to give your resizable images
 className: '',

 // If set to true, Imager will update the src attribute of the relevant images
 onResize: Boolean,

 // Toggle the lazy load functionality on or off
 lazyload: Boolean,

 // Used alongside the lazyload feature (helps performance by setting a higher delay)
 scrollDelay: Number
 }

 @param {object} configuration settings
 @return {object} instance of Imager
 */

export default class Imager {
  constructor (elements, opts = {}) {
    if (elements === undefined) {
      throw new Error('Imager.js now expects the first argument to be either a CSS string selector or a collection of HTMLElement.')
    }

    // selector string (not elements)
    if (typeof elements === 'string') {
      opts.selector = elements;
      elements = undefined;
    }

    // 'opts' object (not elements)
    else if (typeof elements.length === 'undefined') {
      opts = elements;
      elements = undefined;
    }

    this.availableWidths = opts.availableWidths || DEFAULT_WIDTHS;
    this.selector = !elements ? (opts.selector || '.delayed-image-load') : null;
    this.className = opts.className || 'image-replace';
    this.onResize = opts.hasOwnProperty('onResize') ? opts.onResize : true;
    this.availablePixelRatios = opts.availablePixelRatios || [1, 2];
    this.onImagesReplaced = opts.onImagesReplaced || noop;
    this.widthInterpolator = opts.widthInterpolator || returnFn;

    // lazyload options (deprecated)
    this.lazyload = opts.hasOwnProperty('lazyload') ? opts.lazyload : false;
    this.lazyloadOffset = opts.lazyloadOffset || 0;
    this.scrollDelay = opts.scrollDelay || 250;

    // gif configuration
    this.gif = doc.createElement('img');
    this.gif.src = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
    this.gif.className = this.className;
    this.gif.alt = '';

    // non-configurable options
    this.initialized = false;
    this.divs = [];
    this.viewportHeight = doc.documentElement.clientHeight;
    this.widthsMap = {};

    this.refreshPixelRatio();

    // Needed as IE8 adds a default `width`/`height` attribute…
    this.gif.removeAttribute('height');
    this.gif.removeAttribute('width');

    if (typeof this.availableWidths !== 'function') {
      if (typeof this.availableWidths.length === 'number') {
        this.widthsMap = createWidthsMap(this.availableWidths, this.widthInterpolator, this.devicePixelRatio);
      }
      else {
        this.widthsMap = this.availableWidths;
        this.availableWidths = Object.keys(this.availableWidths);
      }

      this.availableWidths = this.availableWidths.sort(function (a, b) {
        return a - b;
      });
    }

    this.add(elements || this.selector);
    this.ready(opts.onReady);

    setTimeout(() => this.init(), 0);
  }

  init () {
    this.initialized = true;
    var filterFn = trueFn;

    if (this.lazyload) {
      lazyloadPlugin.register(this)();


      filterFn = (element) => this.isPlaceholder(element) === false;
    }
    else {
      this.checkImagesNeedReplacing(this.divs);
    }

    if (this.onResize) {
      this.registerResizeEvent(filterFn);
    }

    this.onReady();
  }

  /**
   * Executes a function when Imager is ready to work
   * It acts as a convenient/shortcut for `new Imager({ onReady: fn })`
   *
   * @since 0.3.1
   * @param {Function} fn
   */
  ready (fn) {
    this.onReady = fn || noop;
  }

  add (elementsOrSelector) {
    elementsOrSelector = elementsOrSelector || this.selector;

    const elements = typeof elementsOrSelector === 'string' ?
      document.querySelectorAll(elementsOrSelector) : // Selector
      elementsOrSelector; // Elements (NodeList or array of Nodes)

    if (elements && elements.length) {
      const additional = applyEach(elements, returnFn);
      this.changeDivsToEmptyImages(additional);
      this.divs = this.divs.concat(additional);
    }
  }

  createGif (element) {
    // if the element is already a responsive image then we don't replace it again
    if (element.className.match(new RegExp('(^| )' + this.className + '( |$)'))) {
      return element;
    }

    var elementClassName = element.getAttribute('data-class');
    var elementWidth = element.getAttribute('data-width');
    var gif = this.gif.cloneNode(false);

    if (elementWidth) {
      gif.width = elementWidth;
      gif.setAttribute('data-width', elementWidth);
    }

    gif.className = (elementClassName ? elementClassName + ' ' : '') + this.className;
    gif.setAttribute('data-src', element.getAttribute('data-src'));
    gif.setAttribute('alt', element.getAttribute('data-alt') || this.gif.alt);

    element.parentNode.replaceChild(gif, element);

    return gif;
  }

  changeDivsToEmptyImages (elements) {
    applyEach(elements, (element, i) => {
      elements[i] = this.createGif(element);
    });

    if (this.initialized) {
      this.checkImagesNeedReplacing(elements);
    }
  }

  /**
   * Indicates if an element is an Imager placeholder
   *
   * @since 1.3.1
   * @param {HTMLImageElement} element
   * @returns {boolean}
   */
  isPlaceholder (element) {
    return element.src === this.gif.src;
  }

  checkImagesNeedReplacing (images, filterFn) {
    filterFn = filterFn || trueFn;

    if (!this.isResizing) {
      this.isResizing = true;
      this.refreshPixelRatio();

      applyEach(images, image => {
        if (filterFn(image)) {
          this.replaceImagesBasedOnScreenDimensions(image);
        }
      });

      this.isResizing = false;
      this.onImagesReplaced(images);
    }
  }

  /**
   * Upgrades an image from an empty placeholder to a fully sourced image element
   *
   * @param {HTMLImageElement} image
   */
  replaceImagesBasedOnScreenDimensions (image) {
    var computedWidth, naturalWidth;

    naturalWidth = getNaturalWidth(image);
    computedWidth = typeof this.availableWidths === 'function' ? this.availableWidths(image)
      : this.determineAppropriateResolution(image);

    image.width = computedWidth;

    if (!this.isPlaceholder(image) && computedWidth <= naturalWidth) {
      return;
    }

    image.src = this.changeImageSrcToUseNewImageDimensions(image.getAttribute('data-src'), computedWidth);
    image.removeAttribute('width');
    image.removeAttribute('height');

    return image;
  }

  determineAppropriateResolution (image) {
    return getClosestValue(image.getAttribute('data-width') || image.parentNode.clientWidth, this.availableWidths);
  }

  /**
   * Updates the device pixel ratio value used by Imager
   *
   * It is performed before each replacement loop, in case a user zoomed in/out
   * and thus updated the `window.devicePixelRatio` value.
   *
   * @api
   * @since 1.0.1
   */
  refreshPixelRatio () {
    this.devicePixelRatio = getClosestValue(getPixelRatio(), this.availablePixelRatios);
  }

  changeImageSrcToUseNewImageDimensions (src, selectedWidth) {
    return src
      .replace(/\{width\}/g, transforms.width(selectedWidth, this.widthsMap))
      .replace(/\{pixel_ratio\}/g, transforms.pixelRatio(this.devicePixelRatio));
  }


  registerResizeEvent (filterFn) {
    window.addEventListener('resize', debounce(() => this.checkImagesNeedReplacing(this.divs, filterFn), 100));
  }
}

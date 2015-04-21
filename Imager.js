(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.imager = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./src/utils.js');

var _transforms = require('./src/transforms.js');

var transforms = _interopRequireWildcard(_transforms);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var doc = document;
var defaultWidths = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];

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

var Imager = (function () {
  function Imager(elements) {
    var _this = this;

    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Imager);

    if (elements === undefined) {
      throw new Error('Imager.js now expects the first argument to be either a CSS string selector or a collection of HTMLElement.');
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

    this.viewportHeight = doc.documentElement.clientHeight;
    this.selector = !elements ? opts.selector || '.delayed-image-load' : null;
    this.className = opts.className || 'image-replace';
    this.gif = doc.createElement('img');
    this.gif.src = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
    this.gif.className = this.className;
    this.gif.alt = '';
    this.lazyloadOffset = opts.lazyloadOffset || 0;
    this.scrollDelay = opts.scrollDelay || 250;
    this.onResize = opts.hasOwnProperty('onResize') ? opts.onResize : true;
    this.lazyload = opts.hasOwnProperty('lazyload') ? opts.lazyload : false;
    this.scrolled = false;
    this.availablePixelRatios = opts.availablePixelRatios || [1, 2];
    this.availableWidths = opts.availableWidths || defaultWidths;
    this.onImagesReplaced = opts.onImagesReplaced || _utils.noop;
    this.widthsMap = {};
    this.refreshPixelRatio();
    this.widthInterpolator = opts.widthInterpolator || _utils.returnFn;

    // Needed as IE8 adds a default `width`/`height` attribute…
    this.gif.removeAttribute('height');
    this.gif.removeAttribute('width');

    if (typeof this.availableWidths !== 'function') {
      if (typeof this.availableWidths.length === 'number') {
        this.widthsMap = Imager.createWidthsMap(this.availableWidths, this.widthInterpolator, this.devicePixelRatio);
      } else {
        this.widthsMap = this.availableWidths;
        this.availableWidths = Object.keys(this.availableWidths);
      }

      this.availableWidths = this.availableWidths.sort(function (a, b) {
        return a - b;
      });
    }

    this.divs = [];
    this.add(elements || this.selector);
    this.ready(opts.onReady);

    setTimeout(function () {
      return _this.init();
    }, 0);
  }

  _createClass(Imager, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.initialized = true;
      var filterFn = _utils.trueFn;

      if (this.lazyload) {
        this.registerScrollEvent();

        this.scrolled = true;
        this.scrollCheck();

        filterFn = function (element) {
          return _this2.isPlaceholder(element) === false;
        };
      } else {
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

  }, {
    key: 'ready',
    value: function ready(fn) {
      this.onReady = fn || _utils.noop;
    }
  }, {
    key: 'add',
    value: function add(elementsOrSelector) {

      elementsOrSelector = elementsOrSelector || this.selector;
      var elements = typeof elementsOrSelector === 'string' ? document.querySelectorAll(elementsOrSelector) : // Selector
      elementsOrSelector; // Elements (NodeList or array of Nodes)

      if (elements && elements.length) {
        var additional = elements.map(_utils.returnFn);
        this.changeDivsToEmptyImages(additional);
        this.divs = this.divs.concat(additional);
      }
    }
  }, {
    key: 'scrollCheck',
    value: function scrollCheck() {
      var _this3 = this;

      var offscreenImageCount = 0;
      var elements = [];

      if (this.scrolled) {
        // collects a subset of not-yet-responsive images and not offscreen anymore
        this.divs.forEach(function (element) {
          if (_this3.isPlaceholder(element)) {
            ++offscreenImageCount;

            if (_this3.isThisElementOnScreen(element)) {
              elements.push(element);
            }
          }
        });

        if (offscreenImageCount === 0) {
          window.clearInterval(this.interval);
        }

        this.changeDivsToEmptyImages(elements);
        this.scrolled = false;
      }
    }
  }, {
    key: 'createGif',
    value: function createGif(element) {
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
  }, {
    key: 'changeDivsToEmptyImages',
    value: function changeDivsToEmptyImages(elements) {
      var _this4 = this;

      elements.forEach(function (element, i) {
        elements[i] = _this4.createGif(element);
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

  }, {
    key: 'isPlaceholder',
    value: function isPlaceholder(element) {
      return element.src === this.gif.src;
    }

    /**
     * Returns true if an element is located within a screen offset.
     *
     * @param {HTMLElement} element
     * @returns {boolean}
     */

  }, {
    key: 'isThisElementOnScreen',
    value: function isThisElementOnScreen(element) {
      // document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
      // but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
      var elementOffsetTop = 0;
      var offset = Imager.getPageOffset() + this.lazyloadOffset;

      if (element.offsetParent) {
        do {
          elementOffsetTop += element.offsetTop;
        } while (element = element.offsetParent);
      }

      return elementOffsetTop < this.viewportHeight + offset;
    }
  }, {
    key: 'checkImagesNeedReplacing',
    value: function checkImagesNeedReplacing(images, filterFn) {
      var _this5 = this;

      filterFn = filterFn || _utils.trueFn;

      if (!this.isResizing) {
        this.isResizing = true;
        this.refreshPixelRatio();

        images.forEach(function (image) {
          if (filterFn(image)) {
            _this5.replaceImagesBasedOnScreenDimensions(image);
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

  }, {
    key: 'replaceImagesBasedOnScreenDimensions',
    value: function replaceImagesBasedOnScreenDimensions(image) {
      var computedWidth, naturalWidth;

      naturalWidth = Imager.getNaturalWidth(image);
      computedWidth = typeof this.availableWidths === 'function' ? this.availableWidths(image) : this.determineAppropriateResolution(image);

      image.width = computedWidth;

      if (!this.isPlaceholder(image) && computedWidth <= naturalWidth) {
        return;
      }

      image.src = this.changeImageSrcToUseNewImageDimensions(image.getAttribute('data-src'), computedWidth);
      image.removeAttribute('width');
      image.removeAttribute('height');
    }
  }, {
    key: 'determineAppropriateResolution',
    value: function determineAppropriateResolution(image) {
      return Imager.getClosestValue(image.getAttribute('data-width') || image.parentNode.clientWidth, this.availableWidths);
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

  }, {
    key: 'refreshPixelRatio',
    value: function refreshPixelRatio() {
      this.devicePixelRatio = Imager.getClosestValue(Imager.getPixelRatio(), this.availablePixelRatios);
    }
  }, {
    key: 'changeImageSrcToUseNewImageDimensions',
    value: function changeImageSrcToUseNewImageDimensions(src, selectedWidth) {
      return src.replace(/{width}/g, transforms.width(selectedWidth, this.widthsMap)).replace(/{pixel_ratio}/g, transforms.pixelRatio(this.devicePixelRatio));
    }
  }, {
    key: 'registerResizeEvent',
    value: function registerResizeEvent(filterFn) {
      var _this6 = this;

      window.addEventListener('resize', (0, _utils.debounce)(function () {
        return _this6.checkImagesNeedReplacing(_this6.divs, filterFn);
      }, 100));
    }
  }, {
    key: 'registerScrollEvent',
    value: function registerScrollEvent() {
      var _this7 = this;

      this.scrolled = false;

      this.interval = window.setInterval(function () {
        return _this7.scrollCheck();
      }, this.scrollDelay);

      window.addEventListener('scroll', function () {
        _this7.scrolled = true;
      });

      window.addEventListener('resize', function () {
        _this7.viewportHeight = document.documentElement.clientHeight;
        _this7.scrolled = true;
      });
    }
  }], [{
    key: 'getPixelRatio',
    value: function getPixelRatio(context) {
      return (context || window)['devicePixelRatio'] || 1;
    }
  }, {
    key: 'createWidthsMap',
    value: function createWidthsMap(widths, interpolator, pixelRatio) {
      var map = {},
          i = widths.length;

      while (i--) {
        map[widths[i]] = interpolator(widths[i], pixelRatio);
      }

      return map;
    }
  }, {
    key: 'getClosestValue',

    /**
     * Returns the closest upper value.
     *
     * ```js
     * var candidates = [1, 1.5, 2];
     *
     * Imager.getClosestValue(0.8, candidates); // -> 1
     * Imager.getClosestValue(1, candidates); // -> 1
     * Imager.getClosestValue(1.3, candidates); // -> 1.5
     * Imager.getClosestValue(3, candidates); // -> 2
     * ```
     *
     * @api
     * @since 1.0.1
     * @param {Number} baseValue
     * @param {Array.<Number>} candidates
     * @returns {Number}
     */
    value: function getClosestValue(baseValue, candidates) {
      var i = candidates.length,
          selectedWidth = candidates[i - 1];

      baseValue = parseFloat(baseValue);

      while (i--) {
        if (baseValue <= candidates[i]) {
          selectedWidth = candidates[i];
        }
      }

      return selectedWidth;
    }
  }, {
    key: 'getPageOffsetGenerator',
    value: function getPageOffsetGenerator(testCase) {
      if (testCase) {
        return function () {
          return window.pageYOffset;
        };
      } else {
        return function () {
          return document.documentElement.scrollTop;
        };
      }
    }
  }]);

  return Imager;
})();

/**
 * Returns the naturalWidth of an image element.
 *
 * @since 1.3.1
 * @param {HTMLImageElement} image
 * @return {Number} Image width in pixels
 */

exports.default = Imager;
Imager.getNaturalWidth = (function () {
  if ('naturalWidth' in new Image()) {
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

// This form is used because it seems impossible to stub `window.pageYOffset`
Imager.getPageOffset = Imager.getPageOffsetGenerator(Object.prototype.hasOwnProperty.call(window, 'pageYOffset'));

},{"./src/transforms.js":2,"./src/utils.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pixelRatio = pixelRatio;
exports.width = width;
function pixelRatio(value) {
    return value === 1 ? '' : '-' + value + 'x';
}

function width(width, map) {
    return map[width] || width;
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
				value: true
});
exports.returnFn = returnFn;
exports.noop = noop;
exports.trueFn = trueFn;
exports.debounce = debounce;
function returnFn(value) {
				return value;
}

function noop() {}

function trueFn() {
				return true;
}

function debounce(fn, wait) {
				var timeout;
				return function () {
								var context = this,
								    args = arguments;
								var later = function later() {
												timeout = null;
												fn.apply(context, args);
								};
								clearTimeout(timeout);
								timeout = setTimeout(later, wait);
				};
}

},{}]},{},[1])(1)
});
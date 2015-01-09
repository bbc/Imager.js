;(function (window, document) {
    'use strict';

    var addEvent = (function () {
        if (document.addEventListener) {
            return function addStandardEventListener(el, eventName, fn) {
                return el.addEventListener(eventName, fn, false);
            };
        }
        else {
            return function addIEEventListener(el, eventName, fn) {
                return el.attachEvent('on' + eventName, fn);
            };
        }
    })();

    var defaultWidths = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];

    var getKeys = typeof Object.keys === 'function' ? Object.keys : function (object) {
        var keys = [],
            key;

        for (key in object) {
            keys.push(key);
        }

        return keys;
    };

    var applyEach = function (collection, callbackEach) {
        var i = 0,
            length = collection.length,
            new_collection = [];

        for (; i < length; i++) {
            new_collection[i] = callbackEach(collection[i], i);
        }

        return new_collection;
    };

    var returnFn = function (value) { return value; };
    var noop = function () {};
    var trueFn = function () { return true; };

    var debounce = function (fn, wait) {
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
    };


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
    var Imager = function (elements, opts) {
        var self = this;
        var doc  = document;

        opts = opts || {};

        if (elements !== undefined) {

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
        }

        this.viewportHeight   = doc.documentElement.clientHeight;
        this.selector         = !elements ? (opts.selector || '.delayed-image-load') : null;
        this.className        = opts.className || 'image-replace';
        this.gif              = doc.createElement('img');
        this.gif.src          = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
        this.gif.className    = this.className;
        this.gif.alt          = '';
        this.lazyloadOffset   = opts.lazyloadOffset || 0;
        this.scrollDelay      = opts.scrollDelay || 250;
        this.onResize         = opts.hasOwnProperty('onResize') ? opts.onResize : true;
        this.lazyload         = opts.hasOwnProperty('lazyload') ? opts.lazyload : false;
        this.scrolled         = false;
        this.availablePixelRatios = opts.availablePixelRatios || [1, 2];
        this.availableWidths  = opts.availableWidths || defaultWidths;
        this.onImagesReplaced = opts.onImagesReplaced || noop;
        this.widthsMap        = {};
        this.refreshPixelRatio();
        this.widthInterpolator = opts.widthInterpolator || returnFn;

        // Needed as IE8 adds a default `width`/`height` attribute…
        this.gif.removeAttribute('height');
        this.gif.removeAttribute('width');

        if (typeof this.availableWidths !== 'function') {
          if (typeof this.availableWidths.length === 'number') {
            this.widthsMap = Imager.createWidthsMap(this.availableWidths, this.widthInterpolator, this.devicePixelRatio);
          }
          else {
            this.widthsMap = this.availableWidths;
            this.availableWidths = getKeys(this.availableWidths);
          }

          this.availableWidths = this.availableWidths.sort(function (a, b) {
            return a - b;
          });
        }

        this.divs = [];
        this.add(elements || this.selector);
        this.ready(opts.onReady);

        setTimeout(function () {
            self.init();
        }, 0);
    };

    Imager.prototype.add = function (elementsOrSelector) {

        elementsOrSelector = elementsOrSelector || this.selector;
        var elements = typeof elementsOrSelector === 'string' ?
            document.querySelectorAll(elementsOrSelector) : // Selector
            elementsOrSelector; // Elements (NodeList or array of Nodes)

        if (elements && elements.length) {
            var additional = applyEach(elements, returnFn);
            this.changeDivsToEmptyImages(additional);
            this.divs = this.divs.concat(additional);
        }
    };

    Imager.prototype.scrollCheck = function () {
        var self = this;
        var offscreenImageCount = 0;
        var elements = [];

        if (this.scrolled) {
            // collects a subset of not-yet-responsive images and not offscreen anymore
            applyEach(this.divs, function (element) {
                if (self.isPlaceholder(element)) {
                    ++offscreenImageCount;

                    if (self.isThisElementOnScreen(element)) {
                        elements.push(element);
                    }
                }
            });

            if (offscreenImageCount === 0) {
                window.clearInterval(self.interval);
            }

            this.changeDivsToEmptyImages(elements);
            this.scrolled = false;
        }
    };

    Imager.prototype.init = function () {
        var self = this;

        this.initialized = true;
        var filterFn = trueFn;

        if (this.lazyload) {
            this.registerScrollEvent();

            this.scrolled = true;
            self.scrollCheck();

            filterFn = function (element) {
                return self.isPlaceholder(element) === false;
            };
        }
        else {
            this.checkImagesNeedReplacing(this.divs);
        }

        if (this.onResize) {
            this.registerResizeEvent(filterFn);
        }

        this.onReady();
    };

    /**
     * Executes a function when Imager is ready to work
     * It acts as a convenient/shortcut for `new Imager({ onReady: fn })`
     *
     * @since 0.3.1
     * @param {Function} fn
     */
    Imager.prototype.ready = function (fn) {
        this.onReady = fn || noop;
    };

    Imager.prototype.createGif = function (element) {
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
    };

    Imager.prototype.changeDivsToEmptyImages = function (elements) {
        var self = this;

        applyEach(elements, function (element, i) {
            elements[i] = self.createGif(element);
        });

        if (this.initialized) {
            this.checkImagesNeedReplacing(elements);
        }
    };

    /**
     * Indicates if an element is an Imager placeholder
     *
     * @since 1.3.1
     * @param {HTMLImageElement} element
     * @returns {boolean}
     */
    Imager.prototype.isPlaceholder = function (element) {
        return element.src === this.gif.src;
    };

    /**
     * Returns true if an element is located within a screen offset.
     *
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    Imager.prototype.isThisElementOnScreen = function (element) {
        // document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
        // but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
        var elementOffsetTop = 0;
        var offset = Imager.getPageOffset() + this.lazyloadOffset;

        if (element.offsetParent) {
            do {
                elementOffsetTop += element.offsetTop;
            }
            while (element = element.offsetParent);
        }

        return elementOffsetTop < (this.viewportHeight + offset);
    };

    Imager.prototype.checkImagesNeedReplacing = function (images, filterFn) {
        var self = this;
        filterFn = filterFn || trueFn;

        if (!this.isResizing) {
            this.isResizing = true;
            this.refreshPixelRatio();

            applyEach(images, function (image) {
                if (filterFn(image)) {
                    self.replaceImagesBasedOnScreenDimensions(image);
                }
            });

            this.isResizing = false;
            this.onImagesReplaced(images);
        }
    };

    /**
     * Upgrades an image from an empty placeholder to a fully sourced image element
     *
     * @param {HTMLImageElement} image
     */
    Imager.prototype.replaceImagesBasedOnScreenDimensions = function (image) {
        var computedWidth, naturalWidth;

	naturalWidth = Imager.getNaturalWidth(image);
        computedWidth = typeof this.availableWidths === 'function' ? this.availableWidths(image)
                                                                   : this.determineAppropriateResolution(image);

        image.width = computedWidth;

        if (!this.isPlaceholder(image) && computedWidth <= naturalWidth) {
            return;
        }

        image.src = this.changeImageSrcToUseNewImageDimensions(image.getAttribute('data-src'), computedWidth);
        image.removeAttribute('width');
        image.removeAttribute('height');
    };

    Imager.prototype.determineAppropriateResolution = function (image) {
      return Imager.getClosestValue(image.getAttribute('data-width') || image.parentNode.clientWidth, this.availableWidths);
    };

    /**
     * Updates the device pixel ratio value used by Imager
     *
     * It is performed before each replacement loop, in case a user zoomed in/out
     * and thus updated the `window.devicePixelRatio` value.
     *
     * @api
     * @since 1.0.1
     */
    Imager.prototype.refreshPixelRatio = function refreshPixelRatio() {
        this.devicePixelRatio = Imager.getClosestValue(Imager.getPixelRatio(), this.availablePixelRatios);
    };

    Imager.prototype.changeImageSrcToUseNewImageDimensions = function (src, selectedWidth) {
        return src
            .replace(/{width}/g, Imager.transforms.width(selectedWidth, this.widthsMap))
            .replace(/{pixel_ratio}/g, Imager.transforms.pixelRatio(this.devicePixelRatio));
    };

    Imager.getPixelRatio = function getPixelRatio(context) {
        return (context || window)['devicePixelRatio'] || 1;
    };

    Imager.createWidthsMap = function createWidthsMap (widths, interpolator, pixelRatio) {
        var map = {},
            i   = widths.length;

        while (i--) {
            map[widths[i]] = interpolator(widths[i], pixelRatio);
        }

        return map;
    };

    Imager.transforms = {
        pixelRatio: function (value) {
            return value === 1 ? '' : '-' + value + 'x';
        },
        width: function (width, map) {
            return map[width] || width;
        }
    };

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
    Imager.getClosestValue = function getClosestValue(baseValue, candidates) {
        var i             = candidates.length,
            selectedWidth = candidates[i - 1];

        baseValue = parseFloat(baseValue);

        while (i--) {
            if (baseValue <= candidates[i]) {
                selectedWidth = candidates[i];
            }
        }

        return selectedWidth;
    };

    Imager.prototype.registerResizeEvent = function (filterFn) {
        var self = this;

        addEvent(window, 'resize', debounce(function () {
            self.checkImagesNeedReplacing(self.divs, filterFn);
        }, 100));
    };

    Imager.prototype.registerScrollEvent = function () {
        var self = this;

        this.scrolled = false;

        this.interval = window.setInterval(function () {
            self.scrollCheck();
        }, self.scrollDelay);

        addEvent(window, 'scroll', function () {
            self.scrolled = true;
        });

        addEvent(window, 'resize', function () {
            self.viewportHeight = document.documentElement.clientHeight;
            self.scrolled = true;
        });
    };

    Imager.getPageOffsetGenerator = function getPageVerticalOffset(testCase) {
        if (testCase) {
            return function () { return window.pageYOffset; };
        }
        else {
            return function () { return document.documentElement.scrollTop; };
        }
    };

    /**
     * Returns the naturalWidth of an image element.
     *
     * @since 1.3.1
     * @param {HTMLImageElement} image
     * @return {Number} Image width in pixels
     */
    Imager.getNaturalWidth = (function () {
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

    // This form is used because it seems impossible to stub `window.pageYOffset`
    Imager.getPageOffset = Imager.getPageOffsetGenerator(Object.prototype.hasOwnProperty.call(window, 'pageYOffset'));

    // Exporting for testing and convenience purpose
    Imager.applyEach = applyEach;
    Imager.addEvent = addEvent;
    Imager.debounce = debounce;

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = Imager;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define(function () { return Imager; });
    } else if (typeof window === 'object') {
        // If no AMD and we are in the browser, attach to window
        window.Imager = Imager;
    }
    /* global -module, -exports, -define */

}(window, document));

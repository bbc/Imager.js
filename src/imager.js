'use strict';

// jshint -W030: true

var ImagerOptions, ImagerStrategyOptions;

/**
 * @typedef {{
 *   nodes: Array.<HTMLElement>|NodeList,
 *   availableWidths: Array.<Number>=,
 *   placeholder: ImagerStrategyOptions=,
 *   replacementDelay: Integer=,
 *   strategy: Function|Object|String=
 * }}
 */
ImagerOptions;

/**
 * @typedef {{
 *   matchingClassName: String=,
 *   element: HTMLElement=,
 *   src: String=
 * }}
 */
ImagerStrategyOptions;


// jshint -W030: false

/**
 *
 * @param {NodeList|Array.<HTMLElement>} collection
 * @param {ImagerOptions} options
 * @constructor
 */
function Imager (collection, options) {
    var Strategy;

    options = options || {};

    this.update(collection);
    options.strategy = options.strategy || Imager.DEFAULT_STRATEGY;
    this.replacementDelay = Number(options.replacementDelay || 200);
    this.availableWidths = options.availableWidths || [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];
    this.availableWidths = this.availableWidths.sort(function (a, b) {
        return b - a;
    });

    this._processing = false;

    Strategy = typeof options.strategy === 'string' ? Imager.strategies[options.strategy] : options.strategy;

    this.strategy = new Strategy(options.placeholder);
}

/**
 * Processes any element from the collection, updates the size or eventually transform it as image
 *
 * @api
 */
Imager.prototype.process = function processCollection (callback) {
    var i = this.nodes.length,
        self = this,
        strategy = self.strategy;

    if (self._processing) {
        return;
    }

    self._processing = true;

    while (i--) {
        if (strategy.requiresPlaceholder(self.nodes[i])) {
            self.nodes[i] = strategy.createPlaceholder(self.nodes[i]);
        }
    }

    this.nextTick(function () {
        self.updateImagesSource();
        self._processing = false;
        if (typeof callback === 'function') {
            callback.call(self);
        }
    });
};

/**
 * Replaces the collection of elements we iterate on.
 *
 * @api
 * @param {NodeList|Array} collection
 */
Imager.prototype.update = function updateNodes (collection) {
    this.nodes = Array.prototype.slice.call(collection || []);
};

/**
 * Updates the responsive image source with a better URI
 */
Imager.prototype.updateImagesSource = function updateImagesSource () {
    var i = this.nodes.length,
        self = this,
        strategy = self.strategy;

    while (i--) {
        strategy.updatePlaceholderUri(this.nodes[i], Imager.replaceUri(this.nodes[i].getAttribute('data-src'), {
            'width': self.getBestWidth(this.nodes[i].clientWidth, this.nodes[i].getAttribute('data-width'))
        }));
    }
};

/**
 * Returns the best available width to fit an image in.
 *
 * @param {Integer} image_width
 * @returns {Integer}
 */
Imager.prototype.getBestWidth = function getBestWidth (image_width, default_width) {
    var width = default_width || this.availableWidths[0],
        i = this.availableWidths.length;

    while (i--) {
        if (image_width <= this.availableWidths[i]) {
            return this.availableWidths[i];
        }
    }

    return width;
};

/**
 * Runs code in a non-blocking fashion.
 *
 * @param {Function} callback
 */
Imager.prototype.nextTick = function nextTick (callback) {
    setTimeout(callback, this.replacementDelay);
};

/**
 * Builds a new Imager manager and processes the pictures.
 *
 * @api
 * @static
 * @param {NodeList|Array.<HTMLElement>} collection
 * @param {Object=} options
 * @returns {Imager}
 * @constructor
 */
Imager.init = function ImagerFactory (nodes, options) {
    var instance = new Imager(nodes, options);
    instance.process();

    return instance;
};

/**
 * Replaces matching patterns in a Uri string.
 * -> 'hey i'm {age} years old' + {age: 23} = 'hey i'm 23 years old'
 *
 * @api
 * @static
 * @param {String} uri
 * @param {Object} values
 * @returns {String}
 */
Imager.replaceUri = function replaceUri (uri, values) {
    var keys = [];

    for (var key in values) {
        keys.push(key);
    }

    return uri.replace(new RegExp('{(' + keys.join('|') + ')}', 'g'), function (m, key) {
        return values[key] || '';
    });
};

/**
 * Holds the various replacement strategies
 *
 * @type {Object}
 */
Imager.strategies = {};

/**
 * The default strategy which is going to be used if none of them is provided with `new Imager` or `Imager.init`.
 *
 * @type {string}
 */
Imager.DEFAULT_STRATEGY = 'replacer';

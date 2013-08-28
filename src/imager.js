"use strict";

var ImagerOptions;

/**
 * @typedef {{
 *   nodes: Array.<HTMLElement>|NodeList,
 *   availableWidths: Array.<Number>,
 *   strategy: Function|Object|String,
 *   placeholder: {matchingClassName: String, element: HTMLElement}
 * }}
 */
ImagerOptions;

/**
 *
 * @param {NodeList|Array.<HTMLElement>} collection
 * @param {ImagerOptions} options
 * @constructor
 */
function Imager(collection, options){
  var strategy;

  options = options || {};

  this.nodes = collection;
  this.availableWidths = options.availableWidths || [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];
  this.availableWidths = this.availableWidths.sort(function(a, b){ return b-a; });

  switch(typeof options.strategy){
      case 'string':    strategy = Imager.strategies[options.strategy]; break;
      case 'function':
      case 'object':    strategy = options.strategy; break;
      default:          strategy = Imager.strategies.container;
  }

  this.strategy = new strategy(options.placeholder);
}

/**
 * Processes any element from the collection, updates the size or eventually transform it as image
 */
Imager.prototype.process = function processCollection(){
  var i = this.nodes.length;
  var self = this;

  while(i--){
    (function(element){
      var strategy = self.strategy;

      //check if we have to replace it or not
      if (strategy.requiresPlaceholder(element)){
        strategy.createPlaceholder(element);
      }
    })(this.nodes[i]);
  }

  this.nextTick(function(){
      self.updateImagesSource();
  });
};

Imager.prototype.updateImagesSource = function updateImagesSource(){
    var i = this.nodes.length;
    var self = this;

    while(i--){
        (function(element){
            var strategy = self.strategy;

            strategy.updatePlaceholderUri(element, Imager.replaceUri(element.getAttribute('data-src'), {
                'width': self.getBestWidth(element.clientWidth)
            }));
        })(this.nodes[i]);
    }
};

/**
 * Returns the best available width to fit an image in.
 *
 * @param {Integer} image_width
 * @returns {Integer}
 */
Imager.prototype.getBestWidth = function getBestWidth(image_width){
    var width = this.availableWidths[0],
        i = this.availableWidths.length;

    while(i--){
        if (image_width <= this.availableWidths[i]){
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
Imager.prototype.nextTick = function nextTick(callback) {
    setTimeout(callback, 0);
};

/**
 * Builds a new Imager manager and processes the pictures.
 *
 * @param {NodeList|Array.<HTMLElement>} collection
 * @param {Object=} options
 * @returns {Imager}
 * @constructor
 */
Imager.init = function ImagerFactory(nodes, options){
  var instance = new Imager(nodes, options);
  instance.process();

  return instance;
};

/**
 * Replaces matching patterns in a Uri string.
 * -> "hey i'm {age} years old" + {age: 23} = "hey i'm 23 years old"
 *
 * @param {String} uri
 * @param {Object} values
 * @returns {String}
 */
Imager.replaceUri = function replaceUri(uri, values){
    var keys = [];

    for (var key in values){
        keys.push(key);
    }

    return uri.replace(new RegExp('{('+keys.join('|')+')}', 'g'), function(m, key){
        return values[key] || '';
    });
};

Imager.strategies = {};
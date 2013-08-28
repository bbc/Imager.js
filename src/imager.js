"use strict";

var ImagerOptions;

/**
 * @typedef {{
 *   availableWidth: Array.<Number>,
 *   className: String,
 *   srcPattern: String
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
  options = options || {};

  this.nodes = collection;
  this.availableWidths = options.availableWidths || [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];
  this.availableWidths = this.availableWidths.sort(function(a, b){ return b-a; });

  this.placeholder = options.placeholder || document.createElement('img');
  this.placeholder.src = this.placeholder.src || 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
  this.placeholder.className = options.placeholderClassName || 'responsive-img';
}

/**
 * Process any element from the collection, updates the size or eventually transform it as image
 */
Imager.prototype.process = function processCollection(){
  var i = this.nodes.length;
  var self = this;

  while(i--){
    (function(element){
      var replacer = self.getReplacer(element);

      //check if we have to replace it or not
      if (replacer && replacer.hasToReplace(element, self.placeholder)){
        replacer.replace(element, self.placeholder);
      }
    })(this.nodes[i]);
  }

  this.nextTick(function(){
      self.updateImagesSource();
  });
};

/**
 * Detects which is the most suitable replacer for an element and returns it.
 *
 * @param {HTMLElement} element
 * @returns {Object} Replacer object
 */
Imager.prototype.getReplacer = function getReplacer(element){
  var key;
  var replacers = Imager.replacers;

  for (key in replacers){
    if (replacers[key].matches(element)){
      return replacers[key];
    }
  }

  return null;
};

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

Imager.replacers = {};
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
  this.collection = collection;
  this.options = options || {};
}

/**
 * Process any element from the collection, updates the size or eventually transform it as image
 */
Imager.prototype.process = function processCollection(){
  var i;
  var self = this;
  var collection_count = this.collection.length;

  for (i = 0; i < collection_count; i++){
    (function(element){
      var replacer = self.getReplacer(element);

      //check if we have to replace it or not
      if (replacer && replacer.hasToReplace(element)){
        replacer.replaceElement(element);
      }

      //
    })(this.collection[i]);
  }
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

Imager.prototype.detect = function replaceElementWith(element, replacer){};

Imager.init = function ImagerFactory(collection, options){
  var instance = new Imager(collection, options);
  instance.process();

  return instance;
};

Imager.replacers = {};
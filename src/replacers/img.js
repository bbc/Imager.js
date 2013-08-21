(function(replacer){
  "use strict";

  replacer = {};

  replacer.matches = function(element){
    return element.nodeName === 'IMG' && element.getAttribute('data-src');
  };

  replacer.replace = function replaceElement(element){

  };
})(Imager.replacers.img);

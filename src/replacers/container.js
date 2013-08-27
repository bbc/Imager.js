(function(replacer){
  "use strict";

  replacer = {};

  replacer.matches = function(element){
    return element.nodeName === 'DIV' && element.getAttribute('data-src');
  };

  replacer.replace = function replaceElement(element){

  };
})(Imager.replacers.container);

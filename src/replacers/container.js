(function(strategies){
  "use strict";

  var allowedTags = ['DIV', 'SPAN', 'FIGURE'];      //more to come? Better way to allow enclosing tags?
  var strategy = { '_id': 'container' };

  strategy.matches = function(element){
    return ~allowedTags.indexOf(element.nodeName) && element.hasAttribute('data-src');
  };

  strategy.createPlaceholder = function replaceElement(element, placeholder){
    element.appendChild(placeholder.cloneNode());
  };

  strategy.requiresPlaceholder = function hasToReplace(element, placeholder){
    var i = element.children.length;

    while(i--){
        if (element.children[i].nodeName === placeholder.nodeName && element.children[i].className === placeholder.className){
            return false;
        }
    }

    return true;
  };

  strategy.updatePlaceholderUri = function updateUri(element, uri){
    console.log(element, uri)
  };

  strategies['container'] = strategy;
})(Imager.strategies);

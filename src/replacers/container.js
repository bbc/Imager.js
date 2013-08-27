(function(replacers){
  "use strict";

  var allowedTags = ['DIV', 'SPAN', 'FIGURE'];      //more to come? Better way to allow enclosing tags?
  var replacer = { '_id': 'container' };

  replacer.matches = function(element){
    return ~allowedTags.indexOf(element.nodeName) && element.hasAttribute('data-src');
  };

  replacer.replace = function replaceElement(element, placeholder){
    element.appendChild(placeholder.cloneNode());
  };

  replacer.hasToReplace = function hasToReplace(element, placeholder){
    var children_count = element.children.length;

    for(var i = 0; i < children_count; i++){
        if (element.children[i].nodeName === placeholder.nodeName && element.children[i].className === placeholder.className){
            return false;
        }
    }

    return true;
  };

  replacers['container'] = replacer;
})(Imager.replacers);

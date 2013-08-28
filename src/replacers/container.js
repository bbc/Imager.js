(function (strategies) {
    "use strict";

    function ImagerContainerStrategy (options) {
        options = options || {};

        this.matchingClassName = options.matchingClassName || 'responsive-img';
        this.element = options.element || document.createElement('img');
        this.element.src = options.src || 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
        this.element.className += ' ' + this.matchingClassName;
    }

    ImagerContainerStrategy._id = 'container';

    ImagerContainerStrategy.prototype.applyOnPlaceholder = function applyOnPlaceholder (element, callback) {
        var i = element.children.length;

        while (i--) {
            if (element.children[i].className.match(new RegExp('(^| )' + this.matchingClassName + '( |$)'))) {
                typeof callback === 'function' && callback(element.children[i], element);
                return true;
            }
        }

        return false;
    };

    ImagerContainerStrategy.prototype.createPlaceholder = function createPlaceholder (element) {
        element.appendChild(this.element.cloneNode());
    };

    ImagerContainerStrategy.prototype.requiresPlaceholder = function requiresPlaceholder (element) {
        return this.applyOnPlaceholder(element) === false;
    };

    ImagerContainerStrategy.prototype.updatePlaceholderUri = function updatePlaceholderUri (element, uri) {
        this.applyOnPlaceholder(element, function (placeholder) {
            placeholder.src = uri;
        });
    };

    strategies['container'] = ImagerContainerStrategy;
})(Imager.strategies);

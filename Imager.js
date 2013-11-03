(function (window, document) {

    'use strict';

    var $, Imager;

    window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


    $ = (function (dollar) {
        if (dollar) {
            return dollar;
        }

        return function (selector) {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
        };
    }(window.$));


    /*
        Construct a new Imager instance, passing an optional configuration object.

        Example usage:

            {
                // Available widths for your images
                availableWidths: [Number]

                // Selector to be used to locate your div placeholders
                selector: '',

                // Class name to give your resizable images.
                className: '',

                // Toggle the lazy load functionality on or off
                lazyload: Boolean

                // Used alongside the lazyload feature (helps performance by setting a higher delay)
                scrollDelay: Number
            }

        @param {object} configuration settings
        @return {object} instance of Imager
     */
    window.Imager = Imager = function (opts) {
        var self = this;
            opts = opts || {};

        this.imagesOffScreen = [];
        this.viewportHeight  = document.documentElement.clientHeight;
        this.availableWidths = opts.availableWidths || [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];
        this.selector        = opts.selector || '.delayed-image-load';
        this.className       = '.' + (opts.className || 'image-replace').replace(/^\.+/, '.');
        this.gif             = document.createElement('img');
        this.gif.src         = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
        this.gif.className   = this.className.replace(/^[#.]/, '');
        this.divs            = $(this.selector);
        this.cache           = {};
        this.scrollDelay     = opts.scrollDelay || 250;
        this.lazyload        = opts.lazyload || false;
        this.transforms      = Imager.transforms;

        this.changeDivsToEmptyImages();

        window.requestAnimationFrame(function(){
            self.init();
        });

        if (this.lazyload) {
            this.interval = window.setInterval(this.scrollCheck.bind(this), this.scrollDelay);
        }
    };

    Imager.prototype.scrollCheck = function(){
        if (this.scrolled) {
            if (!this.imagesOffScreen.length) {
                window.clearInterval(this.interval);
            }
            this.divs = this.imagesOffScreen.slice(0); // copy by value, don't copy by reference
            this.imagesOffScreen.length = 0;
            this.changeDivsToEmptyImages();
            this.scrolled = false;
        }
    };

    Imager.prototype.init = function(){
        var self = this;

        this.initialized = true;
        this.scrolled = false;
        this.checkImagesNeedReplacing();

        window.addEventListener('resize', function(){
            self.checkImagesNeedReplacing();
        }, false);

        if (this.lazyload) {
            window.addEventListener('scroll', function(){
                this.scrolled = true;
            }.bind(this), false);
        }
    };

    Imager.prototype.createGif = function (element) {
        var gif = this.gif.cloneNode(false);
            gif.width = element.getAttribute('data-width');
            gif.setAttribute('data-src', element.getAttribute('data-src'));

        element.parentNode.replaceChild(gif, element);
    };

    Imager.prototype.changeDivsToEmptyImages = function(){
        var divs = this.divs,
            i = divs.length,
            element;

        while (i--) {
            element = divs[i];

            if (this.lazyload) {
                if (this.isThisElementOnScreen(element)) {
                    this.createGif(element);
                } else {
                    this.imagesOffScreen.push(element);
                }
            } else {
                this.createGif(element);
            }
        }

        if (this.initialized) {
            this.checkImagesNeedReplacing();
        }
    };

    Imager.prototype.isThisElementOnScreen = function (element) {
        // document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
        // but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
        var offset = ('pageYOffset' in window) ? window.pageYOffset : document.documentElement.scrollTop;

        return (element.offsetTop < (this.viewportHeight + offset)) ? true : false;
    };

    Imager.prototype.checkImagesNeedReplacing = function(){
        var images = $(this.className),
            i = images.length,
            currentImage;

        if (!this.isResizing) {
            this.isResizing = true;

            while (i--) {
                currentImage = images[i];
                this.replaceImagesBasedOnScreenDimensions(currentImage);
            }

            this.isResizing = false;
        }
    };

    Imager.prototype.replaceImagesBasedOnScreenDimensions = function (image) {
        var i = this.determineAppropriateResolution(image)
        var src = i.url,
            parent = image.parentNode,
            replacedImage;

        if (this.cache[src]) {
            replacedImage = this.cache[src].cloneNode(false);
            replacedImage.width = image.getAttribute('width');
        } else {
            replacedImage = image.cloneNode(false);
            // replacedImage.src = src;
            this.cache[src] = replacedImage;
        }


var xhr = new XMLHttpRequest();
xhr.open('GET', src, true);

xhr.responseType = 'arraybuffer';
xhr.setRequestHeader('DPR', i.dpr);

xhr.onload = function(e) {
  if (this.status == 200) {
    var uInt8Array = new Uint8Array(this.response);
    var i = uInt8Array.length;
    var binaryString = new Array(i);
    while (i--)
    {
      binaryString[i] = String.fromCharCode(uInt8Array[i]);
    }
    var data = binaryString.join('');

    var base64 = window.btoa(data);

    replacedImage.src="data:image/png;base64,"+base64;
  }
};

xhr.send();

/*
replacedImage.onload = function(e){
    alert("onload" + e);
}
*/


        parent.replaceChild(replacedImage, image);
    };

    Imager.prototype.determineAppropriateResolution = function (image) {
        var src           = image.getAttribute('data-src'),
            imagewidth    = image.clientWidth,
            selectedWidth = this.availableWidths[0],
            i             = this.availableWidths.length;

        while (i--) {
            if (imagewidth <= this.availableWidths[i]) {
                selectedWidth = this.availableWidths[i];
            }
        }

        return this.changeImageSrcToUseNewImageDimensions(src, selectedWidth);
    };

    Imager.prototype.changeImageSrcToUseNewImageDimensions = function (src, selectedWidth) {
        var pxr = this.transforms['pixel_ratio'](Imager.getPixelRatio());
        src = src
          .replace(/{width}/g, selectedWidth)
          .replace(/{pixel_ratio}/g, pxr);
        return {
            url : src,
            dpr : Imager.getPixelRatio()
        };
    };

    Imager.getPixelRatio = function getPixelRatio(){
        return window.devicePixelRatio || 1;
    };

    Imager.transforms = {
        pixel_ratio: function(value){
            return value === 1 ? '' : '-'+value+'x'  ;
        }
    };

}(window, document));

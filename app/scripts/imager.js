// requestAnimationFrame shim.
window.requestAnimationFrame = window.requestAnimationFrame
|| window.mozRequestAnimationFrame
|| window.webkitRequestAnimationFrame
|| function (callback) {
  window.setTimeout(callback, 1000 / 60);
};


// jQuery substitute, if necessary.
$ = (function (dollar) {

  if (dollar) {
    return dollar;
  }

  return function (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  };
})(window.$);

var pubsub = (function(){

    var doc = document;
    var topics = {};
    var id = -1;
    var pubsub = {};

    pubsub.subscribe =  function (topic, fn) {
        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++id).toString();

        topics[topic].push({
            token: token,
            fn: fn
        });

        return token;
    };

    pubsub.unsubscribe =  function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }

        return false;
    };

    pubsub.publish =  function (topic, data) {
        if (!topics[topic]) {
            return false;
        }

        setTimeout(function(){
            var subscribers = topics[topic],

            len = topics[topic].length;

            while (len--) {
                subscribers[len].fn(topic, data);
            }
        }, 0);

        return true;
    };

    return pubsub;
}());


// Construct a new Imager instance, passing an optional configuration object,
// e.g.
//
//   {
//     // Available widths for your images.
//     availableWidths: [Number]
//
//     // Selector your div placeholders share.
//     selector: '',
//
//     // Class name to give your resizable images.
//     className: '',
//
//     // Regular expression to match against your image endpoint's naming
//     // conventions (e.g. http://yourserver.com/image/horse/400)
//     regex: RegExp
//   }
//
// @param  {object}
// @return {Imager}
window.Imager = Imager = function (opts) {

  var self = this;
  opts = opts || {};

  this.availableWidths = opts.availableWidths || [ 96, 130, 165, 200, 235,
  270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736 ];

  this.selector = opts.selector || '.delayed-image-load';
  this.className = '.' + (opts.className || 'image-replace').replace(/^\.+/, '.');
  this.regex = opts.regex || /^(.+\/)\d+$/i;

  this.gif = document.createElement('img');
  this.gif.src = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
  this.gif.className = this.className.replace(/^[#.]/, '');

  this.divs = $(this.selector);
  this.changeDivsToEmptyImages();

  this.cache = {};

  window.requestAnimationFrame(function () {
    self.init();
  });
};


// At instantiation, assign a resize listener, responsible for triggering an
// Imager resize callback.
//
// @return {undefined}
Imager.prototype.init = function () {

  var self = this;

  this.initialized = true;
  this.resizeImages();

  window.addEventListener('resize', function () {
    self.resizeImages();
  }, false);
};


// At instantiation, replace all `image replacer` div elements with empty
// images.
//
// @return {undefined}
Imager.prototype.changeDivsToEmptyImages = function () {

  var divs = this.divs,
      i = divs.length,
      gif;

  while (i--) {
    gif = this.gif.cloneNode(false);
    gif.width = divs[i].getAttribute('data-width');
    gif.setAttribute('data-src', divs[i].getAttribute('data-src'));
    divs[i].parentNode.replaceChild(gif, divs[i]);
  }

  if (this.initialized) {
    this.resizeImages();
  }
};


// Iterate over the images discovered on the document, replacing them with the
// appropriate image for a user's device.
//
// @return {undefined}
Imager.prototype.resizeImages = function () {

  var self = this,
      images = $(this.className),
      i = images.length;

  if (!this.isResizing) {
    this.isResizing = true;

    while (i--) {
      this.placeMaxResolutionImage(images[i]);
    }

    this.isResizing = false;
  }
};

// Modify an image object with new properties, tailored to the resolution the
// user's device fits.
//
// A caching mechanism is used when a particular resolution for an image has
// already been downloaded.
//
// @param  {object} image
// @return {undefined}
Imager.prototype.placeMaxResolutionImage = function (image) {

  var src = this.determineMaxResolution(image),
      parent = image.parentNode,
      replacedImage;

  if (this.cache[src]) {
    replacedImage = this.cache[src].cloneNode(false);
    replacedImage.width = image.getAttribute('width');
  } else {
    replacedImage = image.cloneNode(false);
    replacedImage.src = src;
    this.cache[src] = replacedImage;
  }

  parent.replaceChild(replacedImage, image);
};


// Determine the appropriate resolution image to download, based on the width
// the image passed in is being viewed at.
//
// @param  {object} image
// @return {string} the path to the image
Imager.prototype.determineMaxResolution = function (image) {

  var self = this,
      src = image.getAttribute('data-src'),
      width = image.clientWidth,
      selectedWidth = this.availableWidths[0],
      i = this.availableWidths.length;

  while (i--) {
    if (width <= this.availableWidths[i]) {
      selectedWidth = this.availableWidths[i];
    }
  }

  return src.replace(this.regex, function (match, captured) {
    return captured + selectedWidth;
  });
};
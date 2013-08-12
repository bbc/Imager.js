// requestAnimationFrame shim.
window.requestAnimationFrame = window.requestAnimationFrame
|| window.mozRequestAnimationFrame
|| window.webkitRequestAnimationFrame
|| function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

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

function ImageEnhancer(){
    pubsub.subscribe('imageEnhancer:resize', this.resizeImages.bind(this));
    pubsub.subscribe('div:added', this.changeDivsToEmptyImages.bind(this));
    pubsub.subscribe('div:changed', this.resizeImages.bind(this));
    this.availableWidthsFromOurImageProviderService = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];
    this.divs = document.getElementsByClassName('delayed-image-load'); // we use `getElementsByClassName` so we get a live NodeList
    this.changeDivsToEmptyImages();
    window.requestAnimationFrame(this.init.bind(this));
}

ImageEnhancer.prototype = {
    changeDivsToEmptyImages: function(){
        var i = this.divs.length;

        while (i--) {
            var div           = this.divs[i],
                img           = document.createElement('img');
                img.src       = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
                img.className = 'image-replace';
                img.width     = div.getAttribute('data-width');
                img.setAttribute('data-src', div.getAttribute('data-src'));

            div.parentNode.replaceChild(img, div);
        }

        if (this.initialised) {
            pubsub.publish('div:changed');
        }
    },

    init: function(){
        this.initialised = true;
        this.resizeImages();

        window.addEventListener('resize', function() {
            pubsub.publish('imageEnhancer:resize');
        }, false);
    },

    resizeImages: function(){
        var imageList = Array.prototype.slice.call(document.querySelectorAll('.image-replace'));

        if (!this.isResizing) {
            this.isResizing = true;

            imageList.forEach(function (img) {
                img.src = this.calculateNewImageSrc(img);
            }.bind(this));

            this.isResizing = false;
        }
    },

    calculateNewImageSrc: function (img) {
        var imageSrc      = img.getAttribute('data-src'),
            imageWidth    = img.clientWidth,
            selectedWidth = this.availableWidthsFromOurImageProviderService[0];

        this.availableWidthsFromOurImageProviderService.forEach(function (currentlyAvailableWidth, index) {
            if (imageWidth > currentlyAvailableWidth) {
                selectedWidth = this.availableWidthsFromOurImageProviderService[index + 1];
            }
        }.bind(this));

        return imageSrc.replace(/^(.+\/)\d+$/i, function (match, captured) {
            return captured + selectedWidth;
        });
    }
};

function createAnchor(){
    var anchor = document.createElement('a');
        anchor.href = '#my_new_element';
        anchor.innerHTML = 'Click me to add a new image to the DOM after Imager.js has already been instantiated'

    document.body.appendChild(anchor);

    anchor.onclick = createNewImage;
}

function createNewImage(){
    var div = document.createElement('div');
        div.className = 'delayed-image-load';
        div.setAttribute('name', 'my_new_element');
        div.setAttribute('data-src', 'http://placehold.it/340');
        div.setAttribute('data-width', '340');

    document.body.appendChild(div);

    pubsub.publish('div:added');
}

createAnchor();

new ImageEnhancer();
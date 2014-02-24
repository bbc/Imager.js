## JavaScript API

The *JavaScript API* helps you instantiate and control how Imager works from a *business logic point of view*.

### `new Imager([selector|elements, [options]])`

Calling the constructor will initialise responsive images for the provided `elements` or the HTML elements concerned by the `selector`.

The `options` bit is an object documented below, in the [JavaScript Options section](#javascript-options).

```js
new Imager('.responsive-image-placeholder');
```

The constructor can be saved in a variable for later use...

```js
var imgr = new Imager('.responsive-image-placeholder', { onResize: false });

// Using jQuery to set-up the event handling and help keep the correct scope when executing the callback
$(window).on('resize scroll.debounced', $.proxy(imgr.checkImagesNeedReplacing, imgr));
```

For legacy reasons the first argument is optional and defaulted to `.delayed-image-load`:

```js
new Imager();
```


### `Imager.checkImagesNeedReplacing()`

Updates the `img[src]` attribute if the container width has changed, and if it matches a different `availableWidths` value.

It is relevant to use this method if an unwatched event occurred and impacts responsive image widths.

```js
var imgr = new Imager();

// Using jQuery to set-up the event handling and help keep the correct scope when executing the callback
$(document).on('customEvent', $.proxy(imgr.checkImagesNeedReplacing, imgr));
```

### `Imager.registerResizeEvent()`

Registers a `window.onresize` handler which will update the relevant `img[src]` (using `Imager.checkImagesNeedReplacing`)
when the window size changes.

This covers window resizing, device orientation change and entering full screen mode.

```js
var imgr = new Imager();

// Using jQuery to set-up the event handling and help keep the correct scope when executing the callback
$(document).on('load', $.proxy(imgr.registerResizeEvent, imgr));
```

### `Imager.registerScrollEvent()`

Registers a `window.onscroll` handler which will update the relevant `img[src]` (using `Imager.checkImagesNeedReplacing`)
when the content is scrolled.

A default 250ms [debounce](http://benalman.com/projects/jquery-throttle-debounce-plugin/) is performed to avoid
trashing the rendering performance. You can alter this value by setting the `scrollDelay` option.

```js
var imgr = new Imager();

// Using jQuery to set-up the event handling and help keep the correct scope when executing the callback
$(document).on('load', $.proxy(imgr.registerScrollEvent, imgr));
```
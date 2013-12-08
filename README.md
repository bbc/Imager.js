# Imager.js [![Build Status](https://secure.travis-ci.org/BBC-News/Imager.js.png?branch=master)](http://travis-ci.org/BBC-News/Imager.js)

> Imager.js is an alternative solution to the issue of how to handle responsive image loading, created by developers at [BBC News](http://responsivenews.co.uk/).


## Why?

There are many responsive image solutions in the wild: `srcset`, `src-n`, `PictureFill` and so on. They are either
**verbose** or **hard to debug** (and to maintain/integrate). Some of them don't deal well with *pixel density*
and suffer from **double asset payload** (meaning you end up downloading assets unnecessarily).

We wanted something **simple**, which **works** and which is **fast** as well as network friendly (only download what you need, when you need it).

Imager implements the  [BBC Responsive News technique](http://responsivenews.co.uk/post/50092458307/images) which incorporates:

- loading any image once
- loading the most suitable sized image

## How does it work?

Imager runs through the following workflow:

1. lookup **placeholder elements**
2. replace **placeholders** with transparent images
3. update `src` attribute for each image and assign the best quality/size ratio URL

Finally, it will lazy load images to speed up page load time even further.


## Install

<table>
  <thead>
    <tr>
      <th>npm</th>
      <th>bower</th>
      <th>old school</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>npm install --save imager</code></td>
      <td><code>bower install --save imager</code></td>
      <td><a href="https://github.com/BBC-News/Imager.js/archive/master.zip">download zip file</a></td>
    </tr>
  </tbody>
</table>

## Using

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://placehold.it/{width}">
</div>

<script>
    new Imager({ availableWidths: [200, 260, 320, 600] });
</script>
```

This will result in the following HTML output:

```html
<div style="width: 240px">
    <img src="http://placehold.it/260" data-src="http://placehold.it/{width}" class="image-replace">
</div>

<script>
    new Imager({ availableWidths: [200, 260, 320, 600] });
</script>
```

`260` has been elected as the best available width (as it is the closest upper size relative to `240` pixels).

### Pixel Ratio / HiDPI / Retina


```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://example.com/assets/{width}/imgr{pixel_ratio}.png">
</div>

<script>
    new Imager({ availableWidths: [200, 260, 320, 600] });
</script>
```

The `img[src]` will be computed as following (according to the reported `window.devicePixelRatio` value by the device):

- `http://example.com/assets/260/imgr.png` if no pixel ratio is detected, or advertised as `1`
- `http://example.com/assets/260/imgr-2x.png` if pixel ratio is advertised as `2`
- `http://example.com/assets/260/imgr-1.3x.png` if pixel ratio is advertised as `1.3`

Head to this [device pixel density test](http://bjango.com/articles/min-device-pixel-ratio/) resource to learn more about the available pixel ratio for your device.

### Interpolating `{width}` value

Imager has the ability to replace `{width}` with a non-numeric value if you provide the `availableWidths` option/value in the `Object` type. This feature allows you to use a human readable name or integrate with third-party images provider. 

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://example.com/assets/imgr-{width}.png">
</div>

<script>
    new Imager({ 
        availableWidths: {
            200: 'square',
            260: 'small',
            320: 'medium',
            600: 'large'
        }
    });
</script>
```

The `img[src]` will be computed as `http://example.com/assets/imgr-small.png` instead of `http://example.com/assets/imgr-260.png`.

### Mixing various configurations

You might want to generate HiDPI responsives images. But what if you also include images from another provider which
serves a totally different set of sizes, without pixel ratio?

Here is an example to serve your own images alongside [Flickr images](http://www.flickr.com/).

```html
<div style="width: 240px">
    <div class="delayed-image-load"        data-src="http://placehold.it/{width}">
    <div class="delayed-flickr-image-load" data-src="//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_{width}.jpg">
</div>

<script>
    var imgrPlaceholder = new Imager('.delayed-image-load', {
        availableWidths: [200, 260, 320, 600]
    });

    var imgrFlickr = new Imager('.delayed-flickr-image-load', { 
        availableWidths: {
            150: 't_d',
            500: 'd',
            640: 'z_d'
        }
    });
</script>
```

This will result in the following HTML output:

```html
<div style="width: 240px">
    <img src="http://placehold.it/260" data-src="http://placehold.it/{width}" class="image-replace">
    <img src="//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_d.jpg" data-src="//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_{width}.jpg" class="image-replace">
</div>
```

---

# Documentation

## HTML Options

The *HTML API* helps you control how Imager works from the *content point of view*.

### `data-src`

Available placeholders are:

- `{width}`: best available image width (numeric value)
- `{pixel_ratio}`: device pixel ratio (either *blank* or `-1.3x`, `-2x`, `-3x` etc.)


So the following HTML...

```html
<div data-src="http://placehold.it/{width}"></div>
```

...is converted to...

```html
<img src="http://placehold.it/260" data-src="http://placehold.it/{width}" class="image-replace">
```

### `data-width`

`data-width` is the enforced size of the image placeholder; where the actual image will eventually be loaded.

This can be especially useful if you don't want to depend on the image container width.

So the following HTML...

```html
<div style="width:600px">
    <div data-src="http://placehold.it/{width}" data-width="300"></div>
</div>
```

...is converted to...

```html
<div style="width:600px">
    <img src="http://placehold.it/300" data-src="http://placehold.it/{width}" width="300" class="image-replace">
</div>
```

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

It is relevant to use this method if an unwatched event occured and impacts responsive image widths.

```js
var imgr = new Imager();

// Using jQuery to set-up the event handling and help keep the correct scope when executing the callback
$(document).on('customEvent', $.proxy(imgr.checkImagesNeedReplacing, imgr));
```

### `Imager.registerResizeEvent()`

Registers a `window.onresize` handler which will update the relevant `img[src]` (using `Imager.checkImagesNeedReplacing`)
when the window size changes.

This covers window resising, device orientation change and entering full screen mode.

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

## JavaScript Options

### `availableWidths`

This option is intended to reflect the available widths of each responsive image. These values will be used as replacements
for the `{width}` and `data-src` placeholders.

The following examples demonstrate the results of passing through different object types for the `availableWidths` option...

`Array`: the widths are represented as numeric values

```js
new Imager({
    availableWidths: [240, 320, 640]
});
```

`Object`: the widths associate a string value for their numeric counterpart

```js
new Imager({
    availableWidths: {
        240: 'small',
        320: 'medium',
        640: 'large'
    }
});
```

`Function`: must return a value for the provided width argument

```js
// will return a double sized image width as a numeric value
new Imager({
    availableWidths: function (image) {
        return image.clientWidth * 2;
    }
});
```

### `className`

A String which indicates what the `className` value will be added on the newly created responsive image.

```js
new Imager({ className: 'image-replace' });
```

**Default value**: `image-replace`

### `scrollDelay`

An Integer value (in milliseconds) to indicate when Imager will check if a scroll has ended. If a scroll has stopped after this delay and the `lazyload` option is `true`, Imager will update the `src` attribute of the relevant images.

**Default value**: `250`

```js
new Imager({ scrollDelay: 250 });
```

**Notice**: set the `scrollDelay` value to `0` at your own risk; unless you know what you're doing, setting the value to zero will make the user experience totally janky! (and that would be an odd thing to do as you have chosen to use Imager to improve the user experience)

### `onResize`

A Boolean value. If set to `true`, Imager will update the `src` attribute of the relevant images.

**Default value**: `true`

```js
new Imager({ onResize: true });
```

### `lazyload`

An *experimental* Boolean value. If set to `true`, Imager will update the `src` attribute only of visible (and nearly visible) images.

**Default value**: `false`

```js
new Imager({ lazyload: true });
```

# Grunt Responsive Image Demo

This demo requires the following commands to be run...

- `npm install` (all dependencies specified in package.json)
- `brew install imagemagick` (for other installations see [http://www.imagemagick.org/script/binary-releases.php](http://www.imagemagick.org/script/binary-releases.php))

Review the `Gruntfile.js` and update the custom sizes that you want to use (if no sizes are specified in the Gruntfile then 320, 640, 1024 are used)...

```js
options: {
    sizes: [
        {
            width: 320,
            height: 240
        },
        {
            name: 'large',
            width: 640
        },
        {
            name   : 'large',
            width  : 1024,
            suffix : '_x2',
            quality: 0.6
        }
    ]
}
```

...be aware the names of the files need to change within your HTML...

```html
<div class="delayed-image-load" data-src="Assets/Images/Generated/A-320.jpg" data-width="1024"></div>
<div class="delayed-image-load" data-src="Assets/Images/Generated/B-320.jpg" data-width="1024"></div>
<div class="delayed-image-load" data-src="Assets/Images/Generated/C-320.jpg" data-width="1024"></div>
```

You can then pass those image sizes through to Imager.js along with a regex for Imager to parse the information...

```js
var imager = new Imager({
    availableWidths: [320, 640, 1024]
});
```

For full details of the Grunt task options see the [grunt-responsive-images](https://github.com/andismith/grunt-responsive-images/) repo on GitHub.

# Background

This is an experiment in offering developers an interim solution to responsive images based on the [ImageEnhancer](https://gist.github.com/Integralist/6157139) concept researched and developed by the team at BBC News.

At present, support for `srcset` and `PictureFill` are not widespread and the polyfills for these solutions also come with a number of drawbacks.

[Mark McDonnell (@integralist)](http://twitter.com/Integralist) documented the process and rewrote the original code so it could be evolved and improved with the help of the open-source community.

The goal of this project is to automate the process with the help of the [Grunt](http://gruntjs.com/) JavaScript task runner (potentially via `grunt-responsive-images` for image generation based on a source directory).

Much of this work can be repurposed to work with a more standards-based approach once support improves in modern browsers.

For the purposes of maintaining a distinguishment between the ImageEnhancer concept built by BBC News and this project, we're calling it **Imager.js**


# Credits

- [Mark McDonnell](http://twitter.com/integralist)
- [Tom Maslen](http://twitter.com/tmaslen)
- [Thomas Parisot](https://twitter.com/oncletom)
- [Addy Osmani](http://twitter.com/addyosmani)


# Licence

> Copyright 2013 British Broadcasting Corporation
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

# Imager.js [![Build Status](https://secure.travis-ci.org/BBC-News/Imager.js.svg?branch=master)](http://travis-ci.org/BBC-News/Imager.js)

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

## Compatibility

Imager is tested against the following mobile and desktop browsers:

- Chrome stable
- Firefox stable
- IE 8, 9, 10 and 11
- Safari 5, 6 and 7
- Mobile Safari 4, 5, 6 and 7
- Android 2, 3 and 4


## Install

npm                            | bower                            | old school
-------------------------------|----------------------------------|------------------------------------------------------------------------------
`npm install --save imager.js` | `bower install --save imager.js` | [download zip file](https://github.com/BBC-News/Imager.js/archive/master.zip)


## Using

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://placehold.it/{width}" data-alt="alternative text"></div>
</div>

<script>
    new Imager({ availableWidths: [200, 260, 320, 600] });
</script>
```

This will result in the following HTML output:

```html
<div style="width: 240px">
    <img src="http://placehold.it/260" data-src="http://placehold.it/{width}" alt="alternative text" class="image-replace">
</div>

<script>
    new Imager({ availableWidths: [200, 260, 320, 600] });
</script>
```

`260` has been elected as the best available width (as it is the closest upper size relative to `240` pixels).

### Pixel Ratio / HiDPI / Retina

Let's say we have generated 4 sizes of images (`200`, `260`, `320` and `600`)
in 3 different pixel ratio flavours (`1`, `1.3` and `2`):

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://example.com/assets/{width}/imgr{pixel_ratio}.png" data-alt="alternative text"></div>
</div>

<script>
    new Imager({ availableWidths: [200, 260, 320, 600], availablePixelRatios: [1, 1.3, 2] });
</script>
```

The `img[src]` will be computed as following (according to the reported `window.devicePixelRatio` value by the device):

- `http://example.com/assets/260/imgr.png` if no pixel ratio is detected, or advertised as `1`
- `http://example.com/assets/260/imgr-2x.png` if pixel ratio is advertised as `2` (or any value greater than 2)
- `http://example.com/assets/260/imgr-1.3x.png` if pixel ratio is advertised as `1.3`

Head to this [device pixel density test](http://bjango.com/articles/min-device-pixel-ratio/) resource to learn more about the available pixel ratio for your device.

### Interpolating `{width}` value

Imager has the ability to replace `{width}` with a non-numeric value if you
provide the `widthInterpolator` option, which is a function that returns the
string to be injected into the image URL for a given width. This feature allows you to use a human readable name or integrate with third-party image providers.

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://example.com/assets/imgr-{width}.png" data-alt="alternative text"></div>
</div>

<script>
    new Imager({
        availableWidths: [200, 260, 320, 600],
        widthInterpolator: function(width, pixelRatio) {
          return width + 'x' + (width / 2);
        }
    });
</script>
```

The `img[src]` will be computed as `http://example.com/assets/imgr-260x130.png` instead of `http://example.com/assets/imgr-260.png`.

Alternatively you can define `availableWidths` as an `Object` where the key is the width, and the value is the string to be injected into the image URL.

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://example.com/assets/imgr-{width}.png" data-alt="alternative text"></div>
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

You might want to generate HiDPI responsive images. But what if you also include images from another provider which
serves a totally different set of sizes, without pixel ratio?

Here is an example to serve your own images alongside [Flickr images](http://www.flickr.com/).

```html
<div style="width: 240px">
    <div class="delayed-image-load"        data-src="http://placehold.it/{width}" data-alt="alternative text 1"></div>
    <div class="delayed-flickr-image-load" data-src="//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_{width}.jpg" data-alt="alternative text 2"></div>
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
    <img src="http://placehold.it/260" data-src="http://placehold.it/{width}" alt="alternative text 1" class="image-replace">
    <img src="//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_d.jpg" data-src="//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_{width}.jpg" alt="alternative text 2" class="image-replace">
</div>
```

---

# Documentation

## HTML Attributes

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
    <div data-src="http://placehold.it/{width}" data-width="300" data-alt="alternative text"></div>
</div>
```

...is converted to...

```html
<div style="width:600px">
    <img src="http://placehold.it/300" data-src="http://placehold.it/{width}" width="300" alt="alternative text" class="image-replace">
</div>
```

### `data-alt` and `data-class`

These two `data-*` attributes are copied from the responsive placeholder to the response `img` element.nnot process images or who have image loading disabled. It is converted to the `alt` attribute of the `img element.

So the following HTML...

```html
<div data-src="http://placehold.it/{width}" data-alt="alternative text"></div>
<div data-src="http://placehold.it/{width}" data-class="london calling"></div>
```

...is converted to...

```html
<img src="http://placehold.it/260" data-src="http://placehold.it/{width}" alt="alternative text" class="image-replace">
<img src="http://placehold.it/260" data-src="http://placehold.it/{width}" alt="" class="london calling image-replace">
```

## JavaScript Configuration

You can create one or several concurrent configurations of Imager within the same page. Its configuration options are
described below.

[Advanced JavaScript API documentation lies in the `docs/` folder](docs/js-api.md).

### `availableWidths`

This option is intended to reflect the available widths of each responsive image. These values will be used as replacements
for the `{width}` variable in `data-src` placeholders.

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

### `availablePixelRatios`

An Array which indicates what are the available pixel ratios available for your responsive images.

These values will be used as replacements for the `{pixel_ratio}` variable in `data-src` placeholders.

```js
new Imager({ availablePixelRatios: [1, 2] });
```

**Default value**: `[1, 2]`

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

### `lazyloadOffset`

A `Number` of extra pixels below the fold taken in account by the lazyloading mechanism.

**Default value**: `0`

```js
new Imager({ lazyload: true, lazyloadOffset: 300 });
```

### `onImagesReplaced`

A callback `Function`. Runs after Imager updates the `src` attribute of all relevant images.

Its first and unique argument is an `Array` of `HTMLImageElement`, the ones processed by Imager.

```js
new Imager({
    onImagesReplaced: function(images) {
        console.log('the src of all relevant images has been updated');
    }
});
```

## JavaScript API

### `.ready(fn)`

Executes a function when Imager is ready to work.

```js
new Imager({ ... }).ready(function(){
  console.log('Placeholders divs have been replaced');
});
```

### `.add(elements | selector)`

Add new elements to the existing pool of responsive images.

```js
var imgr = new Imager('.delayed-image-load');

imgr.add('.new-delayed-image-load-selector');
imgr.add(newElements);
imgr.add();     // reuses the constructor selector ('.delayed-image-load')
```

# Demos

Additional and fully working examples lie in the [`demos` folder](demos/).


# They are using it

- [BBC News](http://m.bbc.co.uk/news)
- [The Guardian](http://www.theguardian.com/)
- [`x-imager` Web Component](https://github.com/addyosmani/x-imager)

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

> Copyright 2014 British Broadcasting Corporation
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

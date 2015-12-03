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

- Chrome 33
- Firefox 22
- Opera 12.15
- Edge 12
- Internet Explorer 8, 9, 10 and 11
- Safari 5, 6, 7, 8 and 9
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

### Passing a collection of elements

You might want to pass a NodeList or an array of **placeholder elements** as the first argument rather than a class selector.

```html
<div style="width: 240px">
    <div class="delayed-image-load" data-src="http://placehold.it/{width}" data-alt="alternative text"></div>
</div>

<script>
    var placeholderElems = document.querySelectorAll('.delayed-image-load');
    var imgrPlaceholder = new Imager(placeholderElems, {
        availableWidths: [200, 260, 320, 600]
    });
</script>
```

This will result in the following HTML output:

```html
<div style="width: 240px">
    <img src="http://placehold.it/260" data-src="http://placehold.it/{width}" alt="alternative text" class="image-replace">
</div>
```

# Documentation

Browse Imager public APIs and options – versioned alongside the source code of the project:

- [HTML options](docs/html-api.md)
- [JavaScript options](docs/js-options.md)
- [JavaScript API](docs/js-api.md)

# Demos

Additional and fully working examples lie in the [`demos` folder](demos/).


# They are using it

- [BBC News](http://m.bbc.co.uk/news)
- [BBC Sport](http://m.bbc.co.uk/sport)
- [The Guardian](http://www.theguardian.com/)
- [`x-imager` Web Component](https://github.com/addyosmani/x-imager)
- [Imager.jsx React Component](https://www.npmjs.com/package/imager.jsx)

# Background

This is an experiment in offering developers an interim solution to responsive images based on the [ImageEnhancer](https://gist.github.com/Integralist/6157139) concept researched and developed by the team at BBC News.

At present, support for `srcset` and `PictureFill` are not widespread and the polyfills for these solutions also come with a number of drawbacks.

[Mark McDonnell (@integralist)](http://twitter.com/Integralist) documented the process and rewrote the original code so it could be evolved and improved with the help of the open-source community.

The goal of this project is to automate the process with the help of the [Grunt](http://gruntjs.com/) JavaScript task runner (potentially via `grunt-responsive-images` for image generation based on a source directory).

Much of this work can be repurposed to work with a more standards-based approach once support improves in modern browsers.

For the purposes of maintaining a distinguishment between the ImageEnhancer concept built by BBC News and this project, we're calling it **Imager.js**

**[Read more on BBC Responsive News blog](http://responsivenews.co.uk/post/58244240772/imager-js)**.

# Credits

- [Mark McDonnell](http://twitter.com/integralist)
- [Tom Maslen](http://twitter.com/tmaslen)
- [Thomas Parisot](https://twitter.com/oncletom)
- [Addy Osmani](http://twitter.com/addyosmani)


# Licence

> Copyright 2015 British Broadcasting Corporation
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

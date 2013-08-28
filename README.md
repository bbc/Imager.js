# Imager.js

Imager.js is an alternative solution to the issue of how to handle responsive image loading within a responsive code base.

This is an open-source software baked by developers at [BBC News](http://responsivenews.co.uk/) as part of the Responsive News initiative.

## How It Works?

Imager.js replaces responsive images placeholders and builds URLs to the most efficient size. It follows this workflow:

1. Every potential picture is replaced by a placeholder picture (transparent by default)
1. The responsive image URL is built based on the placeholder picture size
1. The responsive image is inserted in lieu of the placeholder

## Requirements

You'll need a server-side image processing script which can return optimised images at specific dimensions that match parameters set within a RESTful URL design.

For the purpose of demonstration we're using the 3rd party service [Placehold.it](http://placehold.it/).

## Using Imager.js

Consider the following HTML structure wherever you need a responsive image to be loaded:

```html
<div class="delayed-image-load" data-src="http://placehold.it/{width}/picture.jpg" data-width="340"></div>
```

 * `data-width` is the size of the image placeholder (where the actual image will eventually be loaded)
 * `data-src` is the initial URL to be loaded

You have then to perform the replacement using the following JavaScript code:

```javascript
var images = document.querySelectorAll(".delayed-image-load");
Imager.init(images);
```

### Hooking On External Events

```javascript
var manager = Imager.init($("main .delayed-image-load"));

$.on("resize orientationchange", function(){
    manager.process();
});
```

### Multiple Managers

```javascript
var contentImageManager = Imager.init($("main .delayed-image-load"));
var sidebarImageManager = Imager.init($("aside .pics"));

window.addEventListener("resize", function(){
    //resize only content pictures as the sidebar is fixed size (for example)
    contentImageManager.process();
});
```

### Combining With A Lazy Loader

TBD. But your ideas are welcome!

### Living Code

Browse the [`Demo`](Demo) directory for full example and source files.
Read the [JavaScript API below](README.md#Javascript-API) to learn more about how to use `Imager.js` API.

## HTML API

### `data-src` URL Placeholders

The `data-src` is a composable URL towards a responsive image. You can use several keywords to build it you own way:

* `{width}`: the most appropriate guessed value within the `config.availableWidths`
* `{pixel_ratio}`: the closest pixel density within the `config.availableWidths`

```html
<!-- Default and minimalistic approach -->
<div class="delayed-image-load" data-src="http://placehold.it/{width}/picture.jpg" data-width="340"></div>

<!-- Pixel-density aware approach -->
<div class="delayed-image-load" data-src="http://placehold.it/{width}/picture-{pixel_ratio}.jpg" data-width="340"></div>

<!-- Query String URLs -->
<div class="delayed-image-load"
    data-src="http://myserver.com/responsive.php?source=image/picture.jpg&amp;width={width}&amp;pix_ratio={pixel_ratio}"
    data-width="340"></div>
```

### Container Strategy

The container strategy *inserts a picture inside* a container tag.

```html
<!-- In a div -->
<div class="delayed-image-load" data-src="http://placehold.it/{width}/picture.jpg" data-width="340"></div>

<!-- In a span -->
<span class="delayed-image-load" data-src="http://placehold.it/{width}/picture.jpg" data-width="340"></span>
```

### Image Strategy

The image strategy *replaces an existing placeholder* tag.

```html
<!-- In a div -->
<div class="news-headline">
    <h2>Are Cats more Evil then Satan?</h2>

    <img class="delayed-image-load" src="my/pics/blank.gif" data-src="http://placehold.it/{width}/picture.jpg" data-width="340">

    <p>…</p>
</div>
```


## JavaScript API

### `Imager.init(NodeList collection[, Object options])`

Creates and returns a new Imager instance after `process()` being called on `collection`.
If you don't know what you do, this is definitely the one you should pick up.

```javascript
"Example to be written";
```

### `new Imager(NodeList collection[, Object options])`

Creates a new Imager instances and tracks pictures. At this stage, nothing else is done.
It is the tailored for people who want to control every single step of `Imager.js`.


```javascript
"Example to be written";
```

### `process([Function callback])`

Process every single `collection` elements, eventually replace them by a placeholder and builds the proper URL
based on the actual viewport size. You should call it every time a container size has eventually changed (like a
window resize, a device orientation change etc.).

```javascript
"Example to be written";
```

## Contributing

Raising an issue, an idea or pushing some code are warmly welcomed.
Feel free to [read our contribution tips](CONTRIBUTING.md) to join the bandwagon!

## Credits

 * [Mark McDonnell](http://twitter.com/integralist)
 * [Tom Maslen](http://twitter.com/tmaslen)
 * [Addy Osmani](http://twitter.com/addyosmani)

## Background

This is an experiment in offering developers an interim solution to responsive images based on the [ImageEnhancer](https://gist.github.com/Integralist/6157139) concept researched and developed by the team at BBC News.

At present, support for `srcset` and `PictureFill` are not widespread and the polyfills for these solutions also come with a number of drawbacks.

[Mark McDonnell (@integralist)](http://twitter.com/Integralist) documented the process and rewrote the original code so it could be evolved and improved with the help of the open-source community.

The goal of this project is to automate the process with the help of the [Grunt](http://gruntjs.com/) JavaScript task runner (potentially via `grunt-responsive-images` for image generation based on a source directory).

Much of this work can be repurposed to work with a more standards-based approach once support improves in modern browsers.

For the purposes of maintaining a distinguishment between the ImageEnhancer concept built by BBC News and this project, we're calling it Imager.js

## Why not srcset/Picturefill polyfills

Having reviewed the polyfills for these implementations, the cons outweigh the pros at this point. You either take performance hits or have to deal with 2x image requests, which is counter-intuitive. I'd prefer to just use srcset on its own, but other than WebKit other browsers have yet to implement at this point.

## Grunt Responsive Image Demo

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

## Licence

Imager.js is available to everyone under the terms of the Apache 2.0 open source licence.
Take a look at the [LICENSE file](LICENSE) in the code.

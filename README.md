# Imager.js

 * Website: http://responsivenews.co.uk/
 * Source: http://github.com/bbc-news/Imager.js

*Note: this project is not ready for production and is currently in development*

Imager.js is an alternative solution to the issue of how to handle responsive image loading, created by developers at BBC News.

## What is it?

An open-source port of the BBC News technique for handling the loading of images within a responsive code base.

It allows you to…

- Specify placeholder elements that get replaced with appropriate images
- Lazy load images (no point loading images that a user never sees)
- Parse your own URL structure using regular expressions
- Utilise Grunt to generate a group of responsive images based off a folder directory

## Requirements

If you don't have your own RESTful image service (think of [Placehold.it](http://placehold.it/)) then you'll need [Grunt: The JavaScript Task Runner](http://gruntjs.com/) which allows you to specify an image folder and have it generate multiple image sizes for you to use with Imager.js 

For the purpose of one of our demo/examples we've used the 3rd party service [Placehold.it](http://placehold.it/).

But you'll also find Grunt based demos that show the basic functionality as well as how lazy loading works.

## Using Imager.js

See each of the Demo directories for full examples and source files.

In its most basic form, wherever you need an image to appear add: `<div class="delayed-image-load" data-src="http://placehold.it/340" data-width="340"></div>` - where the `data-width` is the size of the image placeholder (where the actual image will eventually be loaded) and the `data-src` is the initial URL to be loaded.

Then within your JavaScript, initialise a new instance of the Imager library: `new Imager();`

There are examples of Imager being used with Grunt as well as a lazy-load
image version.

## Credits

 * [Mark McDonnell](http://twitter.com/integralist)
 * [Tom Maslen](http://twitter.com/tmaslen)
 * [Addy Osmani](http://twitter.com/addyosmani)

## Alternatives

BBC R&D developer [Thomas Parisot](https://github.com/oncletom/Imager.js/) has built an alternative implementation that introduces some features currently not available within Imager.js

We are proactively looking to add improvements to Imager.js (such as ~~proper lazy loading images~~ -> we now have lazy loading built in, specifying pixel density images among other additions) but do feel free to explore Thomas' version (remember to check specifically his branches `feature-separation` and `flickr-demo`)

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
Take a look at the LICENSE file in the code.

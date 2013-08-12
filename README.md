# Imager.js

 * Website: http://responsivenews.co.uk/
 * Source: http://github.com/bbc-news/Imager.js 
 
*Note: this project is not ready for production and is currently in development*
 
Imager.js is an alternative solution to the issue of how to handle responsive image loading, created by developers at BBC News.

## What is it?

An open-source port of the BBC News technique for handling the loading of images within a responsive code base.

## Requirements

You'll need a server-side image processing script which can return optimised images at specific dimensions that match parameters set within a RESTful URL design.

For the purpose of demonstration we're using the 3rd party service [Placehold.it](http://placehold.it/).

## Using Imager.js

See the `Demo` directory for full example and source files.

Wherever you need an image to appear add: `<div class="delayed-image-load" data-src="http://placehold.it/340" data-width="340"></div>` - where the `data-width` is the size of the image placeholder (where the actual image will eventually be loaded) and the `data-src` is the initial URL to be loaded. 

Then within your JavaScript, initialise a new instance of the Imager Enhancer library: `new ImageEnhancer();`

## Contributing

If you want to add functionality to this project, pull requests are welcome.

 * Create a branch based off master and do all of your changes with in it.
 * Make sure commits are as 'atomic' as possible (this way specific changes can be removed or cherry-picked more easily)
 * If you have to pause to add a 'and' anywhere in the title, it should be two pull requests.
 * Make commits of logical units and describe them properly
 * Check for unnecessary whitespace with git diff --check before committing.
 * If possible, submit tests to your patch / new feature so it can be tested easily.
 * Assure nothing is broken by running all the test
 * Please ensure that it complies with coding standards.

**Please raise any issues with this project as a GitHub issue.**

## Licence

Imager.js is available to everyone under the terms of the MIT open source
licence. Take a look at the LICENSE file in the code.

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

## Why not srcset/Picturefill polyfills:

Having reviewed the polyfills for these implementations, the cons outweigh the pros at this point. You either take performance hits or have to deal with 2x image requests, which is counter-intuitive. I'd prefer to just use srcset on its own, but other than WebKit other browsers have yet to implement at this point.

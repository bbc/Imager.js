# 0.2.0

A couple of new additions, with the help of the community!
One thing to remember is the full compatibility with IE8.

Unit tests on `master` are now ran against those browsers:

- Internet Explorer 8
- Firefox 21
- Android 4.0
- Safari Mobile for IOS 5.1
- Safari 6

## Features

 * Internet Explorer 8 code compatibility and testing
 * The `widthInterpolator` option gives the ability to format the `{width}` replacement dynamically ([PR #68](https://github.com/BBC-News/Imager.js/pull/68))
 * Minified version is now mangled and compressed… so smaller filesize ([PR #78](https://github.com/BBC-News/Imager.js/pull/78))
 * Sourcemap files are now provided as well
 * The `onImagesReplaced` option gives you the ability to perform an action each time images have been replaced ([PR #47](https://github.com/BBC-News/Imager.js/pull/47))
 * The `availablePixelRatios` option gives you the ability to whitelist the `{pixel_ratio}` replacement values ([PR #61](https://github.com/BBC-News/Imager.js/pull/61))
 * The `data-alt` container attribute ([PR #57](https://github.com/BBC-News/Imager.js/pull/57))


## Bugfixes

 * `availableWidths` is now working for real ([PR #67](https://github.com/BBC-News/Imager.js/pull/67))
 * Fixing an `Array.prototype.map` in tests breaking w/ IE8
 * Fixing the lack of `HTMLElement` in IE8
 * Fixing `window.devicePixelRatio` stubbing in tests
 * Fixing `length` check
 * Fixing `offsetTop` calculation in the experimental the lazyloading feature ([PR #60](https://github.com/BBC-News/Imager.js/pull/60))


# 0.1.0

A major release which brought Imager under the spotlights of HackerNews and GitHub Explore.

This milestone brings a lot more flexibility in the way you can integrate Imager in your projects.
The library has now a complete set of examples, a proper documentation and continuous integration.

## Features

 * `new Imager` doc
 * JS API documentation
 * Examples for HTML API
 * Implementing dynamic size calculation
 * Imager is now available on `npm` and `bower` registries
 * Regex are replaced by `{width}` interpolation
 * `{pixel_ratio}` helps you to serve dpi specific responsive images
 * Imager constructor accepts either an array, a `NodeList` or a CSS selector string

## Bugfixes

 * Using `opts.hasOwnProperty` instead of `'property' in opts`
 * Removed the override of `window.requestAnimationFrame`


# 0.0.2

## Features

 * Added support for UMD ([PR #41](https://github.com/BBC-News/Imager.js/pull/41))
 * Added experimental lazy loading support ([PR #17](https://github.com/BBC-News/Imager.js/pull/17))
 * Added more demos and tooling to generate responsive images
 * Wraped Imager in IIFE

## Bugfixes

 * add main field to package.json ([PR #29](https://github.com/BBC-News/Imager.js/pull/29))
 * Fix Firefox Bug
 * Couple of typos
 * Remove PubSub implementation.


# 0.0.1

 * Adding initial version

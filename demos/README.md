# Imager.js Demos

This folder contains several demonstrations of how to use Imager.

Prior to run them, you need to clone or download this `git` repository:

```bash
git clone https://github.com/BBC-News/Imager.js.git
cd Imager.js/demos
```

## Standard Demo

This example in a simple use case using [placehold.it](http://placehold.it/) to refrl the configured breakpoints.

### Running the demo

```bash
open default/index.html
```

## Generating Responsives Images with Grunt

This example demonstrates how to use [Grunt](http://gruntjs.com/) to generate your own responsive images
and how to wire them with Imager.

### Requirements

This demo requires the following commands to be run...

```bash
brew install imagemagick graphicsmagick
npm install -g grunt-cli
npm install
```

[Check out `graphicsmagick` install notes for other systems](http://www.graphicsmagick.org/README.html) if needed.

You can also review the `Gruntfile.js` and update the custom sizes that you want to use [according to `grunt-responsive-images` documentation](https://github.com/andismith/grunt-responsive-images#readme)...

```bash
grunt
open grunt/index.html
```

## Lazyloading images

This examples demonstrates how to lazy load responsive images as the user scrolls.

It is a proof of concept rather than a production recommendation.

### Requirements

Please follow the requirements of *Generating Responsives Images with Grunt*.

### Running the demo

```bash
grunt
open lazyload/index.html
```
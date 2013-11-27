# Imager.js [![Build Status](https://secure.travis-ci.org/BBC-News/Imager.js.png?branch=master)](http://travis-ci.org/BBC-News/Imager.js)

> Imager.js is an alternative solution to the issue of how to handle responsive image loading, created by developers at [BBC News](http://responsivenews.co.uk/).


# Why `Imager.js`?

Many responsive images solutions are in the wild: `srcset`, `src-n`, `PictureFill` and so on. They are either
**verbose** or **hard to debug** (and to maintain/integrate). Some of them don't deal well with *pixel density*
and suffers of a **double asset payload**.

We wanted something **simple**, which **works** and which is **fast** and network friendly.

`Imager.js` implements the  [BBC Responsive News technique](http://responsivenews.co.uk/post/50092458307/images):

- loading any image once
- loading the most suitable sized image

# How `Imager.js` works?

`Imager.js` follows this workflow:

- lookup for **placeholder elements**
- replace **placeholders** by images
- update images `src` attribute with the best quality/size ratio URL

It eventually lazy load images to even fasten the page load time.


# Install

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
      <td><a href="https://github.com/BBC-News/Imager.js/archive/master.zip">download zipfile</a></td>
    </tr>
  </tbody>
</table>

# Using

```html
<div style="width: 240px">
  <div class="delayed-image-load" data-src="http://placehold.it/{width}">
</div>

<script src="path/to/Imager.min.js"></script>
<script> new Imager({ availableWidths: [200, 260, 320, 600]}); </script>
```

This will result in that final HTML output:

```html
<div style="width: 240px">
  <img src="http://placehold.it/260" data-src="http://placehold.it/{width}" class="image-replace">
</div>

<script>
  new Imager({ availableWidths: [200, 260, 320, 600]});
</script>
```

`260` has been elected as the best available width as it is the closest upper size relative to `240` pixels.

## Pixel Ratio / HiDPI / Retina


```js

```

## Interpolating `{width}` value


```js

```

## Mixing various image providers


```js

```


# Documentation

## HTML Options

This options are relevant to any element targeted by `Imager.js`.

### `data-src`

Available placeholders are:

- `{width}`
- `{pixel_ratio}`

### `data-width`

`data-width` is the size of the image placeholder (where the actual image will eventually be loaded)


## JavaScript API

### `new Imager([selector|elements, [options]])`

### `Imager.checkImagesNeedReplacing()`

### `Imager.registerResizeEvent()`

### `Imager.registerScrollEvent()`

## JavaScript Options



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

For the purposes of maintaining a distinguishment between the ImageEnhancer concept built by BBC News and this project, we're calling it Imager.js


# Credits

- [Mark McDonnell](http://twitter.com/integralist)
- [Tom Maslen](http://twitter.com/tmaslen)
- [Addy Osmani](http://twitter.com/addyosmani)


# Licence

> Copyright 2013 British Broadcasting Corporation
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

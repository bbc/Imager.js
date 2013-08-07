Based on the ImageEnhancer concept used by BBC news outlined in .net magazine.

- Images on the page will be wrapped in `div`s with a class of `delayed-image` on them. 
- Into these, we load a 1x1 pixel image (perhaps using base64 encoded strings)
- Set the `width` and `height` of the images in these containers to the necessary size. The size needed is set either by the server side or tooling via `data-attr` specified on the `div`.
- Set the class of each image to `image-replaced`
- Use `setTimeout` with a 250-300ms duration to unblock the UI thread and call a `resizeImage` function which enhances the `image-replaced` images as necessary
- Perhaps have an event listener for the resize event which will fire `imager:resize`
- `resizeImage` is called on page load and each time the `imager:resize` event is fired. It loops through `image-replaced`, changing the `src` attribute to a project hosted image URL with the dimensions required for the image. The resize event will check the dimensions of the page to determine if a new URL is to be served.

Actual implementation:

- Use grunt-responsive-images for image generation based on a source directory of them
- Use Imager.js (to be implemented) for the runtime handling of image hot-swapping

Why not srcset/Picturefill polyfills:

- Having reviewed the polyfills for these implementations, the cons outweigh the pros at this point. You either take performance hits or have to deal with 2x image requests, which is counter-intuitive. I'd prefer to just use srcset on its own, but other than WebKit other browsers have yet to implement at this point.

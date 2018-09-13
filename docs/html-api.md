# Imager.js documentation

- [HTML options](html-api.md)
- [JavaScript options](js-options.md)
- [JavaScript API](js-api.md)

## HTML Attributes

The *HTML API* helps you control how Imager works from the *content point of view*.

### `data-src`

Available placeholders are:

- `{width}`: best available image width (numeric value)
- `{pixel_ratio}`: device pixel ratio (either *blank* or `-1.3x`, `-2x`, `-3x` etc.)


So the following HTML...

```html
<img data-src="http://placehold.it/{width}">
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
    <img data-src="http://placehold.it/{width}" data-width="300" data-alt="alternative text">
</div>
```

...is converted to...

```html
<div style="width:600px">
    <img src="http://placehold.it/300" data-src="http://placehold.it/{width}" width="300" alt="alternative text" class="image-replace">
</div>
```
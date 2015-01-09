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

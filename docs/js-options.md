# Imager.js documentation

- [HTML options](html-api.md)
- [JavaScript options](js-options.md)
- [JavaScript API](js-api.md)

## JavaScript Configuration

You can create one or several concurrent configurations of Imager within the same page. Its configuration options are
described below.

### `availableWidths`

This option is intended to reflect the available widths of each responsive image. These values will be used as replacements
for the `{width}` variable in `data-src` placeholders.

The following examples demonstrate the results of passing through different object types for the `availableWidths` option...

`Array`: the widths are represented as numeric values

```js
new Imager({
    availableWidths: [240, 320, 640]
});
```

`Object`: the widths associate a string value for their numeric counterpart

```js
new Imager({
    availableWidths: {
        240: 'small',
        320: 'medium',
        640: 'large'
    }
});
```

`Function`: must return a value for the provided width argument

```js
// will return a double sized image width as a numeric value
new Imager({
    availableWidths: function (image) {
        return image.clientWidth * 2;
    }
});
```

### `availablePixelRatios`

An Array which indicates what are the available pixel ratios available for your responsive images.

These values will be used as replacements for the `{pixel_ratio}` variable in `data-src` placeholders.

```js
new Imager({ availablePixelRatios: [1, 2] });
```

**Default value**: `[1, 2]`

### `className`

A String which indicates what the `className` value will be added on the newly created responsive image.

```js
new Imager({ className: 'image-replace' });
```

**Default value**: `image-replace`

### `scrollDelay`

An Integer value (in milliseconds) to indicate when Imager will check if a scroll has ended. If a scroll has stopped after this delay and the `lazyload` option is `true`, Imager will update the `src` attribute of the relevant images.

**Default value**: `250`

```js
new Imager({ scrollDelay: 250 });
```

**Notice**: set the `scrollDelay` value to `0` at your own risk; unless you know what you're doing, setting the value to zero will make the user experience totally janky! (and that would be an odd thing to do as you have chosen to use Imager to improve the user experience)

### `onResize`

A Boolean value. If set to `true`, Imager will update the `src` attribute of the relevant images.

**Default value**: `true`

```js
new Imager({ onResize: true });
```

### `lazyload`

An *experimental* Boolean value. If set to `true`, Imager will update the `src` attribute only of visible (and nearly visible) images.

**Default value**: `false`

```js
new Imager({ lazyload: true });
```

### `lazyloadOffset`

A `Number` of extra pixels below the fold taken in account by the lazyloading mechanism.

**Default value**: `0`

```js
new Imager({ lazyload: true, lazyloadOffset: 300 });
```

### `onImagesReplaced`

A callback `Function`. Runs after Imager updates the `src` attribute of all relevant images.

Its first and unique argument is an `Array` of `HTMLImageElement`, the ones processed by Imager.

```js
new Imager({
    onImagesReplaced: function(images) {
        console.log('the src of all relevant images has been updated');
    }
});
```

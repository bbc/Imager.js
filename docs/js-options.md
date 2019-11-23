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

**Default value**: `[50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1400, 1600, 1800, 2000]`

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

### `multiplyPixelRatio`

An *experimental* Boolean value. If set to true, the measured width of the container will be multiplied by the device pixel ratio.

For example, with a container of 400px width and device pixel ratio of 2, the computed width will be 800px.

This option should be disabled if requesting images with the `{pixel_ratio}` placeholder.

**Default value**: `true`

```js
new Imager({ multiplyPixelRatio: false });
```

### `sourceAttribute`

The attribute to get the src url from. Useful if `data-src` is already being used.

**Default value**: `data-src`

```js
new Imager({ sourceAttribute: 'data-src-url' });
```

### `targetAttribute`

The attribute to set with the computed url. Useful if you don't want to set src yet or want to do other processing.

**Default value**: `src`

```js
new Imager({ targetAttribute: 'data-src-new' });
```

### `useClientWidth`

Set whether Imager should use the  page width rather than `img` container width. Useful for images that are to be displayed full screen.

**Default value**: `false`

```js
new Imager({ useClientWidth: true });
```

### `conditional`

An object to specify a second target selector to conditionally be set based on whether a class is present.

If `conditional.selector` is present on the image, then `conditional.targetAttribute` will also be set. 

Used for cases where lazyloading has already happened.

**Default value**: `false`

```js
new Imager({ conditional: {
                selector: 'lazyloaded',
                targetAttribute: 'src'
            } });
```

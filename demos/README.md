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
<div class="delayed-image-load" data-src="Assets/Images/Generated/A-320.jpg" data-width="1024" alt="alternative text A"></div>
<div class="delayed-image-load" data-src="Assets/Images/Generated/B-320.jpg" data-width="1024" alt="alternative text B"></div>
<div class="delayed-image-load" data-src="Assets/Images/Generated/C-320.jpg" data-width="1024" alt="alternative text C"></div>
```

You can then pass those image sizes through to Imager.js along with a regex for Imager to parse the information...

```js
var imager = new Imager({
    availableWidths: [320, 640, 1024]
});
```

For full details of the Grunt task options see the [grunt-responsive-images](https://github.com/andismith/grunt-responsive-images/) repo on GitHub.

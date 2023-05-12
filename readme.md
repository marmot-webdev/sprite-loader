# sprite-loader

`sprite-loader` is a small, standalone JavaScript module that loads SVG sprites asynchronously and stores them in the browser's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). This enables the sprites to be reused across multiple pages without making additional server requests, which can improve the performance and user experience of your website.

## Installation

To install `sprite-loader`, use the following command:

```js
npm install @marmot-webdev/sprite-loader
```

Alternatively, you can include the `sprite-loader.min.js` script in your HTML:

```html
<script src="path/to/sprite-loader.min.js"></script>
```

## Usage

### Basic example

```js
import SpriteLoader from '@marmot-webdev/sprite-loader';

const spriteLoader = new SpriteLoader({
  sprites: {
    global: ['core.svg', 'flags.svg'].map(name => ({ basename: name }))
  },
  dirname: 'assets/sprites/'
});
```

### Advanced example

```js
import SpriteLoader from '@marmot-webdev/sprite-loader';

const spriteLoader = new SpriteLoader({
  sprites: {
    global: [
      {
        root: 'https://cdn.example.com/',
        dirname: 'path/to/sprite/',
        basename: 'core.svg?v=1.0'
      },
      {
        basename: 'flags.svg',
        prefix: 'xyz-',
        onload(spriteURL) {
          console.log(`The sprite "flags.svg" has been loaded from ${spriteURL.href}.`);
        }
      }
    ],
    local: [
      {
        basename: 'contacts.svg'
      }
    ]
  },
  dirname: 'assets/sprites/',
  prefix: 'abc-'
});
```

## Options

The available options are:

```js
{
  container: null,
  extractor: null,
  sprites: {
    global: [],
    local: []
  },
  root: '',
  dirname: '',
  extname: '.svg',
  prefix: '',
  onload: null
}
```

### sprites.global

Type: `array`\
Default: `[]`

An array of objects representing the sprites that are available for all pages. Each object should have the property `basename` (the name of a sprite). The optional properties may include `root`, `dirname`, `extname`, `prefix`, and `onload`, and if they are provided, they take precedence over the corresponding general options.

### sprites.local

Type: `array`\
Default: `[]`

An array of objects representing the sprites that are available for specific pages. In order for the script to know which sprites to load from this array, the page must have a `data-sprites` attribute that includes a list of sprite names. You can refer to the `extractor` option for more details.

The rest of the description is identical to the `sprites.global` property.

### root

Type: `string`\
Default: `''`

The root URL to use when loading the sprite. If you're hosting your files on a Content Delivery Network (CDN), you can set the `root` property to the base URL of the CDN. Defaults to `document.baseURI`.

### dirname

Type: `string`\
Default: `''`

A directory containing the sprites.

### extname

Type: `string`\
Default: `'.svg'`

The `extname` property is used to specify the file extension of a sprite. In theory, you can load any type of text file, not just sprites.

### prefix

Type: `string`\
Default: `''`

A string that is prepended to the sprite's `basename` to create a unique key for caching the sprite content in local storage.

### container

Type: `function`\
Default: `null`

A function that returns the container element to use for the sprites. Defaults to a function that creates a `<div>` element and prepends it to the document body.

**Note:** You may want to override it if your icons contain [gradients](https://github.com/emilbjorklund/svg-weirdness/issues/12).

An example of a custom implementation:

```js
container: () => document.querySelector('#sprite-container')
```

### extractor

Type: `function`\
Default: `null`

A function that extracts the names of the local sprites that will be used. Defaults to a function that searches for a `data-sprites` attribute on the `<html>` element. The attribute's value is then split by `|` to extract the sprite names.

```html
<html data-sprites="categories|contacts">...</html>
```

An example of your own implementation:

```html
<html data-sprites='["categories", "contacts"]'>...</html>
```

```js
extractor: () => {
  try {
    return JSON.parse(document.documentElement.dataset.sprites);
  } catch (e) {
    return [];
  }
}
```

### onload

Type: `function`\
Default: `null`

A callback function that is called after all sprites have been loaded and inserted into the DOM.

## Copyright and license

Copyright (c) 2023—present, Serhii Babakov.

The library is [licensed](/LICENSE) under [The MIT License](https://opensource.org/licenses/MIT).
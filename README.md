# PostCSS Extract Styles [![Build Status][ci-img]][ci] [![npm](https://img.shields.io/npm/v/postcss-extract-styles.svg)](https://www.npmjs.com/package/postcss-extract-styles)

[PostCSS] plugin that extracts styles from css based on decelerations matching..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/felixmosh/postcss-extract-styles.svg
[ci]:      https://travis-ci.org/felixmosh/postcss-extract-styles

```css
.wix-tpa {
	color: {{color-1}};
	margin-left: 10px;
}
```
```css
// remain
.wix-tpa {
  margin-left: 10px;
}
```
```css
// extracted
.wix-tpa {
  color: {{color-1}};
}
```

## Usage

```js
const options = {
  pattern: /{{[^\}]+}}/g
};
postcss([ require('postcss-extract-styles')(options) ])
  .then((result) => {
     result.css // will be the "remain" part
     result.extracted // will be the "extracted" part
  });
```

See [PostCSS] docs for examples for your environment.

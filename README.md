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
```javascript
// when remove = true
```
```css
.wix-tpa {
  margin-left: 10px;
}
```
```javascript
// when remove = false
```
```css
.wix-tpa {
  color: {{color-1}};
}
```

## Usage

```js
const options = {
  pattern: /{{[^\}]+}}/g,
  remove: true // default true
};
postcss([ require('postcss-extract-styles')(options) ])
```

See [PostCSS] docs for examples for your environment.

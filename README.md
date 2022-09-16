# Remark Link Rewrite Plugin

A plugin for Remark to rewrite links by a given function. This is useful for example to rewrite links to a different domain or to rewrite links to a different file extension.

## Installation

This package is ESM only. In Node.js (version 12.20+, 14.14+, or 16.0+), install with npm:

```bash
npm install remark-link-rewrite
```

## Usage

```javascript
import { remark } from 'remark';
import RemarkLinkRewrite from 'remark-link-rewrite';

remark()
  .use(RemarkLinkRewrite, {
    replacer: (url) => {
      if (url.startsWith('https://example.com')) {
        return url.replace('https://example.com', 'https://example.org')
      }
      return url
    }
  })
  .process('[Example](https://example.com)')
  .then(({ value }) => {
    console.log(String(value))
  });
```

## Options

- `replacer` - A function that takes a URL and returns a new URL. This function will be called for every link in the document.

## License

[MIT](LICENSE)

# Remark Link Rewrite Plugin

A plugin for Remark to rewrite links by a given function. This is useful for example to rewrite links to a different domain or to rewrite links to a different file extension.

## Installation

```bash
npm install remark-link-rewrite
```

## Usage

```javascript
const remark = require('remark')
const linkRewrite = require('remark-link-rewrite')

remark()
  .use(linkRewrite, {
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
  })
```

## Options

- `replacer` - A function that takes a URL and returns a new URL. This function will be called for every link in the document.

## License

[MIT](LICENSE)

# Remark Link Rewrite Plugin

The Remark Link Rewrite Plugin is a utility for the Remark processor that enables you to customize link URLs dynamically. You can use it to change the domain of links, modify file extensions, or apply any other transformation required by your specific use case.

## Requirements

This package uses ECMAScript modules (ESM) and requires Node.js versions 12.20+, 14.14+, or 16.0+.

## Installation

This package is ESM only. In Node.js (version 12.20+, 14.14+, or 16.0+), install with npm:

```bash
npm install remark-link-rewrite
```

## Basic Usage

Here's a simple example of how to use the plugin to replace links that start with `https://example.com` to `https://example.org`.

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

## Usage with Asynchronous Replacer

You can also use the plugin with an asynchronous replacer function. Here's an example where the replacer fetches a new URL from an API or a database.

```javascript
import { remark } from 'remark';
import RemarkLinkRewrite from 'remark-link-rewrite';

// example async function to fetch a URL from an API or database
async function fetchFromAPI(url) {
  return 'https://example.org'

  // example:
  // const response = await fetch('/my-api', {
  //   method: 'POST',
  //   body: JSON.stringify({ url }),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  // return response.url
}

remark()
  .use(RemarkLinkRewrite, {
    replacer: async (url) => {
      if (url.startsWith('https://example.com')) {
        const resolvedURL = await fetchFromAPI(url);
        return url.replace('https://example.com', resolvedURL);
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

- `replacer`: A function that receives a URL and returns a new URL. It gets called for every link in the document. This function can be synchronous or asynchronous.

## License

[MIT License](LICENSE)

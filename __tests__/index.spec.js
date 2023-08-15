import { remark } from 'remark';
import { promisify } from 'util';
import linkRewrite, { replaceAsync, rewriteJSXURL } from '../src';

const sleep = promisify(setTimeout);
const random = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

async function run(input, options) {
  const processor = remark().use(linkRewrite, options);
  const { value } = await processor.process(input);
  return value;
}

describe('remark-link-rewrite', () => {
  it('should return the same value if no replacer is provided', async () => {
    const input = '[Example](https://example.com)';
    const output = await run(input);
    expect(output).toMatch(input);
  });

  it('should return the new value with the custom replacer', async () => {
    const input = '[Example](https://example.com)';
    const output = await run(input, {
      replacer: (url) => {
        if (url.startsWith('https://example.com')) {
          return url.replace('https://example.com', 'https://example.org');
        }
        return url;
      },
    });
    expect(output).toMatch('[Example](https://example.org)');
  });

  it('should return the new value with the custom replacer with resolving the new value async', async () => {
    async function replaceGoogleWithBing(url) {
      if (url === 'https://www.google.com') {
        await sleep(200);
        return 'https://www.bing.com';
      }
      return url;
    }

    const input = '[Example](https://www.google.com)';
    const output = await run(input, { replacer: replaceGoogleWithBing });
    expect(output).toMatch('[Example](https://www.bing.com)');
  });

  it('should replace html/jsx nodes', async () => {
    const input = '<a href="https://example.com">Example</a>';
    const output = await run(input, {
      replacer: (url) => {
        if (url.startsWith('https://example.com')) {
          return url.replace('https://example.com', 'https://example.org');
        }
        return url;
      },
    });
    expect(output).toMatch('<a href="https://example.org">Example</a>');
  });
});

describe('util: replaceAsync', () => {
  it('should do string replacement: `foo` with `bar`', async () => {
    const input = 'foo bar baz qux';
    const output = await replaceAsync(input, 'foo', async () => 'bar');
    expect(output).toMatch('bar bar baz qux');
  });

  it('should do regex replacement: `/foo/g` with `bar`', async () => {
    const input = 'foo bar baz qux';
    const output = await replaceAsync(input, /foo/g, async () => 'bar');
    expect(output).toMatch('bar bar baz qux');
  });

  it('should run async replacement simultaneously', async () => {
    const input = 'foo bar foo bar';
    const startTime = new Date().getTime();
    const output = await replaceAsync(input, /foo/g, async () => {
      await sleep(random(200, 500));
      return 'bar';
    });
    const totalTime = new Date().getTime() - startTime;

    expect(output).toMatch('bar bar bar bar');
    // the total time should be the longest sleep time
    expect(200 <= totalTime && totalTime <= 500).toBeTruthy();
  });
});

describe('util: rewriteJSXURL', () => {
  it('should replace `example.com` with `example.org` in HTML like structure', async () => {
    const input = '<a href="https://example.com">Link</a>';
    const expected = '<a href="https://example.org">Link</a>';

    const output = await rewriteJSXURL(input, async url => {
      if (url.startsWith('https://example.com')) {
        return url.replace('https://example.com', 'https://example.org');
      }
      return url;
    });
    expect(output).toMatch(expected);
  });
});

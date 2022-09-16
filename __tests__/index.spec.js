import { remark } from 'remark';
import { promisify } from 'util';
import linkRewrite from '../src';

const sleep = promisify(setTimeout);

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
          return url.replace('https://example.com', 'https://example.org')
        }
        return url
      }
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
    const output = await run(input, {replacer: replaceGoogleWithBing});
    expect(output).toMatch('[Example](https://www.bing.com)');
  });
});

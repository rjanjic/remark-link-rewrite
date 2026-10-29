import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

export type Replacer = (url: string) => string | Promise<string>;

export interface RemarkLinkRewriteOptions {
  replacer: Replacer;
}

type LinkNode = Node & { type: 'link'; url: string };
type HtmlNode = Node & { type: 'jsx' | 'html'; value: string };

/**
 * Default replacer.
 * @param url
 */
const defaultReplacer: Replacer = async url => url;

/**
 * Replace all matches in a string asynchronously.
 * @param str
 * @param regex
 * @param asyncFn
 * @returns {Promise<*>}
 */
export const replaceAsync = async function(str: string, regex: string | RegExp, asyncFn: (match: string, ...args: unknown[]) => string | Promise<string>): Promise<string> {
  const promises: (string | Promise<string>)[] = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
    return '';
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift()!);
};

/**
 * Rewrite the URL in a JSX node.
 * @param value
 * @param replacer
 * @returns {Promise<*>}
 */
export const rewriteJSXURL = async (value: string, replacer: Replacer): Promise<string> => replaceAsync(value, /href="(.*?)"/g, async (_match, url) => {
  const newUrl = await replacer(url as string);
  return `href="${newUrl}"`;
});

/**
 * Rewrite the URL in a Markdown node.
 * @param options
 * @returns {function(*): Promise<*>}
 */
function RemarkLinkRewrite(options: RemarkLinkRewriteOptions = { replacer: defaultReplacer }) {
  const { replacer } = options;
  return async (tree: Node): Promise<Node> => {
    const nodes: (LinkNode | HtmlNode)[] = [];

    visit(tree, node => {
      if (node.type === 'link') {
        nodes.push(node as LinkNode);
      }
      if (node.type === 'jsx' || node.type === 'html') {
        if (/<a.*>/.test((node as HtmlNode).value)) {
          nodes.push(node as HtmlNode);
        }
      }
    });

    await Promise.all(nodes.map(async node => {
      if (node.type === 'link') {
        node.url = await replacer(node.url);
      }
      if (node.type === 'jsx' || node.type === 'html') {
        node.value = await rewriteJSXURL(node.value, replacer);
      }
    }));
    return tree;
  };
}

export default RemarkLinkRewrite;

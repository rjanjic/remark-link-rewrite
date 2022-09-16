import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { browser, main, module } from './package.json';

export default [
    {
        input: 'src/index.js',
        output: {
            name: 'remarkLinkRewrite',
            file: browser,
            format: 'umd',
        },
        plugins: [json(), resolve(), commonjs()],
    },
    {
        input: 'src/index.js',
        external: ['unist-util-visit'],
        output: [
            { file: main, format: 'cjs', exports: 'default' },
            { file: module, format: 'esm' },
        ],
        plugins: [json()],
    }
];

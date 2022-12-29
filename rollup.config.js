import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import cleanup from 'rollup-plugin-cleanup';
import postcss from 'rollup-plugin-postcss';

import { readFileSync } from 'fs';
import path from 'path';
const packageJson = JSON.parse(readFileSync(path.resolve('package.json')));
const version = packageJson.version;
const outDir = `dist/@${version}/out`;

export default [
    {
        input: 'src/pie3d.js',
        output: `${outDir}/pie3d.js`,
        cssExtract: 'pie3d.css',
        name: 'Pie3D'
    },
    {
        input: 'example/test.js',
        output: `${outDir}/test/test.js`,
        cssExtract: 'test.css',
        name: 'Test'
    }
].map((o) => {
    return {
        external: ['d3'],
        input: o.input,
        output: {
            globals: {
                d3: 'd3'
            },
            file: o.output,
            format: 'iife',
            name: o.name,
            generatedCode: {
                arrowFunctions: true,
                constBindings: true,
                objectShorthand: true,
                preset: 'es2015',
                reservedNamesAsProps: true,
                symbols: true
            },
            inlineDynamicImports: true
        },
        plugins: [
            nodeResolve({
                mainFields: ['module', 'jsnext:main', 'browser'],
                extensions: ['.mjs', '.js', '.ts', '.json', '.node']
            }),
            commonjs(),
            postcss({
                extract: o.cssExtract
            }),
            sucrase({
                exclude: ['node_modules/**'],
                transforms: ['typescript']
            }),
            cleanup({
                comments: 'all',
                lineEndings: 'win',
                maxEmptyLines: 1
            })
        ]
    };
});

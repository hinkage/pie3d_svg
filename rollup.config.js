import ignore from 'rollup-plugin-ignore';
import nodeResolve from 'rollup-plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import cleanup from 'rollup-plugin-cleanup';
import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload';
import prettier from 'rollup-plugin-prettier';

export default [
    {
        external: ['d3'],
        input: 'src/pie3d.js',
        output: {
            file: 'dist/pie3d.js',
            format: 'umd',
            name: 'Pie3D',
            globals: {
                d3: 'd3'
            },
            generatedCode: {
                arrowFunctions: true,
                constBindings: true,
                objectShorthand: true,
                preset: 'es2015',
                reservedNamesAsProps: true,
                symbols: true
            }
        },
        plugins: [
            ignore(['d3']),
            nodeResolve({
                mainFields: ['jsnext:main', 'module']
            }),
            styles({
                mode: 'inject'
            }),
            cleanup({
                comments: 'all',
                lineEndings: 'win',
                maxEmptyLines: 1
            }),
            prettier({
                trailingComma: 'none',
                useTabs: false,
                tabWidth: 4,
                semi: true,
                singleQuote: true,
                printWidth: 80
            }),
            serve({
                contentBase: [''],
                open: true,
                openPage: '/example/test.html'
            })
            // livereload({
            //     watch: ['dist', 'example']
            // })
        ]
    }
];

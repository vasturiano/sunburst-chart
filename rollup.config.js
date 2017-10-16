import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: [
        {
            format: 'umd',
            name: 'Sunburst',
            file: 'dist/sunburst-chart.js',
            sourcemap: true
        },
        {
            format: 'es',
            file: 'dist/sunburst-chart.mjs'
        }
    ],
    plugins: [
        nodeResolve(),
        commonJs(),
        babel({
            presets: [
                ["es2015", { "modules": false }]
            ],
            plugins: ["external-helpers"],
            babelrc: false
        })
    ]
};
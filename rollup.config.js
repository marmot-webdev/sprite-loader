import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import banner from './banner.js';

export default [
  {
    input: './src/index.js',
    output: [
      {
        banner: banner,
        name: 'SpriteLoader',
        file: './dist/sprite-loader.js',
        format: 'iife'
      },
      {
        banner: banner,
        name: 'SpriteLoader',
        file: './dist/sprite-loader.min.js',
        format: 'iife',
        plugins: [terser()]
      }
    ],
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: 'defaults, iOS >= 13, Safari >= 13'
          }]
        ]
      })
    ]
  }
];

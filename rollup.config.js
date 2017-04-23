import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

// rollup.config.js
export default {
  entry: 'src/index.js',
  moduleName: 'conformant',
  format: 'umd',
  dest: 'conformant.js', // equivalent to --output
  sourceMap: true,
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      babelrc: false,
      presets: [
        ['latest', {
          es2015: {
            modules: false
          }
        }]
      ],
      plugins: [
        'transform-object-rest-spread',
        'external-helpers'
      ]
    })
  ]
}


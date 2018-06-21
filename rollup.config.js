import path from 'path'
import fs from 'fs'

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

import pkg from './package.json'

const SRC_PATH = 'src'
const DIST_PATH = 'dist'

const FILES_FILTERS = ['constants', 'index']

function getBuild(file, outputType = null) {
  outputType = outputType || 'default'

  const outputs = {
    browser: {
      name: file.browserName,
      file: file.main,
      format: 'umd',
      sourcemap: true,
    },
    default: [
      { file: file.main, format: 'cjs', sourcemap: true },
      { file: file.module, format: 'es', sourcemap: true },
    ],
  }

  const plugins = {
    browser: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
      commonjs(),
    ],
    default: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs(),
    ],
  }

  return {
    input: file.input,
    output: outputs[outputType],
    plugins: plugins[outputType],
  }
}

function getBuildForFile(filePath) {
  const fileName = path.basename(filePath, '.js')

  return getBuild({
    input: path.join(SRC_PATH, `${fileName}.js`),
    main: path.join(DIST_PATH, `${fileName}.js`),
    module: path.join(DIST_PATH, `${fileName}.esm.js`),
  })
}

const modules = [
  getBuild(
    {
      input: 'src/index.js',
      main: pkg.browser,
      browserName: 'vtex.deliveryPackages',
    },
    'browser'
  ),
  getBuild({ input: 'src/index.js', main: pkg.main, module: pkg.module }),
]

fs.readdirSync(SRC_PATH).forEach(filePath => {
  const fileName = path.basename(filePath, '.js')

  if (FILES_FILTERS.indexOf(fileName) !== -1) {
    return
  }

  modules.push(getBuildForFile(filePath))
})

export default modules

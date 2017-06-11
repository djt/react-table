/* global __dirname, require, module*/
import Webpack from 'webpack'
import path from 'path'

let libraryName = 'library';
let plugins = [], outputFile;

outputFile = libraryName + '.js';

export default {
  entry: __dirname + '/src/'+libraryName+'.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: (/node_modules/),
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./src'), path.join(__dirname, 'node_modules')],
  },
  externals: {
    react: 'react',
    'prop-types': 'prop-types'
  },
  plugins: []
};
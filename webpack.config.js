/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

const path = require('path');
 const webpack = require('webpack');


const config = {

  context: __dirname,

  entry: [
    './src/httpTest.js',
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',   //默认为: /dist/
    filename: '[name].js',
    namedChunkFilename: '[name].js',
    sourcePrefix: '  ',
  },

  stats: {
    colors: true,
    timings: true,
  },
  plugins: [


  ],

  module: {
    loaders: [

        {
            test: /\.json$/,
            loader: 'json'
        }

    ],
  },


};
module.exports = config;

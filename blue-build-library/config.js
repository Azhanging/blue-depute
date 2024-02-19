const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

const {
  library,
  webpackConfig
} = require('../blue-build-config');


//development
/*
if ( module.hot ) {
  module.hot.accept()
}
* */

const dev = {
  entry: {
    app: './src/index',
  },
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    filename: 'js/[name].js',
    publicPath: './'
  },
  //dev sever
  devServer: {
    host: 'localhost',
    inline: true,
    hot: true,
    progress: false,
    compress: false,
    port: 5000,

    //server root path
    contentBase: path.join(__dirname, '../'),

    //server static root path publicPath + output.publicPath + filename
    publicPath: '/'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `index.html`,
      inject: 'head',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
};

//production
const prod = {
  watch: true,
  watchOptions: {
    aggregateTimeout: 500
  },
  entry: {
    [`${library.name}`]: './src/index',
    [`${library.name}.min`]: './src/index',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: './static'
  },
  plugins: [
    new webpack.BannerPlugin(
      `
${library.name}.js ${library.version}
(c) ${library.date} ${library.author}
Released under the MIT License.
${library.github}
time:${new Date().toUTCString()}
`),
    /*new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'index.html',
      inject: "head",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),*/
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      include: /\.min\.js$/,
      sourceMap: true,
      parallel: true
    })
  ],
};

module.exports = {
  dev: merge(dev, webpackConfig.dev),
  prod: merge(prod, webpackConfig.prod)
};
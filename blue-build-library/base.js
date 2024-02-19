const path = require('path');

module.exports = {
  mode: "none",
  devtool: 'source-map',
  //file start path
  context: path.resolve(__dirname, '../'),
  output: {
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  //alias path
  resolve: {
    extensions: ['.js', '.ts']
  },
  // devDependencies require no in entry
  externals: {},
  // use loader
  module: {
    unknownContextCritical: false,
    rules: [{
      test: /\.html$/,
      use: ['html-loader']
    }, {
      test: /\.ts$/,
      use: ['ts-loader']
    }, {
      test: /\.js$/,
      use: ['babel-loader']
    }]
  }
};
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './source/client/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'eslint-loader',
          'babel-loader'
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};

const path = require('path'); // CommonJS

module.exports = {
  mode: 'production',
  entry: './module/main.js',
  output: {
    path: path.resolve(__dirname, 'bundle', 'assets', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  devtool: 'source-map'
}
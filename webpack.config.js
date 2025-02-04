const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "crypto": false,
      "stream": false,
      "http": false,
      "https": false,
      "child_process": false,
      "net": false,
      "tls": false,
      "url": false,
      "zlib": false,
      "assert": false,
      "util": false,
      "buffer": false,
      "process": false
    }
  },
  externals: {
    'obsidian': 'commonjs2 obsidian'
  }
};

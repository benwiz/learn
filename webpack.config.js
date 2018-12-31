const Path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: Path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Boba',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [require.resolve('babel-preset-es2015')],
        },
      },
      {
        test: /\.wasm$/,
        loaders: ['wasm-loader'],
      },
    ],
  },
  node: {
    fs: 'empty',
  },
};

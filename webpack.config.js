const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const WorkerPlugin = require('worker-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src'),
  watch: true,

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },

  devServer: {
    publicPath: "/",
    contentBase: path.resolve(__dirname, "dist")
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin([
      { from: "./public" }
    ]),
    new WorkerPlugin()
  ]
};
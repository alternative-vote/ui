const path            = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry         : './src/index.jsx',
  output        : {
    filename   : './dest/bundle.js'
  },
  resolve       : {
    extensions : ['', '.webpack.js', '.web.js', '.ts', '.js'],
    fallback   : path.join(__dirname, 'node_modules')
  },
  resolveLoader : { fallback : path.join(__dirname, 'node_modules') },
  module        : {
    loaders : [
      {
        test   : /\.styl$/,
        loader : ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
      },
      {
        test    : /.jsx?$/,
        loader  : 'babel-loader',
        exclude : /node_modules/,
        query   : {
          presets : [
            'babel-preset-es2015',
            'babel-preset-react',
          ].map(require.resolve)
        }
      }
    ]
  },
  plugins       : [
    new ExtractTextPlugin('./dest/bundle.css')
  ],
  devServer     : {
    historyApiFallback : true,
  },
  devtool       : 'source-map',
}

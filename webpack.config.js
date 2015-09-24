var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");

module.exports = {
  entry: "./app/assets/javascripts/app.js",
  output: {
    path: path.join(__dirname, "public/assets"),
    filename: "app.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".js.jsx"]
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: "eslint-loader",
        exclude: /(node_modules)/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, "app/assets/javascripts"),
        exclude: /(node_modules)/,
        loader: "babel",
        query: {
          optional: ['es7.classProperties', 'es7.objectRestSpread']
        }
      },
      {
        test: /\.woff$/,
        loader: require.resolve('file-loader'),
        query: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css-loader!postcss-loader")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader")
      },
      {
        test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  },
  eslint: {
    emitWarning: true,
    emitError: true,
    failOnWarning: true,
    failOnError: true
  },
  plugins: [
    new ExtractTextPlugin("app.css", { allChunks: true })
  ],
  stats: {
    children: false
  },
  postcss: [ autoprefixer({ browsers: ['ie >= 9', 'last 2 versions'] }) ]
};

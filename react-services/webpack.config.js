"use strict";
var webpack = require("webpack");
var path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "lib"),
    filename: "react-services.js",
    publicPath: "/lib/",
    library: "react-services",
    libraryTarget: "umd",
    umdNamedDefine: true // Important
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "react"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "react-dom"
    },
    mobx: {
      commonjs: "mobx",
      commonjs2: "mobx",
      amd: "mobx",
      root: "mobx"
    },
    "mobx-react": {
      commonjs: "mobx-react",
      commonjs2: "mobx-react",
      amd: "mobx-react",
      root: "mobx-react"
    },
    "mobx-state-tree": {
      commonjs: "mobx-state-tree",
      commonjs2: "mobx-state-tree",
      amd: "mobx-state-tree",
      root: "mobx-state-tree"
    },
    moment: {
      commonjs: "moment",
      commonjs2: "moment",
      amd: "moment",
      root: "moment"
    }
  },
  optimization: {
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.js$/, //Check for all js files
        use: [
          {
            loader: "babel-loader",
            options: { babelrcRoots: [".", "../"] }
          }
        ],
        exclude: /(node_modules|bower_compontents)/
      },
      {
        test: /\.(css|sass|scss)$/, //Check for sass or scss file names
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.json$/,
        loader: "json-loader" //JSON loader
      }
    ]
  },
  plugins: [new BundleAnalyzerPlugin()],
  //To run development server
  devServer: {
    contentBase: __dirname
  }
};

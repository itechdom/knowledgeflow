"use strict";
var webpack = require("webpack");
var path = require("path");
module.exports = env => {
  console.log("env", env);
  const base = path.resolve(__dirname, "./platforms/browser/www");
  const js = path.resolve(__dirname, "./platforms/browser/www/js");
  return {
    entry: {
      index: "./index.js"
    },
    output: {
      path: base,
      chunkFilename: "[name].bundle.js",
      filename: "[name].js"
    },
    optimization: {
      // We no not want to minimize our code.
      minimize: false
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
          test: /\.jsx$/, //Check for all js files
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
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                publicPath:
                  env && env.production ? "/playground/dist/" : "dist/"
              }
            },
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true // webpack@2.x and newer
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/"
              }
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        Styles: path.resolve(__dirname, "./src/App.styles.js"),
        Orbital: path.resolve(__dirname, "./orbital"),
        Assets: path.resolve(
          __dirname,
          "./orbital-templates-pro/Material-Pro/_shared/material-kit-pro-react-v1.7.0/src/assets"
        ),
        Views: path.resolve(
          __dirname,
          "./orbital-templates-pro/Material-Pro/_shared/material-kit-pro-react-v1.7.0/src/views"
        ),
        Components: path.resolve(
          __dirname,
          "./orbital-templates-pro/Material-Pro/_shared/material-kit-pro-react-v1.7.0/src/components"
        ),
        Theme: path.resolve(__dirname, "./src/theme.js"),
        react: path.resolve(__dirname, "./node_modules/react"),
        Config: env
          ? env.production
            ? path.resolve(__dirname, "./config/prod.js")
            : path.resolve(__dirname, "./config/qa.js")
          : path.resolve(__dirname, "./config/index.js"),
        Store: path.resolve(__dirname, "./Orbital/Store"),
        "@material-ui/styles": path.resolve(
          "./node_modules/@material-ui/styles"
        )
      }
    },
    //To run development server
    devServer: {
      contentBase: base,
      disableHostCheck: true // That solved it
    },
    devtool: "eval-source-map"
  };
};

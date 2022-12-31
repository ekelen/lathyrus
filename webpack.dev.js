const common = require("./webpack.common.js");
let { merge } = require("webpack-merge");

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Lathyrus Dev",
      template: "./index.html",
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    static: path.resolve(__dirname, "./build"),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|woff2?)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "./src"),
        exclude: [/node_modules/, /\.test\.js(x)?$/],
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        ],
      },
    ],
  },
});

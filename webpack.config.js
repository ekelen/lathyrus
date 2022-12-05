const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  devtool: "inline-source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: "./index.html",
    }),
  ],
  devServer: {
    static: "./build",
    hot: true,
  },
  //   optimization: {
  //     runtimeChunk: "single",
  //   },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "./src"),
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};

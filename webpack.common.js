const path = require("path");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
};

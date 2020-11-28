// webpack.config.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common")
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  node: { fs: "empty" },
  devServer: {
    contentBase: path.join(__dirname, "public/")
  },
});

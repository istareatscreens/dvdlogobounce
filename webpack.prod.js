const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  entry: "./src/index.js",
  mode: "production",
  devtool: 'source-map',
  node: { fs: "empty" }
});
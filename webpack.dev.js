// webpack.config.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common")
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public/"),
    },
    open: false,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }

});

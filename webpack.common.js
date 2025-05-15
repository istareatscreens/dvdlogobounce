// webpack.config.js

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    node: { fs: "empty" },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'assets/[name].[hash].[ext]',
                },
            },
            {
                test: /\.wasm$/,
                type: "javascript/auto",  // Disables Webpack’s default handling for .wasm
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "wasm/[name].[hash].[ext]",
                        },
                    },
                ],
            }
        ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/",
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './assets/faviconr.png',
            inject: true,
        }),
        new CleanWebpackPlugin(),
    ],
};
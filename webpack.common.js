// webpack.config.js

const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    node: { fs: "empty" },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: { name: '[name].[ext]?[hash]' },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                options: { name: '[name].[ext]?[hash]' },
            },
            {
                test: /\.wasm$/,
                type:
                    "javascript/auto" /** this disables webpacks default handling of wasm */,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[hash].[ext]",
                            publicPath: "/dist/"
                        }
                    }
                ]
            }
        ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "public/dist/"),
        publicPath: "/dist/",
        filename: "bundle.js",
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
};

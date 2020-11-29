// webpack.config.js

const path = require("path");
const webpack = require("webpack");

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
                test: /\.s?css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "images",
                        },
                    },
                ],
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
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename: "bundle.js",
    },
};

const path = require("path");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
    },
    entry: {
        main: "./main.js",
        room: "../static/ts/rooms/room.ts",
        index: "../static/ts/rooms/index.ts",
        roomCreate: "../static/ts/rooms/roomCreate.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "bundles"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: require.resolve("jquery"),
                use: [
                    {
                        loader: "expose-loader",
                        options: "jQuery",
                    },
                    {
                        loader: "expose-loader",
                        options: "$",
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};

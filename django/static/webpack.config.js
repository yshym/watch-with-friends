const path = require("path");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
    },
    entry: {
        main: "./js/main.js",
        room: "./ts/rooms/room.ts",
        index: "./ts/rooms/index.ts",
        roomCreate: "./ts/rooms/roomCreate.ts",
        HLSFileWaiter: "./ts/rooms/HLSFileWaiter.ts",
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

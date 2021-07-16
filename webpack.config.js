const NodeWebExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: "./index.js",
    output: {
        filename: 'index.js',
        path: `${__dirname}/dist`,
    },

    externals: [
        NodeWebExternals(),
    ],
}
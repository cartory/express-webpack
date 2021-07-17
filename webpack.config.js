const NodeWebExternals = require("webpack-node-externals");

require('dotenv').config()

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/index.js",
    output: {
        filename: 'index.js',
        path: `${__dirname}/dist`,
    },

    externals: [
        NodeWebExternals(),
    ],
}
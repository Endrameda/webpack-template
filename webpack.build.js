// node modules
const path = require('path');

// plugins
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MergeWebpack = require('webpack-merge');

// settings
const settings = require('./webpack.settings');
const CommonWebpackConfig = require('./webpack.common');

module.exports = MergeWebpack(CommonWebpackConfig.buildConfig, {
    mode: 'production',
    context: path.resolve(__dirname, settings.paths.src.base),
    entry: {
        app: ['@babel/polyfill', './js/app.js'],
    },
    output: {
        filename: `${settings.paths.assets.js}/[name].[hash].js`,
        path: path.resolve(__dirname, settings.paths.dist)
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
});
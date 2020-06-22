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
    output: {
        filename: `${settings.paths.dist.js}/[name].[hash].js`,
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
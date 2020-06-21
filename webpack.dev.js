// node modules
const path = require('path');

// plugins
const MergeWebpack = require('webpack-merge');

// settings
const settings = require('./webpack.settings');
const CommonWebpackConfig = require('./webpack.common');

module.exports = MergeWebpack(CommonWebpackConfig.devConfig, {
    mode: 'development',
    output: {
        filename: `${settings.paths.dist.js}/[name].js`,
    },
    devServer: {
        port: 4000,
        overlay: true,
        hot: true
    },
    devtool: 'source-map',
})
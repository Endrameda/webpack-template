// node modules
const path = require('path');

// plugins
const MergeWebpack = require('webpack-merge');

// settings
const settings = require('./webpack.settings');
const CommonWebpackConfig = require('./webpack.common');

module.exports = MergeWebpack(CommonWebpackConfig.devConfig, {
    mode: 'development',
    context: path.resolve(__dirname, settings.paths.src.base),
    entry: {
        app: ['@babel/polyfill', './js/app.js'],
    },
    output: {
        filename: `${settings.paths.assets.js}/[name].js`,
        path: path.resolve(__dirname, settings.paths.dist),
    },
    devServer: {
        port: 4000,
        overlay: true,
        contentBase: path.resolve(__dirname, settings.paths.dist),
    },
    devtool: 'source-map',
})
// node modules
const path = require('path');
const fs = require('fs');

// webpack plugins
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodeSassGlobImporter = require('node-sass-glob-importer');
const StyleLintWebpackPlugin = require('stylelint-webpack-plugin');
const MergeWebpack = require('webpack-merge');
const ImageMinWebpackPlugin = require('imagemin-webpack-plugin').default;

// settings
const settings = require('./webpack.settings');

const generateHtml = (templateDir) => {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(items => {
        const parts = items.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HTMLWebpackPlugin({
            filename: `${name}.html`,
            template: `${templateDir}/${name}.${extension}`
        })
    })
}

const generateHtmlProd = (templateDir) => {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(items => {
        const parts = items.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HTMLWebpackPlugin({
            filename: `${name}.html`,
            template: `${templateDir}/${name}.${extension}`,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            }
        })
    })
}

const styleLoaderConfig = () => {
    return {
        test: /\.s[ac]ss$/,
        exclude: /\.\/src\/modules/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    reloadAll: true,
                    publicPath: '../',
                    hmr: true,
                }
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                }
            },
            {
                loader: "resolve-url-loader"
            },
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        importer: NodeSassGlobImporter(),
                    },
                    sourceMap: true,
                }
            },
        ]
    }
}

const imageLoaderConfig = () => {
    return {
        test: /\.(png|jpg|svg|gif|webp)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    context: path.resolve(__dirname, 'src'),
                    name: '[path][name].[ext]',
                }
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                        quality: 65
                    },
                    optipng: {
                        enabled: false,
                    },
                    pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                    },
                    gifsicle: {
                        interlaced: false,
                    },
                    webp: {
                        quality: 75
                    }
                }
            }
        ]
    }
}

const fontsLoaderConfig = () => {
    return {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
            context: path.resolve(__dirname, 'src'),
            name: '[path][name].[ext]',
        }
    }
}

const jsLoaderConfig = () => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
            },
            'eslint-loader'
        ]
    }
}

const ejsLoaderConfig = () => {
    return {
        test: /\.ejs$/,
        use: {
            loader: 'ejs-compiled-loader',
            options: {
                htmlminOptions: {
                    removeComments: true
                }
            }
        }
    }
}

// the base Webpack config
const baseConfig = {
    entry: {
        app: [`${settings.paths.src.js}/app.js`, `${settings.paths.src.css}/styles.scss`]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: path.resolve(__dirname, settings.paths.src.base),
                    from: 'favicon/**/*.*',
                    to: '[path][name].[ext]',
                },
                {
                    context: path.resolve(__dirname, settings.paths.src.base),
                    from: 'modules/**/*.*',
                    to: '[path][name].[ext]'
                },
                {
                    context: path.resolve(__dirname, settings.paths.src.base),
                    from: 'img/**/*.*',
                    to: '[path][name].[ext]'
                },
                {
                    context: path.resolve(__dirname, settings.paths.src.base),
                    from: 'upload/**/*.*',
                    to: '[path][name].[ext]'
                }
            ],
        }),
        new StyleLintWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    module: {
        rules: [
            ejsLoaderConfig(),
            styleLoaderConfig(),
            imageLoaderConfig(),
            fontsLoaderConfig(),
            jsLoaderConfig(),
            {
                test: /\.xml$/,
                use: [
                    'xml-loader',
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader',
                ]
            },
        ]
    }
}

// development Webpack config
const devConfig = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${settings.paths.dist.css}/[name].css`,
        }),
    ].concat(generateHtml('./src/templates/views'))
}

// production Webpack config
const buildConfig = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${settings.paths.dist.css}/[name].min.css`,
        }),
        new ImageMinWebpackPlugin({
            mozjpeg: {
                progressive: true,
                quality: 65
            },
            optipng: {
                enabled: false,
            },
            pngquant: {
                quality: '65-90',
                speed: 4,
            },
            gifsicle: {
                optimizationLevel: 2,
            },
            webp: {
                quality: 75
            }
        })
    ].concat(generateHtmlProd('./src/templates/views')),
}

module.exports = {
    'devConfig': MergeWebpack.strategy({
        plugins: 'append',
        modules: 'append',
        entry: 'append',
    })(
        devConfig,
        baseConfig,
    ),
    'buildConfig': MergeWebpack.strategy({
        plugins: 'append',
        modules: 'append',
        entry: 'append',
    })(
        buildConfig,
        baseConfig,
    ),
}
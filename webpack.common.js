// node modules
const path = require('path');

// webpack plugins
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodeSassGlobImporter = require('node-sass-glob-importer');
const StyleLintWebpackPlugin = require('stylelint-webpack-plugin');
const MergeWebpack = require('webpack-merge');

// settings
const settings = require('./webpack.settings');

const moduleRules = () => {
    const rules = [
        {
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        reloadAll: true,
                    },
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
                }
            ]
        },
        {
            test: /\.s[ac]ss$/,
            exclude: /\.\/src\/modules/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        reloadAll: true,
                    },
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
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            importer: NodeSassGlobImporter(),
                        },
                        sourceMap: true,
                    }
                },
            ]
        },
        {
            test: /\.(png|jpg|svg|gif)$/,
            loader: 'file-loader',
            options: {
                name: 'assets/[path][name].[ext]',
            }
        },
        {
            test: /\.(ttf|woff|woff2|eot)$/,
            loader: 'file-loader',
            options: {
                name: 'assets/[path][name].[ext]',
            }
        },
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
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ],
                    },
                },
                'eslint-loader'
            ]
        }
    ]
    return rules;
}

// the base Webpack config
const baseConfig = {
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: path.resolve(__dirname, 'src'),
                    from: 'favicon/**/*.*',
                    to: 'assets/[path][name].[ext]',
                },
                {
                    context: path.resolve(__dirname, 'src'),
                    from: 'modules/**/*.*',
                    to: 'assets/[path][name].[ext]'
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
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            reloadAll: true,
                        },
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
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /\.\/src\/modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            reloadAll: true,
                        },
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
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                importer: NodeSassGlobImporter(),
                            },
                            sourceMap: true,
                        }
                    },
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    context: path.resolve(__dirname, 'src'),
                    name: 'assets/[path][name].[ext]',
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: 'file-loader',
                options: {
                    context: path.resolve(__dirname, 'src'),
                    name: 'assets/[path][name].[ext]',
                }
            },
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
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                            ],
                        },
                    },
                    'eslint-loader'
                ]
            }
        ]
    }
}

// development Webpack config
const devConfig = {
    plugins: [
        new MiniCssExtractPlugin({
            path: path.resolve(__dirname, `${settings.paths.dist}`),
            filename: `${settings.paths.assets.css}/[name].css`,
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, `${settings.paths.src.base}/index.html`),
            minify: {
                collapseWhitespace: false,
            }
        }),
    ]
}

// production Webpack config
const buildConfig = {
    plugins: [
        new MiniCssExtractPlugin({
            path: path.resolve(__dirname, `${settings.paths.assets.css}`),
            filename: `${settings.paths.assets.css}/[name].[hash].css`,
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, `${settings.paths.src.base}/index.html`),
            minify: {
                collapseWhitespace: true,
            }
        }),
    ]
}

module.exports = {
    'devConfig': MergeWebpack.strategy({
        plugins: 'append',
        modules: 'append',
    })(
        devConfig,
        baseConfig,
    ),
    'buildConfig': MergeWebpack.strategy({
        plugins: 'append',
        modules: 'append',
    })(
        buildConfig,
        baseConfig,
    ),
}
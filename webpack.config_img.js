'use strict'

const path = require('path');
let fs = require('fs');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const sharp = require('sharp');

const paths = {
    /* Path to source files directory */
    source: path.resolve(__dirname, './src/'),
    /* Path to built files directory */
    output: path.resolve(__dirname, './dist/'),
};

const favicon = path.resolve(paths.source, 'images', 'favicon.ico');
const myHeader = fs.readFileSync(paths.source + '/views/header.html');
const myBanner = fs.readFileSync(paths.source + '/views/banner.html');
const myFooter = fs.readFileSync(paths.source + '/views/footer.html');

module.exports = {
    stats: 'errors-only',
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'js/main.bundle.js',
        path: paths.output,
        clean: true, // strege folderul dist inainte sa genereze altul
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            favicon: favicon,
            myHeader: myHeader,
            myBanner: myBanner,
            myFooter: myFooter,
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(paths.source, 'images'),
                    to: path.resolve(paths.output, 'images'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
            ],
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    ['imagemin-webp', { quality: 75 }],
                ],
            },
            loader: false,
        }),
    ],
    module: {
        rules: [
            {
                mimetype: 'image/svg+xml',
                scheme: 'data',
                type: 'asset/resource',
                generator: {
                    filename: 'icons/[hash].svg'
                }
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]'
                }
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: "compressed",
                            }
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                type: 'json'
            },
            {
                test: /\.(jpe?g|png)$/,
                type: 'asset/resource',
                generator: {
                    filename: './images/[name].[hash:6][ext]',
                },
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                        options: {
                            filter: (source, sourcePath) => {
                                // Optimize images larger than 1MB
                                return source.byteLength > 1024 * 1024;
                            },
                            minimizerOptions: {
                                plugins: [
                                    ['imagemin-webp', { quality: 75 }],
                                ],
                            },
                        },
                    },
                    {
                        loader: 'sharp-loader',
                        options: {
                            name: '[name].[hash:6].[ext]',
                            sizes: [
                                { width: 320, rename: { suffix: '-mobile' } },
                                { width: 768, rename: { suffix: '-tablet' } },
                                { width: 1024, rename: { suffix: '-desktop' } },
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(js|ts)$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
        ]
    },
    performance: { hints: false, maxAssetSize: 100000, }
};
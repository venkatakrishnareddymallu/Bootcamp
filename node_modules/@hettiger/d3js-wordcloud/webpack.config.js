const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',

	entry: './index.ts',

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname),
        libraryTarget: 'commonjs'
	},

	module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {}
                }
            }
        ]
	},

	plugins: [new UglifyJSPlugin()]
};

const webpack = require('webpack');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('./server/config');

module.exports = {
	mode: "production",
	context: resolve(__dirname, 'src'),
	entry: [
		'./index.jsx',
		// the entry point of our app
	],
	output: {
		filename: 'bundle.js',
		// the output bundle

		path: resolve(__dirname, 'docs/'),

		publicPath: resolve(__dirname, 'docs/')
		// necessary for HMR to know where to load the hot update chunks
	},
	module: {
		rules: [
			
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'file-loader?name=/fonts/[name].[ext]&limit=10000',
			},
			{
			  test: /\.css$/,
			  loader: 'style-loader'
			}, {
			  test: /\.css$/,
			  loader: 'css-loader'
			},
			{
				test: /\.(jpe?g|gif|svg)$/i,
				use: [
					'url-loader?name=images/[name].[ext]&limit=10000',
					'img-loader?name=images/[name].[ext]'
				]
			},
			{
				test: /\.(png)$/i,
				use: [
					'base64-image-loader',
				]
			},
			{
				test: /\.glsl$/,
				loader: 'webpack-glsl-loader'
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	},
	plugins: [
		new CopyWebpackPlugin([
			{
        from: resolve(__dirname, config.copy.all.src),
        to: resolve(__dirname, './docs/'),
      },
    ]),
		new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      THREE: 'three',
      'window.THREE': 'three',
      TWEEN: 'tween.js',
			'window.TWEEN': 'tween.js',
			React: 'react',
			_: 'lodash',
    })
	]
}
var webpack = require("webpack");
var path = require("path");
// var version = require("./package.json").version;
// var banner = "/**\n" + " * vue-form-generator v" + version + "\n" + " * https://github.com/icebob/vue-form-generator\n" + " * Released under the MIT License.\n" + " */\n";
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("stats-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var cssLoader = {
  loader: "css-loader",
  options: {
    minimize: true
  }
};
var sassLoader = {
  loader: "sass-loader",
  options: {
    minimize: true
  }
};

var loaders = [
	{
		test: /\.js?$/,
		exclude: /node_modules/,
		loader: "babel-loader"
	},
  {
    test: /\.css$/,
    loader: 'css-loader'
  },
  {
    test: /\.scss$/,
    loaders: ['css-loader', 'sass-loader']
  },
	{
		test: /\.vue?$/,
		loader: "vue-loader",
   /* options:{
		  loaders:{
        scss: 'css-loader!sass-loader'
      }
    }*/
    options:{
      loaders: {
        css: ExtractTextPlugin.extract({use:[cssLoader]}),
        postcss: ExtractTextPlugin.extract({use:[cssLoader]}),
        scss: ExtractTextPlugin.extract({use:[cssLoader,sassLoader]}),
      }
    }
	}
];

function resolve (dir) {
  console.warn('resolve', path.join(__dirname, '..', dir))
  return path.join(__dirname, '..', dir)
}

module.exports = [
	{
		entry: "./src/index.js",
		output: {
			path: path.resolve(__dirname, './dist'),
			filename: "tool.js",
			library: "Charts",
			libraryTarget: "umd"
		},

    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
    },

		plugins: [
			new webpack.DefinePlugin({
				"process.env" : {
					NODE_ENV : JSON.stringify("production")
				}
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
				},
				comments: false
			}),
			new ExtractTextPlugin({filename:"tool.min.css",  allChunks: true, fallback:"style-loader" }),
		],

		module: {
			rules:loaders
		},

	}
];

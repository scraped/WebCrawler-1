var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './public/src/main.js',
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: 'build.min.js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    exclude: [/bower_components/, /node_modules/],
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node_modules/, /bower_components/]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader?name=/img/[name].[ext]?[hash]',
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    devtool: '#eval-source-map'
};

if(process.env.NODE_ENV === 'production')
{
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
    ])
}

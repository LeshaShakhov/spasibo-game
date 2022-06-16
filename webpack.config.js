const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');


module.exports = {
    entry: './src/Game.ts',
    output: {
        path: __dirname + '/dist',
        library: 'mario',
        libraryTarget: 'umd',
        filename: 'mario.min.js',
        globalObject: 'this'
    },
    optimization: {
        minimize: false
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 8080,
        index: 'index.html'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'src/*.html',
                to: '',
                flatten: true
            },
            {
                from: 'src/*.json',
                to: '',
                flatten: true
            },
            {
                from: 'src/**/*.css',
                to: '',
                flatten: true
            },
            {
                from: 'src/img',
                to: __dirname + '/dist/img'
            },
            {
                from: 'src/fonts',
                to: __dirname + '/dist/fonts'
            },
            {
                from: 'src/handler',
                to: __dirname + '/dist/handler'
            },
            {
                from: 'src/js',
                to: __dirname + '/dist/js'
            },
            {
                from: 'src/downloads',
                to: __dirname + '/dist/downloads'
            },
            {
                from: 'src/sounds/**/*',
                flatten: true,
                to: __dirname + '/dist/sounds'
            }
        ])
    ]
};
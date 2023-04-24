const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, '..', './src/index.tsx'),
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /\.(useable|module)\.scss/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { esModule: false } },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.module.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { modules: true, esModule: false } },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.useable\.scss$/,
                use: [
                    { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
                    { loader: 'css-loader', options: { esModule: false } },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, '..', './build'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', './src/index.html'),
        }),
    ],
    stats: 'errors-only',
}
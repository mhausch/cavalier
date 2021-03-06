const path = require('path');

module.exports = [
    {
        entry: path.join(__dirname + '/src/client/entrys/public'),
        output: {
            path: '/pub/',
            publicPath: '/assets/', // Development Server
        },
        devtool: 'source-maps',
        resolve: {
            extensions: ['', '.js', '.jsx', '.json', '.css', '.scss', 'ttf'],
        },
        module: {
            loaders: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'react'],
                        plugins: ['transform-class-properties'],
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass'],
                },
                { test: /\.(ttf|eot|svg)$/, loader: 'file-loader' },
            ],
        },
    },
    {
        entry: path.join(__dirname + '/src/client/entrys/private'),
        output: {
            path: '/priv/',
        },
        devtool: 'source-maps',
        resolve: {
            extensions: ['', '.js', '.jsx', '.json', '.css', '.scss'],
        },
        module: {
            loaders: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'react'],
                        plugins: ['transform-class-properties'],
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass'],
                },
                { test: /\.(ttf|eot|svg)$/, loader: 'file-loader' },
            ],
        },
    },
];

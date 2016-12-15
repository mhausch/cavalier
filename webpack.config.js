const path = require('path');

module.exports = {
    entry: path.join(__dirname + '/public'),
    output: {
        path: '/',
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
        ],
    },
};

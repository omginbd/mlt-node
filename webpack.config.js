var path = require('path');

module.exports = {
    target: 'node',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'index.bundle.js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/, use: 'ts-loader',
            }
        ],
    },
    devtool: "source-map"
}

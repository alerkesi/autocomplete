module.exports = {
    context: __dirname +'\\src\\scripts',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '\\release\\dev\\scripts'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        loaders: [
            {
                test: /\.(j|t)sx?$/,
                loaders: [
                    'babel-loader?cacheDirectory=babel_cache'
                ]
            },
            {
                test: /\.tsx?$/,
                loaders: [
                    'ts-loader'
                ],
                exclude: /components/
            },
            {
                test: /\.styl/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    ts: {
        transpileOnly: true
    }
};
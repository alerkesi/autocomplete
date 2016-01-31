module.exports = {
    context: __dirname +'\\src\\scripts',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '\\release\\dev\\scripts'
    },
    resolve: {
        //root: __dirname + '\\src\\scripts',
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
                ]
            }
        ]
    }
};
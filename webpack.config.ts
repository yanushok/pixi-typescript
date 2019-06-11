import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
    entry: __dirname + "/src/index.ts",
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {  // configuration for webpack-dev-server
        contentBase: './public',  //source of static assets
        port: 3000, // port to run dev-server
    }
};

export default config;
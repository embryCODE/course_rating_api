var webpack = require('webpack'),
       path = require('path');

module.exports = {
    context: __dirname + '/app',
    devtool: 'source-map',
    entry: {
        app: './app.js',
        vendor: [
          'angular',
          'angular-route',
          'angular-sanitize',
          'jquery',
          'showdown',
          'toastr',
          'underscore'
        ]
    },
    output: {
        path: __dirname + '/public/scripts',
        filename: 'app.bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ]
};

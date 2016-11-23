var path = require("path");

module.exports = {
  context: path.join(__dirname, "lib", "frontend"),

  entry: "./app.js",
  output: {
    filename: "./bundle.js"
  },
  module: {
      loaders:[
          {
              test: [/\.jsx?$/, /\.js?$/],
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                presets: ['es2015', 'react']
              }
          },
          {
              test: /\.handlebars$/,
              loader: "handlebars-loader",
              query: {
                  helperDirs: [ path.join(__dirname, 'templates', 'helpers') ]
              }
          }
      ]
  },
  devtool: "source-map",
  resolve: {
    extensions: ['', '.js', '.jsx', '.handlebars'],
    alias: {
        handlebars: path.join(__dirname, 'lib', 'handlebars', 'handlebars.runtime-v4.0.5.js'),
        templates: path.join(__dirname, 'templates')
    }
  }
}

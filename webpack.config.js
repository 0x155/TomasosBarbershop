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
          }
      ]
  },
  devtool: "source-map",
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}

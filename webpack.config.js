const path = require("path");

module.exports = [
  {
    entry: {
      index: "./src/index.ts"
    },
    devtool: "inline-source-map",
    mode: "none",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist")
    }
  },
  {
    entry: {
      index: "./src/index.scss"
    },
    // I guess it isn't necessary?
    // output: {
    //   // This is necessary for webpack to compile. But we never use it.
    //   // filename: "tmp.js"
    // },
    mode: "none",
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].css"
              }
            },
            { loader: "extract-loader" },
            { loader: "css-loader" },
            {
              loader: "sass-loader",
              options: {
                importer(url, prev) {
                  if (url.indexOf("@material") === 0) {
                    const filePath = url.split("@material")[1];
                    const nodeModulePath = `./node_modules/@material/${filePath}`;
                    return { file: require("path").resolve(nodeModulePath) };
                  }
                  return { file: url };
                }
              }
            }
          ]
        }
      ]
    }
  }
];

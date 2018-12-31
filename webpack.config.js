module.exports = {
  mode: "none",
  entry: "./lib/index.js",
  output: {
    filename: "bundle.js",
    libraryTarget: "var",
    library: "Boba"
  }
};

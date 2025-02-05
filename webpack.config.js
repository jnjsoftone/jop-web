const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/main.ts",
    data: "./src/data.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "commonjs",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
      os: false,
      crypto: false,
      stream: require.resolve("stream-browserify"),
      http: false,
      https: false,
      child_process: false,
      net: false,
      tls: false,
      url: false,
      zlib: false,
      assert: false,
      util: false,
      buffer: false,
      process: false,
    },
  },
  externals: {
    obsidian: "commonjs2 obsidian",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "manifest.json", to: "." }],
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
  mode: "development",
  target: "web",
};

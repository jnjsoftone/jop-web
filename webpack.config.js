const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/main.ts",
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
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: "esnext",
              },
            },
          },
        ],
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
        terserOptions: {
          format: {
            comments: false,
          },
          mangle: {
            keep_classnames: true,
            keep_fnames: true,
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      child_process: false,
      util: false,
      os: false,
      crypto: false,
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
  mode: "production",
  target: "web",
};

import MiniCssExtractPlugin, { Configuration } from "mini-css-extract-plugin";
import { BuildOptions } from "./types/types";
import HtmlWebpackPlugin from "html-webpack-plugin";

export function buildPlugins(options: BuildOptions): Configuration["plugins"] {
  const { paths, mode } = options;
  const isProd = mode === "production";

  const plugins: Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      template: paths.html,
    }),
  ];

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      })
    );
  }

  return plugins;
}

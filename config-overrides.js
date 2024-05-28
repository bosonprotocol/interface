// INFO about this file in https://github.com/timarney/react-app-rewired
/* eslint @typescript-eslint/no-var-requires: "off" */
const {
  override,
  addBabelPlugins,
  addWebpackPlugin,
  addWebpackResolve
} = require("customize-cra");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// module.exports = override(addBabelPlugins("babel-plugin-styled-components"));

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { alias, aliasJest, configPaths } = require("react-app-rewire-alias");

// const aliasMap = configPaths("./tsconfig.paths.json");

// module.exports = alias(aliasMap);
// module.exports.jest = aliasJest(aliasMap);

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: override(
    process.env.USE_BABEL_PLUGIN_ISTANBUL &&
      addBabelPlugins("babel-plugin-istanbul"),
    function override(config) {
      let loaders = config.resolve;
      loaders.fallback = {
        util: require.resolve("util/")
      };

      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Critical dependency: Accessing import\.meta directly is unsupported \(only property access is supported\)/
      ];

      return config;
    },
    addWebpackResolve({
      fallback: {
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        fs: false,
        constants: require.resolve("constants-browserify"),
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify")
      }
    }),
    addWebpackPlugin(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      })
    ),
    process.env.ANALYZE_BUNDLE &&
      addWebpackPlugin(new BundleAnalyzerPlugin({ analyzerMode: "server" }))
  ),
  // The Jest config to use when running your jest tests - note that the normal rewires do not
  // work here.
  jest: function (config) {
    // ...add your jest config customisation...
    config.moduleNameMapper = {
      "\\.(css|less|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.js",
      "react-markdown": "<rootDir>/test/__mocks__/react-markdown.js",
      "remark-gfm": "<rootDir>/test/__mocks__/remark-gfm.js",
      "rehype-raw": "<rootDir>/test/__mocks__/rehype-raw.js"
    };
    config.transformIgnorePatterns = [
      // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      "node_modules/(?!(@rainbow-me/rainbowkit)/)",
      "^.+\\.module\\.(css|sass|scss)$"
    ];
    return config;
  }
};

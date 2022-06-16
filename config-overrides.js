// INFO about this file in https://github.com/timarney/react-app-rewired

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { override, addBabelPlugins } = require("customize-cra");

// module.exports = override(addBabelPlugins("babel-plugin-styled-components"));
// module.exports = override(
//   process.env.USE_BABEL_PLUGIN_ISTANBUL &&
//     addBabelPlugins("babel-plugin-istanbul"),
//   function override(config) {
//     console.log(
//       "🚀 ~ file: config-overrides.js ~ line 9 ~ override ~ config",
//       config
//     );

//     let loaders = config.resolve;
//     loaders.fallback = {
//       util: require.resolve("util/")
//     };

//     return config;
//   }
// );

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

      return config;
    }
  ),
  // The Jest config to use when running your jest tests - note that the normal rewires do not
  // work here.
  jest: function (config) {
    // ...add your jest config customisation...
    config.transformIgnorePatterns = [
      // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      "node_modules/(?!(@rainbow-me/rainbowkit)/)",
      "^.+\\.module\\.(css|sass|scss)$"
    ];
    return config;
  }
};

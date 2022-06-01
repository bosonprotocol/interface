// eslint-disable-next-line @typescript-eslint/no-var-requires
const { override, addBabelPlugins } = require("customize-cra");

// module.exports = override(addBabelPlugins("babel-plugin-styled-components"));
module.exports = override(
  process.env.USE_BABEL_PLUGIN_ISTANBUL &&
    addBabelPlugins("babel-plugin-istanbul")
);
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { alias, aliasJest, configPaths } = require("react-app-rewire-alias");

// const aliasMap = configPaths("./tsconfig.paths.json");

// module.exports = alias(aliasMap);
// module.exports.jest = aliasJest(aliasMap);

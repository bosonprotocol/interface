// eslint-disable-next-line @typescript-eslint/no-var-requires
const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(addBabelPlugins("babel-plugin-styled-components"));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { alias, aliasJest, configPaths } = require("react-app-rewire-alias");

const aliasMap = configPaths("./tsconfig.paths.json");

module.exports = alias(aliasMap);
module.exports.jest = aliasJest(aliasMap);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(addBabelPlugins("babel-plugin-styled-components"));

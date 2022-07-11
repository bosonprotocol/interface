import { CONFIG } from "../src/lib/config";

export const graphqlEndpoint =
  "**/" +
  (CONFIG.subgraphUrl.indexOf("https") !== -1
    ? CONFIG.subgraphUrl.substring("https://".length)
    : CONFIG.subgraphUrl.substring("http://".length));

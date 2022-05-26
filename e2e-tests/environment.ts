import { CONFIG } from "../src/lib/config";

export const graphqlEndpoint =
  "**/" + CONFIG.subgraphUrl.substring("https://".length);

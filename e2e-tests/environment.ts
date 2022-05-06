import { CONFIG } from "@lib/config";

export const graphqlEndpoint =
  "**/" + CONFIG.subgraphUrl.substring("https://".length);

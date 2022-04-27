const subgraphEndpoint = process.env
  .REACT_APP_SUBGRAPH_OFFERS_GRAPHQL_ENDPOINT as string;
export const graphqlEndpoint =
  "**/" + subgraphEndpoint.substring("https://".length);

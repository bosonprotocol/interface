import { gql } from "graphql-request";
import { useQuery, UseQueryResult } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

export function useBrands(): UseQueryResult<string[], unknown> {
  return useQuery("brands", async () => {
    const result = await fetchSubgraph<{
      productV1MetadataEntities: { brandName: string }[];
    }>(
      gql`
        {
          productV1MetadataEntities(orderBy: "brandName", orderDirection: asc) {
            brandName
          }
        }
      `
    );
    return [
      // TODO: remove Set once we can get unique brand names
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...new Set<string>(
        result?.productV1MetadataEntities?.map((row) => row.brandName) ??
          ([] as string[])
      )
    ];
  });
}

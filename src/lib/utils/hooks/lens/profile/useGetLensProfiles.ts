import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";

type Params = Parameters<typeof getLensProfiles>[0];
export type Profile = Awaited<
  ReturnType<typeof getLensProfiles>
>["profiles"]["items"][number];

type Props = Params;

export default function useGetLensProfiles(
  props: Props,
  options: {
    enabled?: boolean;
  }
) {
  const { enabled } = options;
  return useQuery(
    ["get-lens-profiles", props],
    async () => {
      return getLensProfiles(props);
    },
    {
      enabled
    }
  );
}

async function getLensProfiles({
  ownedBy,
  limit
}: {
  ownedBy: string[];
  limit?: number | null;
}) {
  const query = gql`
    query Profiles($ownedBy: [EthereumAddress!], $limit: LimitScalar) {
      profiles(request: { ownedBy: $ownedBy, limit: $limit }) {
        items {
          id
          name
          bio
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          isDefault
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          handle
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          ownedBy
          dispatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  symbol
                  name
                  decimals
                  address
                }
                value
              }
              recipient
            }
            ... on ProfileFollowModuleSettings {
              type
            }
            ... on RevertFollowModuleSettings {
              type
            }
          }
        }
        pageInfo {
          prev
          next
          totalCount
        }
      }
    }
  `;
  return await fetchLens<{
    profiles: {
      items: {
        id: string;
        name: string;
        bio: string;
        attributes: {
          displayType: string;
          traitType: string;
          key: string;
          value: string;
        };
        metadata: unknown;
        isDefault: boolean;
        handle: string;
      }[];
    };
  }>(query, { ownedBy, limit });
}

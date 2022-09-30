import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import { SingleProfileQueryRequest } from "../graphql/generated";

type Params = Parameters<typeof getLensProfile>[0];

type Props = Params;

export default function useGetLensProfile(
  props: Props,
  options: {
    enabled?: boolean;
  }
) {
  const { enabled } = options;
  return useQuery(
    ["get-lens-profile", props],
    async () => {
      return getLensProfile(props);
    },
    {
      enabled
    }
  );
}

async function getLensProfile(
  request: Partial<Record<keyof SingleProfileQueryRequest, string>>
) {
  const query = gql`
    query Profile($handle: Handle, $profileId: ProfileId) {
      profile(request: { handle: $handle, profileId: $profileId }) {
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
    }
  `;
  return (
    await fetchLens<{
      profile: {
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
      };
    }>(query, request)
  ).profile;
}

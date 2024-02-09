import { AuthTokenType } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { getLensTokenIdHex } from "../../../../../components/modal/components/Profile/Lens/utils";
import { fetchLens } from "../fetchLens";
import {
  Profile,
  ProfileQueryRequest,
  ProfilesDocument,
  ProfilesQuery
} from "../graphql/generated";

type Params = Parameters<typeof getLensProfiles>[0];

type Props = Params;

export default function useGetLensProfiles(
  props: Props,
  options: {
    enabled?: boolean;
  }
) {
  const { config } = useConfigContext();
  const lensApiLink = config.lens.apiLink || "";
  const { enabled } = options;
  return useQuery(
    ["get-lens-profiles", props, lensApiLink],
    async () => {
      return getLensProfiles(props, lensApiLink);
    },
    {
      enabled
    }
  );
}

export function useLensProfilesPerSellerIds(
  props: {
    sellers: {
      authTokenType: number;
      authTokenId: string;
      id: string;
    }[];
  },
  options: {
    enabled?: boolean;
  }
) {
  const { config } = useConfigContext();
  const lensApiLink = config.lens.apiLink || "";
  const { enabled } = options;
  const sellerIdPerLensToken = useMemo(
    () =>
      props.sellers
        .filter((seller) => seller.authTokenType === AuthTokenType.LENS)
        .reduce((_sellerIdPerLensToken, seller) => {
          const sellerId = seller.id;
          const tokenId = getLensTokenIdHex(seller.authTokenId);
          if (!_sellerIdPerLensToken.has(tokenId)) {
            _sellerIdPerLensToken.set(tokenId, sellerId);
          }
          return _sellerIdPerLensToken;
        }, new Map<string, string>()),
    [props.sellers]
  );
  const profileIds = Array.from(sellerIdPerLensToken.keys());
  const lensProfiles = useQuery(
    ["get-lens-profiles", profileIds, lensApiLink],
    async () => {
      const lensProfiles = await getLensProfiles(
        {
          profileIds
        },
        lensApiLink
      );
      return lensProfiles?.items.reduce((map, profile) => {
        if (profile) {
          const sellerId = sellerIdPerLensToken.get(String(profile.id));
          if (!sellerId) {
            return map;
          }
          return map.set(sellerId, profile as Profile);
        }
        return map;
      }, new Map<string, Profile>());
    },
    {
      enabled: enabled && !!sellerIdPerLensToken.size
    }
  );
  return lensProfiles.data;
}

async function getLensProfiles(
  request: ProfileQueryRequest,
  lensApiLink: string
) {
  return (
    (await fetchLens<ProfilesQuery>(lensApiLink, ProfilesDocument, { request }))
      ?.profiles || { items: [], pageInfo: { totalCount: 0 } }
  );
}

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
  const sellerIdPerLensToken = props.sellers
    .filter((seller) => seller.authTokenType === AuthTokenType.LENS)
    .reduce((_sellerIdPerLensToken, seller) => {
      const sellerId = seller.id;
      const tokenId = getLensTokenIdHex(seller.authTokenId);
      if (!_sellerIdPerLensToken.has(tokenId)) {
        _sellerIdPerLensToken.set(tokenId, sellerId);
      }
      return _sellerIdPerLensToken;
    }, new Map<string, string>());
  const lensProfiles = useQuery(
    ["get-lens-profiles", sellerIdPerLensToken, lensApiLink],
    async () => {
      return getLensProfiles(
        {
          profileIds: Array.from(sellerIdPerLensToken.keys())
        },
        lensApiLink
      );
    },
    {
      enabled
    }
  );
  return useMemo(() => {
    return lensProfiles.isSuccess && lensProfiles.data?.items
      ? lensProfiles.data?.items.reduce((map, profile) => {
          if (profile) {
            const sellerId = sellerIdPerLensToken.get(
              String(profile.id)
            ) as string;
            return map.set(sellerId, profile as Profile);
          }
          return map;
        }, new Map<string, Profile>())
      : new Map<string, Profile>();
  }, [lensProfiles, sellerIdPerLensToken]);
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

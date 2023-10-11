import { subgraph } from "@bosonprotocol/core-sdk";
import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { AuthTokenType } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";

import {
  getLensTokenIdDecimal,
  getLensTokenIdHex
} from "../../../components/modal/components/Profile/Lens/utils";
import { fetchSubgraph } from "../core-components/subgraph";
import { useCoreSDK } from "../useCoreSdk";
import { useAccount } from "./connection/connection";
import { Profile } from "./lens/graphql/generated";
import useGetLensProfiles from "./lens/profile/useGetLensProfiles";

interface Props {
  address?: string;
  sellerId?: string;
  lensTokenId?: string;
}

const getSellersByIds =
  (subgraphUrl: string) => (sellerIds: string[], isSellerId: boolean) => {
    const resultSellerByIds = useQuery(
      ["seller-by-ids", sellerIds],
      async () => {
        const result = await fetchSubgraph<{
          sellers: {
            authTokenId: string;
            authTokenType: number;
            admin: string;
            treasury: string;
            assistant: string;
            id: string;
            voucherCloneAddress: string;
            active: boolean;
            sellerId: string;
            metadata: SellerFieldsFragment["metadata"];
          }[];
        }>(
          subgraphUrl,
          gql`
            query GetSellerBySellerId($sellerIds: [String]) {
              sellers(where: { sellerId_in: $sellerIds }) {
                authTokenId
                authTokenType
                admin
                treasury
                assistant
                id
                voucherCloneAddress
                active
                sellerId
                metadata {
                  id
                  type
                  createdAt
                  name
                  description
                  legalTradingName
                  kind
                  website
                  images {
                    id
                    url
                    tag
                    type
                    width
                    height
                    fit
                    position
                  }
                  contactLinks {
                    id
                    url
                    tag
                  }
                  contactPreference
                  socialLinks {
                    id
                    url
                    tag
                  }
                }
              }
            }
          `,
          { sellerIds }
        );
        return result.sellers;
      },
      {
        enabled: isSellerId
      }
    );
    return resultSellerByIds;
  };

/**
 * This hook returns the current seller or sellers in a list. It will return more than one
 * seller if you have more than one Lens profile and you had sent your Lens NFT that
 * identifies your profile to another user.
 * @param
 * @returns
 */
export function useCurrentSellers({
  address,
  sellerId,
  lensTokenId
}: Props = {}) {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;
  const coreSDK = useCoreSDK();
  const fetchSellers = getSellersByIds(subgraphUrl);
  const { account: loggedInUserAddress } = useAccount();
  const sellerAddress =
    address || sellerId || lensTokenId || loggedInUserAddress || null;
  const sellerAddressType = useMemo(() => {
    if (sellerAddress) {
      if (address) {
        return "ADDRESS";
      }
      if (sellerId) {
        return "SELLER_ID";
      }
      if (lensTokenId) {
        return "LENS_TOKEN_ID";
      }
      return "ADDRESS";
    }
    return null;
  }, [address, sellerAddress, sellerId, lensTokenId]);

  const enableResultByAddress =
    !!sellerAddress && sellerAddressType === "ADDRESS";
  const resultByAddress = useQuery(
    ["current-seller-data-by-address", sellerAddress, coreSDK.uuid],
    async () => {
      if (!sellerAddress) {
        return null;
      }
      const sellers = await coreSDK.getSellersByAddress(sellerAddress);

      const rolesWithSameAddress = sellers
        .flatMap((seller) => [
          { admin: seller.admin },
          { treasury: seller.treasury },
          { assistant: seller.assistant }
        ])
        .filter((role) => {
          return (
            ((Object.values(role)[0] as string) || "").toLowerCase() ==
            sellerAddress.toLowerCase()
          );
        })
        .map(
          (role) => Object.keys(role)[0] as "admin" | "treasury" | "assistant"
        );
      const isLensSeller = sellers.find(
        (seller) => seller.authTokenType === AuthTokenType.LENS
      );
      return {
        sellers,
        sellerType: isLensSeller
          ? Array.from(new Set(["admin", ...rolesWithSameAddress]).values())
          : rolesWithSameAddress
      };
    },
    {
      enabled: enableResultByAddress
    }
  );
  const enableResultById = !!sellerAddress && sellerAddressType === "SELLER_ID";
  const { data: sellers } = fetchSellers(
    typeof sellerAddress === "string" ? [sellerAddress] : [],
    enableResultById
  );

  const resultById = useQuery(
    ["current-seller-data-by-id", sellerAddress],
    async () => {
      const allProps = {
        admin: sellers?.[0]?.admin || null,
        assistant: sellers?.[0]?.assistant || null,
        treasury: sellers?.[0]?.treasury || null
      };
      return Object.fromEntries(
        Object.entries(allProps).filter(([, value]) => value !== null)
      );
    },
    {
      enabled: enableResultById
    }
  );

  const decimalLensTokenId = lensTokenId
    ? getLensTokenIdDecimal(lensTokenId)?.toString()
    : null;
  const enableResultLensId =
    !!decimalLensTokenId && sellerAddressType === "LENS_TOKEN_ID";
  const resultByLensId = useQuery(
    [
      "current-seller-data-by-lens-id",
      decimalLensTokenId,
      AuthTokenType.LENS,
      subgraphUrl
    ],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          sellerId: string;
          admin: string;
          assistant: string;
          treasury: string;
        }[];
      }>(
        subgraphUrl,
        gql`
          query GetSellerByLensId($authTokenId: String, $authTokenType: Int) {
            sellers(
              where: {
                authTokenId: $authTokenId
                authTokenType: $authTokenType
              }
            ) {
              sellerId
              admin
              assistant
              treasury
            }
          }
        `,
        { authTokenId: decimalLensTokenId, authTokenType: AuthTokenType.LENS }
      );
      const allProps = {
        sellerId: result?.sellers[0]?.sellerId || null,
        admin: result?.sellers[0]?.admin || null,
        assistant: result?.sellers[0]?.assistant || null,
        treasury: result?.sellers[0]?.treasury || null
      };
      return Object.fromEntries(
        Object.entries(allProps).filter(([, value]) => value !== null)
      );
    },
    {
      enabled: enableResultLensId
    }
  );

  const sellerType: string[] = resultById?.data
    ? Object.keys(resultById.data)
    : resultByLensId?.data
    ? Object.keys(resultByLensId.data)
    : resultByAddress?.data?.sellerType || [];

  const sellerIdsToQuery: string[] =
    sellerAddressType === "SELLER_ID"
      ? [sellerAddress as string]
      : sellerAddressType === "LENS_TOKEN_ID" && resultByLensId?.data?.sellerId
      ? [resultByLensId?.data.sellerId]
      : [];
  const enableSellerById = !!sellerIdsToQuery?.length;
  const { data: sellers2, refetch: refetchFetchSellers } = fetchSellers(
    sellerIdsToQuery,
    enableSellerById
  );
  const sellerById = useQuery(
    ["current-seller-by-id", sellerIdsToQuery, sellers2],
    async () => {
      const currentSeller = sellers2?.[0] || null;

      const currentSellerRoles = {
        admin: currentSeller?.admin || null,
        assistant: currentSeller?.assistant || null,
        treasury: currentSeller?.treasury || null
      };
      const currentSellerRolesWithoutNull = Object.fromEntries(
        Object.entries(currentSellerRoles).filter(([, value]) => value !== null)
      );

      return {
        ...currentSeller,
        sellerAddress:
          (currentSellerRolesWithoutNull &&
            Object.values(currentSellerRolesWithoutNull)[0]) ??
          null
      };
    },
    {
      enabled: enableSellerById
    }
  );
  const sellerValues = useMemo(
    () =>
      (sellerAddressType === "ADDRESS"
        ? resultByAddress.data?.sellers || []
        : ([sellerById?.data] as unknown as subgraph.SellerFieldsFragment[]) ||
          []
      ).filter((value) => !!value),

    [resultByAddress.data?.sellers, sellerAddressType, sellerById?.data]
  );
  const profileIds = useMemo(
    () =>
      sellerValues
        .filter((seller) => !!Number(seller?.authTokenId))
        .map((seller) => getLensTokenIdHex(seller?.authTokenId))
        .filter((value) => !!value),
    [sellerValues]
  );
  const enableResultLens =
    !!sellerAddress &&
    !!sellerValues &&
    !!sellerAddressType &&
    !!profileIds.length;
  const resultLens = useGetLensProfiles(
    {
      profileIds
    },
    {
      enabled: enableResultLens && config.lens.availableOnNetwork
    }
  );
  const lens: (Profile | undefined)[] = useMemo(() => {
    return (resultLens?.data?.items as Profile[]) ?? [];
  }, [resultLens?.data]);
  const sellerIds = useMemo(() => {
    return (
      resultByAddress.data
        ? resultByAddress.data.sellers.map((seller) => seller.id)
        : sellerAddressType === "SELLER_ID"
        ? [sellerAddress]
        : []
    ).filter((sellerId) => !!sellerId) as string[];
  }, [resultByAddress.data, sellerAddress, sellerAddressType]);
  return {
    isSuccess:
      resultById?.isSuccess ||
      resultByAddress?.isSuccess ||
      resultByLensId?.isSuccess ||
      sellerById?.isSuccess ||
      resultLens?.isSuccess,
    isLoading:
      resultById?.isLoading ||
      resultByAddress?.isLoading ||
      resultByLensId?.isLoading ||
      sellerById?.isLoading ||
      resultLens?.isLoading,
    isRefetching:
      resultById?.isRefetching ||
      resultByAddress?.isRefetching ||
      resultByLensId?.isRefetching ||
      sellerById?.isRefetching ||
      resultLens?.isRefetching,
    isFetched:
      resultById?.isFetched ||
      resultByAddress?.isFetched ||
      resultByLensId?.isFetched ||
      sellerById?.isFetched ||
      resultLens?.isFetched,
    isFetching:
      resultById?.isFetching ||
      resultByAddress?.isFetching ||
      resultByLensId?.isFetching ||
      sellerById?.isFetching ||
      resultLens?.isFetching,
    isError:
      resultById?.isError ||
      resultByAddress?.isError ||
      resultByLensId?.isError ||
      sellerById?.isError ||
      resultLens?.isError,
    sellerIds,
    sellerType,
    sellers: sellerValues,
    lens,
    refetch: async () => {
      return Promise.allSettled([
        enableResultByAddress && resultByAddress.refetch(),
        enableResultById && resultById.refetch(),
        enableResultLensId && resultByLensId.refetch(),
        enableSellerById && refetchFetchSellers(),
        enableSellerById && sellerById.refetch(),
        enableResultLens && resultLens.refetch()
      ]);
    }
  };
}

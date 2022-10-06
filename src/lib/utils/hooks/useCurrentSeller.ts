import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { getLensTokenIdHex } from "../../../components/modal/components/CreateProfile/Lens/utils";
import { fetchSubgraph } from "../core-components/subgraph";
import useGetLensProfile from "./lens/profile/useGetLensProfile";

interface Props {
  address?: string;
  sellerId?: string;
}

export function useCurrentSeller({ address, sellerId }: Props = {}) {
  const { address: loggedInUserAddress } = useAccount();
  const sellerAddress = address || sellerId || loggedInUserAddress || null;
  const sellerAddressType = useMemo(() => {
    if (sellerAddress) {
      if (address) {
        return "ADDRESS";
      }
      if (sellerId) {
        return "SELLER_ID";
      }
      return "ADDRESS";
    }
    return null;
  }, [address, sellerAddress, sellerId]);

  const resultByAddress = useQuery(
    ["current-seller-data-by-address", { address: sellerAddress }],
    async () => {
      const result = await fetchSubgraph<{
        admin: {
          sellerId: string;
        }[];
        clerk: {
          sellerId: string;
        }[];
        operator: {
          sellerId: string;
        }[];
        treasury: {
          sellerId: string;
        }[];
      }>(
        gql`
          query GetSellerIdByAddress($address: String) {
            admin: sellers(where: { admin: $address }) {
              sellerId
            }
            clerk: sellers(where: { clerk: $address }) {
              sellerId
            }
            operator: sellers(where: { operator: $address }) {
              sellerId
            }
            treasury: sellers(where: { treasury: $address }) {
              sellerId
            }
          }
        `,
        { address: sellerAddress }
      );
      const allProps = {
        admin: result?.admin[0]?.sellerId || null,
        clerk: result?.clerk[0]?.sellerId || null,
        operator: result?.operator[0]?.sellerId || null,
        treasury: result?.treasury[0]?.sellerId || null
      };
      return Object.fromEntries(
        Object.entries(allProps).filter(([, value]) => value !== null)
      );
    },
    {
      enabled: !!sellerAddress && sellerAddressType === "ADDRESS"
    }
  );

  const resultById = useQuery(
    ["current-seller-data-by-id", { sellerId: sellerAddress }],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          sellerId: string;
          admin: string;
          clerk: string;
          operator: string;
          treasury: string;
        }[];
      }>(
        gql`
          query GetSellerById($sellerId: String) {
            sellers(where: { sellerId: $sellerId }) {
              sellerId
              admin
              clerk
              operator
              treasury
            }
          }
        `,
        { sellerId: sellerAddress }
      );
      const allProps = {
        admin: result?.sellers[0]?.sellerId || null,
        clerk: result?.sellers[0]?.sellerId || null,
        operator: result?.sellers[0]?.sellerId || null,
        treasury: result?.sellers[0]?.sellerId || null
      };
      return Object.fromEntries(
        Object.entries(allProps).filter(([, value]) => value !== null)
      );
    },
    {
      enabled: !!sellerAddress && sellerAddressType === "SELLER_ID"
    }
  );
  const results = resultById?.data || resultByAddress?.data;
  const sellerIdToQuery =
    sellerAddressType === "SELLER_ID"
      ? sellerAddress
      : (results && Object.values(results)[0]) /* seller id */ ?? null;
  const sellerType = useMemo(() => results && Object.keys(results), [results]);

  const sellerById = useQuery(
    ["current-seller-by-id", { address: sellerIdToQuery }],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          authTokenId: string;
          authTokenType: number;
          admin: string;
          clerk: string;
          treasury: string;
          operator: string;
        }[];
      }>(
        gql`
          query GetSellerBySellerId($sellerId: String) {
            sellers(where: { sellerId: $sellerId }) {
              authTokenId
              authTokenType
              admin
              clerk
              treasury
              operator
            }
          }
        `,
        { sellerId: sellerIdToQuery }
      );

      const currentSeller = result?.sellers?.[0] || null;

      const currentSellerRoles = {
        admin: currentSeller?.admin || null,
        clerk: currentSeller?.clerk || null,
        operator: currentSeller?.operator || null,
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
      enabled: !!sellerIdToQuery
    }
  );
  const sellerValues = useMemo(() => sellerById?.data || null, [sellerById]);
  const profileId = useMemo(
    () => getLensTokenIdHex(sellerValues?.authTokenId),
    [sellerValues]
  );

  const resultLens = useGetLensProfile(
    {
      profileId
    },
    {
      enabled:
        !!sellerAddress &&
        !!sellerValues &&
        !!sellerAddressType &&
        profileId !== ""
    }
  );

  return {
    isLoading:
      resultById?.isLoading ||
      resultByAddress?.isLoading ||
      sellerById?.isLoading ||
      resultLens?.isLoading,
    isError:
      resultById?.isError ||
      resultByAddress?.isError ||
      sellerById?.isError ||
      resultLens?.isError,
    sellerId,
    sellerType,
    seller: {
      ...sellerValues
    },
    lens: {
      ...(resultLens?.data ?? {})
    }
  };
}

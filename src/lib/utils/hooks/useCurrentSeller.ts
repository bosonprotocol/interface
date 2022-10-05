import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../core-components/subgraph";
import useGetLensProfile from "./lens/profile/useGetLensProfile";

const MOCK_VALUES = {
  admin: "postponed3.test",
  authTokenId: "1",
  authTokenType: 1,
  clerk: "postponed3.test",
  operator: "postponed3.test",
  treasury: "postponed3.test"
};
export function useCurrentSeller(address?: string) {
  const { address: loggedInUserAddress } = useAccount();
  const sellerAddress = address || loggedInUserAddress || null;
  const sellerAddressType = useMemo(() => {
    if (sellerAddress) {
      if (/(0x[a-fA-F0-9]{40})/g.test(sellerAddress?.toString())) {
        return "ETH";
      }
      if (isNaN(Number(sellerAddress))) {
        return "LENS";
      }
      return "ID";
    }
    return null;
  }, [sellerAddress]);

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
      enabled: !!sellerAddress && sellerAddressType !== "ID"
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
        admin: result?.sellers[0]?.admin || null,
        clerk: result?.sellers[0]?.clerk || null,
        operator: result?.sellers[0]?.operator || null,
        treasury: result?.sellers[0]?.treasury || null
      };
      return Object.fromEntries(
        Object.entries(allProps).filter(([, value]) => value !== null)
      );
    },
    {
      enabled: !!sellerAddress && sellerAddressType === "ID"
    }
  );

  const results = resultById?.data || resultByAddress?.data;

  const sellerId =
    sellerAddressType === "ID"
      ? sellerAddress
      : (results && Object.values(results)[0]) ?? null;
  const sellerType = useMemo(() => results && Object.keys(results), [results]);

  const sellerById = useQuery(
    ["current-seller-by-id", { address }],
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
        { sellerId }
      );

      const currentSeller = MOCK_VALUES
        ? MOCK_VALUES
        : result?.sellers?.[0] || null;

      const currentSellerRoles = MOCK_VALUES
        ? {
            admin: "postponed3.test",
            clerk: "postponed3.test",
            operator: "postponed3.test",
            treasury: "postponed3.test"
          }
        : {
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
      enabled: !!sellerId
    }
  );
  const sellerVales = useMemo(() => sellerById?.data || null, [sellerById]);

  const resultLens = useGetLensProfile(
    {
      handle:
        sellerAddressType === "LENS"
          ? sellerAddress || ""
          : sellerAddressType === "ID"
          ? sellerVales?.admin || ""
          : sellerVales?.sellerAddress || ""
    },
    {
      enabled: !!sellerAddress && !!sellerVales && !!sellerAddressType
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
      ...sellerVales
    },
    lens: {
      ...(resultLens?.data ?? {})
    }
  };
}

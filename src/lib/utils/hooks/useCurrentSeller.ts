import { gql } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../core-components/subgraph";
import useGetLensProfile from "./lens/profile/useGetLensProfile";
const MOCK_VALUES = {
  admin: null,
  authTokenId: "1",
  authTokenType: 1,
  clerk: "albert-handle.test",
  operator: "albert-handle.test",
  treasury: "albert-handle.test"
};
export function useCurrentSeller(address?: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const { address: loggedInUserAddress } = useAccount();
  const sellerAddress = useMemo(
    () => address || loggedInUserAddress,
    [address, loggedInUserAddress]
  );

  const result = useQuery(
    ["current-seller-id", { address: sellerAddress }],
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
      enabled: !!sellerAddress
    }
  );

  const sellerId = useMemo(
    () => (result.data && Object.values(result.data)[0]) ?? null,
    [result]
  );
  const sellerType = useMemo(
    () => result.data && Object.keys(result.data),
    [result]
  );

  const resultById = useQuery(
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
            admin: null,
            clerk: "albert-handle.test",
            operator: "albert-handle.test",
            treasury: "albert-handle.test"
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

  const sellerVales = useMemo(() => resultById?.data, [resultById]);

  const resultLens = useGetLensProfile(
    {
      handle: sellerVales?.sellerAddress || ""
    },
    {
      enabled:
        (sellerVales?.authTokenType === 1 &&
          sellerVales?.sellerAddress !== null) ||
        false
    }
  );

  useEffect(() => {
    if (result?.isLoading || resultById?.isLoading || resultLens?.isLoading) {
      setIsLoading(false);
    }
  }, [result?.isLoading, resultById?.isLoading, resultLens?.isLoading]);

  useEffect(() => {
    if (result?.isError || resultById?.isError || resultLens?.isError) {
      setIsError(true);
    }
  }, [result?.isError, resultById?.isError, resultLens?.isError]);

  return {
    isLoading,
    isError,
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

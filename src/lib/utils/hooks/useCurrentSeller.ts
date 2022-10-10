import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { authTokenTypes } from "../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenIdHex } from "../../../components/modal/components/CreateProfile/Lens/utils";
import { fetchSubgraph } from "../core-components/subgraph";
import { useCoreSDK } from "../useCoreSdk";
import { Profile } from "./lens/graphql/generated";
import useGetLensProfiles from "./lens/profile/useGetLensProfiles";

interface Props {
  address?: string;
  sellerId?: string;
}

/**
 * This hook returns the current seller or sellers. It will return more than one
 * seller if you have more than one Lens profile and you send your Lens NFT that
 * identifies your profile to another user.
 * @param param0
 * @returns
 */
export function useCurrentSeller({ address, sellerId }: Props = {}) {
  const coreSDK = useCoreSDK();
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
  console.log({ sellerAddressType });
  const resultByAddress = useQuery(
    ["current-seller-data-by-address", { address: sellerAddress }],
    async () => {
      if (!sellerAddress) {
        return null;
      }
      const sellers = await coreSDK.getSellerByAddress(sellerAddress);

      const rolesWithSameAddress = sellers
        .flatMap((seller: any) => [
          { admin: seller.admin },
          { clerk: seller.clerk },
          { treasury: seller.treasury },
          { operator: seller.operator }
        ])
        .filter(
          (role: any) =>
            ((Object.values(role)[0] as string) || "").toLowerCase() ==
            sellerAddress
        )
        .map(
          (role: any) =>
            Object.keys(role)[0] as "admin" | "clerk" | "treasury" | "operator"
        );
      const isLensSeller = sellers.find(
        (seller: any) => seller.authTokenType === authTokenTypes.Lens
      );
      return {
        sellers,
        sellerType: isLensSeller
          ? Array.from(new Set(["admin", ...rolesWithSameAddress]).values())
          : rolesWithSameAddress
      };
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
  const sellerType: string[] = resultById?.data
    ? Object.keys(resultById.data)
    : resultByAddress?.data?.sellerType || [];
  const sellerIdsToQuery: string[] =
    sellerAddressType === "SELLER_ID" ? [sellerAddress as string] : [];
  const sellerById = useQuery(
    ["current-seller-by-id", { sellerIds: sellerIdsToQuery }],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          authTokenId: string;
          authTokenType: number;
          admin: string;
          clerk: string;
          treasury: string;
          operator: string;
          id: string;
          voucherCloneAddress: string;
          active: boolean;
        }[];
      }>(
        gql`
          query GetSellerBySellerId($sellerIds: [String]) {
            sellers(where: { sellerIds: $sellerIds }) {
              authTokenId
              authTokenType
              admin
              clerk
              treasury
              operator
              id
              voucherCloneAddress
              active
            }
          }
        `,
        { sellerIds: sellerIdsToQuery }
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
      enabled: !!sellerIdsToQuery?.length
    }
  );
  const sellerValues = useMemo(
    () =>
      sellerAddressType === "ADDRESS"
        ? resultByAddress.data?.sellers || []
        : [sellerById?.data] || [],

    [resultByAddress.data?.sellers, sellerAddressType, sellerById?.data]
  );
  const profileIds = useMemo(
    () =>
      sellerValues.map((seller: any) => getLensTokenIdHex(seller?.authTokenId)),
    [sellerValues]
  );

  const resultLens = useGetLensProfiles(
    {
      profileIds
    },
    {
      enabled:
        !!sellerAddress &&
        !!sellerValues &&
        !!sellerAddressType &&
        !!profileIds.length
    }
  );
  const lens: Profile[] = useMemo(() => {
    return {
      ...((resultLens?.data?.items as Profile[]) ?? [])
    };
  }, [resultLens?.data]);
  // console.log({ sellerType, sellerValues });
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
    sellerIds: resultByAddress.data?.sellers.map(
      (seller: any) => seller.id
    ) ?? [sellerAddress],
    sellerType,
    sellers: sellerValues,
    lens
  };
}

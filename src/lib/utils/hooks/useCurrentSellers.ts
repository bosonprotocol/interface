import { subgraph } from "@bosonprotocol/react-kit";
import { useMemo } from "react";

import { Profile } from "./lens/graphql/generated";

interface Props {
  address?: string;
  sellerId?: string;
  lensTokenId?: string;
}

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
  // const coreSDK = useCoreSDK();
  // const { address: loggedInUserAddress } = useAccount();
  // const sellerAddress =
  //   address || sellerId || lensTokenId || loggedInUserAddress || null;
  // const sellerAddressType = useMemo(() => {
  //   if (sellerAddress) {
  //     if (address) {
  //       return "ADDRESS";
  //     }
  //     if (sellerId) {
  //       return "SELLER_ID";
  //     }
  //     if (lensTokenId) {
  //       return "LENS_TOKEN_ID";
  //     }
  //     return "ADDRESS";
  //   }
  //   return null;
  // }, [address, sellerAddress, sellerId, lensTokenId]);

  // const resultByAddress = useQuery(
  //   ["current-seller-data-by-address", { address: sellerAddress }],
  //   async () => {
  //     if (!sellerAddress) {
  //       return null;
  //     }
  //     const sellers = await coreSDK.getSellersByAddress(sellerAddress);

  //     const rolesWithSameAddress = sellers
  //       .flatMap((seller) => [
  //         { admin: seller.admin },
  //         { clerk: seller.clerk },
  //         { treasury: seller.treasury },
  //         { operator: seller.operator }
  //       ])
  //       .filter((role) => {
  //         return (
  //           ((Object.values(role)[0] as string) || "").toLowerCase() ==
  //           sellerAddress.toLowerCase()
  //         );
  //       })
  //       .map(
  //         (role) =>
  //           Object.keys(role)[0] as "admin" | "clerk" | "treasury" | "operator"
  //       );
  //     const isLensSeller = sellers.find(
  //       (seller) => seller.authTokenType === authTokenTypes.LENS
  //     );
  //     return {
  //       sellers,
  //       sellerType: isLensSeller
  //         ? Array.from(new Set(["admin", ...rolesWithSameAddress]).values())
  //         : rolesWithSameAddress
  //     };
  //   },
  //   {
  //     enabled: !!sellerAddress && sellerAddressType === "ADDRESS"
  //   }
  // );

  // const resultById = useQuery(
  //   ["current-seller-data-by-id", { sellerId: sellerAddress }],
  //   async () => {
  //     const result = await fetchSubgraph<{
  //       sellers: {
  //         sellerId: string;
  //         admin: string;
  //         clerk: string;
  //         operator: string;
  //         treasury: string;
  //       }[];
  //     }>(
  //       gql`
  //         query GetSellerById($sellerId: String) {
  //           sellers(where: { sellerId: $sellerId }) {
  //             sellerId
  //             admin
  //             clerk
  //             operator
  //             treasury
  //           }
  //         }
  //       `,
  //       { sellerId: sellerAddress }
  //     );
  //     const allProps = {
  //       admin: result?.sellers[0]?.admin || null,
  //       clerk: result?.sellers[0]?.clerk || null,
  //       operator: result?.sellers[0]?.operator || null,
  //       treasury: result?.sellers[0]?.treasury || null
  //     };
  //     return Object.fromEntries(
  //       Object.entries(allProps).filter(([, value]) => value !== null)
  //     );
  //   },
  //   {
  //     enabled: !!sellerAddress && sellerAddressType === "SELLER_ID"
  //   }
  // );

  // const decimalLensTokenId = lensTokenId
  //   ? getLensTokenIdDecimal(lensTokenId)?.toString()
  //   : null;
  // const resultByLensId = useQuery(
  //   [
  //     "current-seller-data-by-lens-id",
  //     { authTokenId: decimalLensTokenId, authTokenType: authTokenTypes.LENS }
  //   ],
  //   async () => {
  //     const result = await fetchSubgraph<{
  //       sellers: {
  //         sellerId: string;
  //         admin: string;
  //         clerk: string;
  //         operator: string;
  //         treasury: string;
  //       }[];
  //     }>(
  //       gql`
  //         query GetSellerByLensId($authTokenId: String, $authTokenType: Int) {
  //           sellers(
  //             where: {
  //               authTokenId: $authTokenId
  //               authTokenType: $authTokenType
  //             }
  //           ) {
  //             sellerId
  //             admin
  //             clerk
  //             operator
  //             treasury
  //           }
  //         }
  //       `,
  //       { authTokenId: decimalLensTokenId, authTokenType: authTokenTypes.LENS }
  //     );
  //     const allProps = {
  //       sellerId: result?.sellers[0]?.sellerId || null,
  //       admin: result?.sellers[0]?.admin || null,
  //       clerk: result?.sellers[0]?.clerk || null,
  //       operator: result?.sellers[0]?.operator || null,
  //       treasury: result?.sellers[0]?.treasury || null
  //     };
  //     return Object.fromEntries(
  //       Object.entries(allProps).filter(([, value]) => value !== null)
  //     );
  //   },
  //   {
  //     enabled: !!decimalLensTokenId && sellerAddressType === "LENS_TOKEN_ID"
  //   }
  // );

  // const sellerType: string[] = resultById?.data
  //   ? Object.keys(resultById.data)
  //   : resultByLensId?.data
  //   ? Object.keys(resultByLensId.data)
  //   : resultByAddress?.data?.sellerType || [];

  // const sellerIdsToQuery: string[] =
  //   sellerAddressType === "SELLER_ID"
  //     ? [sellerAddress as string]
  //     : sellerAddressType === "LENS_TOKEN_ID" && resultByLensId?.data?.sellerId
  //     ? [resultByLensId?.data.sellerId]
  //     : [];
  // const sellerById = useQuery(
  //   ["current-seller-by-id", { sellerIds: sellerIdsToQuery }],
  //   async () => {
  //     const result = await fetchSubgraph<{
  //       sellers: {
  //         authTokenId: string;
  //         authTokenType: number;
  //         admin: string;
  //         clerk: string;
  //         treasury: string;
  //         operator: string;
  //         id: string;
  //         voucherCloneAddress: string;
  //         active: boolean;
  //       }[];
  //     }>(
  //       gql`
  //         query GetSellerBySellerId($sellerIds: [String]) {
  //           sellers(where: { sellerId_in: $sellerIds }) {
  //             authTokenId
  //             authTokenType
  //             admin
  //             clerk
  //             treasury
  //             operator
  //             id
  //             voucherCloneAddress
  //             active
  //           }
  //         }
  //       `,
  //       { sellerIds: sellerIdsToQuery }
  //     );

  //     const currentSeller = result?.sellers?.[0] || null;

  //     const currentSellerRoles = {
  //       admin: currentSeller?.admin || null,
  //       clerk: currentSeller?.clerk || null,
  //       operator: currentSeller?.operator || null,
  //       treasury: currentSeller?.treasury || null
  //     };
  //     const currentSellerRolesWithoutNull = Object.fromEntries(
  //       Object.entries(currentSellerRoles).filter(([, value]) => value !== null)
  //     );

  //     return {
  //       ...currentSeller,
  //       sellerAddress:
  //         (currentSellerRolesWithoutNull &&
  //           Object.values(currentSellerRolesWithoutNull)[0]) ??
  //         null
  //     };
  //   },
  //   {
  //     enabled: !!sellerIdsToQuery?.length
  //   }
  // );
  // const sellerValues = useMemo(
  //   () =>
  //     (sellerAddressType === "ADDRESS"
  //       ? resultByAddress.data?.sellers || []
  //       : ([sellerById?.data] as unknown as subgraph.SellerFieldsFragment[]) ||
  //         []
  //     ).filter((value) => !!value),

  //   [resultByAddress.data?.sellers, sellerAddressType, sellerById?.data]
  // );
  // const profileIds = useMemo(
  //   () =>
  //     sellerValues
  //       .filter((seller) => !!Number(seller?.authTokenId))
  //       .map((seller) => getLensTokenIdHex(seller?.authTokenId))
  //       .filter((value) => !!value),
  //   [sellerValues]
  // );

  // const resultLens = useGetLensProfiles(
  //   {
  //     profileIds
  //   },
  //   {
  //     enabled:
  //       !!sellerAddress &&
  //       !!sellerValues &&
  //       !!sellerAddressType &&
  //       !!profileIds.length
  //   }
  // );
  // const lens: Profile[] = useMemo(() => {
  //   return (resultLens?.data?.items as Profile[]) ?? [];
  // }, [resultLens?.data]);
  // const sellerIds = useMemo(() => {
  //   return (
  //     resultByAddress.data
  //       ? resultByAddress.data.sellers.map((seller) => seller.id)
  //       : sellerAddressType === "SELLER_ID"
  //       ? [sellerAddress]
  //       : []
  //   ).filter((sellerId) => !!sellerId) as string[];
  // }, [resultByAddress.data, sellerAddress, sellerAddressType]);
  const sellerIds = useMemo(() => ["1"], []);
  const sellerType = useMemo(() => ["admin"], []);
  const sellers = useMemo(
    () =>
      [
        {
          id: "12",
          admin: "0x0000000000000000000000000000000000000000",
          clerk: "0x6967d7acd1ec5f210e9590666498e0cc5d13a843",
          authTokenId: "19118",
          authTokenType: 2,
          treasury: "0x6967d7acd1ec5f210e9590666498e0cc5d13a843",
          operator: "0x6967d7acd1ec5f210e9590666498e0cc5d13a843"
        }
      ] as subgraph.SellerFieldsFragment[],
    []
  );
  const lens = useMemo(
    () =>
      [
        {
          bio: "bio",
          id: "0x123",
          handle: "handle.test"
        }
      ] as Profile[],
    []
  );
  console.log("useCurrentSeller");
  return {
    isSuccess: true,
    isLoading: false,
    isError: false,
    sellerIds,
    sellerType,
    sellers,
    lens
    // isSuccess:
    //   resultById?.isSuccess ||
    //   resultByAddress?.isSuccess ||
    //   resultByLensId?.isSuccess ||
    //   sellerById?.isSuccess ||
    //   resultLens?.isSuccess,
    // isLoading:
    //   resultById?.isLoading ||
    //   resultByAddress?.isLoading ||
    //   resultByLensId?.isLoading ||
    //   sellerById?.isLoading ||
    //   resultLens?.isLoading,
    // isError:
    //   resultById?.isError ||
    //   resultByAddress?.isError ||
    //   resultByLensId?.isError ||
    //   sellerById?.isError ||
    //   resultLens?.isError,
    // sellerIds,
    // sellerType,
    // sellers: sellerValues,
    // lens
  };
}

import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { AuthTokenType, OfferOrSellerMetadata } from "@bosonprotocol/react-kit";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";

import {
  ContactPreference,
  ProfileType
} from "../../../../components/modal/components/Profile/const";
import { CreateProfile } from "../../../../components/product/utils";
import { getIpfsGatewayUrl } from "../../ipfs";
import { removeEmpty } from "../../objects";
import { useCurrentSellers } from "../useCurrentSellers";
import useStoreSellerMetadata from "./useStoreSellerMetadata";
import useUpdateSeller from "./useUpdateSeller";

type Props = Parameters<typeof updateSellerMedatata>[0];
type SellerMetadata = Extract<OfferOrSellerMetadata, { type: "SELLER" }>;
type SalesChannels = SellerMetadata["salesChannels"];
type UpdateSellerFn = ReturnType<typeof useUpdateSeller>["mutateAsync"];
type StoreSellerMetadataFn = ReturnType<
  typeof useStoreSellerMetadata
>["mutateAsync"];

export default function useUpdateSellerMetadata() {
  const { sellers: currentSellers, lens } = useCurrentSellers();
  const { address = "" } = useAccount();
  const seller = currentSellers?.length ? currentSellers[0] : undefined;
  const { mutateAsync: updateSeller } = useUpdateSeller();
  const { mutateAsync: storeSellerMetadata } = useStoreSellerMetadata();

  return useMutation((props: Props) => {
    if (!seller) {
      const error = new Error(
        "[useUpdateSellerMetadata] cannot update a seller if the seller doesnt exist"
      );
      console.error(error);
      throw error;
    }
    if (!address) {
      const error = new Error(
        "[useUpdateSellerMetadata] cannot update a seller if the address is falsy"
      );
      console.error(error);
      throw error;
    }
    const lensProfile = lens?.length ? lens[0] : undefined;
    const useLens = seller.metadata?.kind
      ? seller.metadata?.kind === ProfileType.LENS &&
        seller.authTokenType === AuthTokenType.LENS
      : !!lensProfile;
    const currentKind = useLens ? ProfileType.LENS : ProfileType.REGULAR;
    return updateSellerMedatata(
      {
        kind: currentKind,
        ...props,
        values: { authTokenId: seller.authTokenId, ...props.values }
      },
      { seller, address },
      {
        updateSeller,
        storeSellerMetadata
      }
    );
  });
}
async function updateSellerMedatata(
  {
    values,
    kind: kindOrCurrentKind
  }: {
    values: Partial<
      CreateProfile &
        Pick<CreateProfile, "contactPreference"> & {
          authTokenId: string;
        } & { salesChannels: SalesChannels }
    >;
    kind?: ProfileType;
  },
  { seller, address }: { seller: SellerFieldsFragment; address: string },
  {
    updateSeller,
    storeSellerMetadata
  }: {
    updateSeller: UpdateSellerFn;
    storeSellerMetadata: StoreSellerMetadataFn;
  }
) {
  const logo = values?.logo?.[0];
  const cover = values?.coverPicture?.[0];
  const logoImage = getIpfsGatewayUrl(logo?.src || "");
  const coverPicture = getIpfsGatewayUrl(cover?.src || "");
  const metadataImages = seller.metadata?.images as SellerMetadata["images"];
  const metadataImagesToSave =
    logoImage || coverPicture
      ? [
          ...(logoImage
            ? [
                {
                  url: logoImage,
                  tag: "profile",
                  height: logo?.height ?? undefined,
                  type: logo?.type,
                  width: logo?.width ?? undefined
                }
              ]
            : []),
          ...(coverPicture
            ? [
                {
                  url: coverPicture,
                  tag: "cover",
                  height: cover?.height ?? undefined,
                  type: cover?.type,
                  width: cover?.width ?? undefined
                }
              ]
            : [])
        ]
      : metadataImages ?? undefined;

  const kindUsed = kindOrCurrentKind || ProfileType.REGULAR;
  const meta: Parameters<typeof storeSellerMetadata>[0] = {
    ...seller.metadata,
    name: seller.metadata?.name ?? undefined,
    description: seller.metadata?.description ?? undefined,
    contactLinks: seller.metadata?.contactLinks ?? undefined,
    legalTradingName: seller.metadata?.legalTradingName ?? undefined,
    website: seller.metadata?.website ?? undefined,
    ...(values.name && { name: values.name }),
    ...(values.description && { description: values.description }),
    ...(values.email && {
      contactLinks: [{ url: values.email, tag: "email" }]
    }),
    contactPreference:
      values.contactPreference?.value ||
      (seller.metadata?.contactPreference as ContactPreference) ||
      ContactPreference.XMTP,
    kind: kindUsed,
    ...(values.legalTradingName && {
      legalTradingName: values.legalTradingName
    }),
    socialLinks: [],
    ...(values.website && { website: values.website }),
    images: metadataImagesToSave,
    salesChannels:
      values.salesChannels ?? seller.metadata?.salesChannels
        ? (seller.metadata?.salesChannels?.map((saleChannel) =>
            removeEmpty(saleChannel)
          ) as SalesChannels)
        : undefined
  };
  const { metadataUri } = await storeSellerMetadata(meta);
  await updateSeller({
    ...seller,
    admin: address,
    authTokenId: values.authTokenId ?? "0",
    authTokenType:
      kindUsed === ProfileType.LENS ? AuthTokenType.LENS : AuthTokenType.NONE,
    sellerId: seller.id,
    metadataUri
  });
}

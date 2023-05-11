import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { AuthTokenType } from "@bosonprotocol/react-kit";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";

import { ProfileType } from "../../../../components/modal/components/Profile/const";
import { CreateProfile } from "../../../../components/product/utils";
import { getIpfsGatewayUrl } from "../../ipfs";
import { useCurrentSellers } from "../useCurrentSellers";
import useStoreSellerMetadata from "./useStoreSellerMetadata";
import useUpdateSeller from "./useUpdateSeller";

type Props = Parameters<typeof updateSellerMedatata>[0];

type UpdateSellerFn = ReturnType<typeof useUpdateSeller>["mutateAsync"];
type StoreSellerMetadataFn = ReturnType<
  typeof useStoreSellerMetadata
>["mutateAsync"];

export default function useUpdateSellerMetadata() {
  const { sellers: currentSellers } = useCurrentSellers();
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
    return updateSellerMedatata(
      props,
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
    kind
  }: {
    values: Partial<CreateProfile> &
      Pick<CreateProfile, "contactPreference"> & { authTokenId: string };
    kind: ProfileType;
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
  const { metadataUri } = await storeSellerMetadata({
    name: values.name,
    description: values.description,
    contactLinks: values.email ? [{ url: values.email, tag: "email" }] : [],
    contactPreference: values.contactPreference.value,
    kind,
    legalTradingName: values.legalTradingName,
    socialLinks: [],
    website: values.website,
    images: [
      ...(logoImage
        ? [
            {
              url: logoImage,
              tag: "profile",
              height: logo?.height ?? undefined,
              type: "IMAGE",
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
              type: "IMAGE",
              width: cover?.width ?? undefined
            }
          ]
        : [])
    ]
  });
  await updateSeller({
    ...seller,
    admin: address,
    authTokenId: values.authTokenId,
    authTokenType:
      kind === ProfileType.LENS ? AuthTokenType.LENS : AuthTokenType.NONE,
    sellerId: seller.id,
    metadataUri
  });
}

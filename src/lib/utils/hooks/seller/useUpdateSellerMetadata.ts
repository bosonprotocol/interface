import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useMutation } from "react-query";

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
  const seller = currentSellers?.length ? currentSellers[0] : undefined;
  const { mutateAsync: updateSeller } = useUpdateSeller();
  const { mutateAsync: storeSellerMetadata } = useStoreSellerMetadata();

  return useMutation((props: Props) => {
    if (!seller) {
      const error = new Error(
        "cannot update a seller if the seller doesnt exist"
      );
      console.error(error);
      throw error;
    }
    return updateSellerMedatata(
      props,
      { seller },
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
    values: CreateProfile;
    kind: ProfileType;
  },
  { seller }: { seller: SellerFieldsFragment },
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
    contactLinks: [{ url: values.email, tag: "email" }],
    contactPreference: values.contactPreference.value,
    kind,
    legalTradingName: values.legalTradingName ?? "",
    socialLinks: [],
    website: values.website,
    images: [
      {
        url: logoImage,
        tag: "profile",
        height: logo?.height ?? undefined,
        type: "IMAGE",
        width: logo?.width ?? undefined
      },
      {
        url: coverPicture,
        tag: "cover",
        height: cover?.height ?? undefined,
        type: "IMAGE",
        width: cover?.width ?? undefined
      }
    ]
  });
  await updateSeller({
    ...seller,
    sellerId: seller.id,
    metadataUri
  });
}

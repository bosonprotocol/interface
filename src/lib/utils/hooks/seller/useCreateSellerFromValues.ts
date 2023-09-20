import { AuthTokenType } from "@bosonprotocol/react-kit";
import { useMutation } from "react-query";

import { BosonAccount } from "../../../../components/modal/components/Profile/bosonAccount/validationSchema";
import { ProfileType } from "../../../../components/modal/components/Profile/const";
import { CreateProfile } from "../../../../components/product/utils";
import { getIpfsGatewayUrl } from "../../ipfs";
import { useAccount } from "../ethers/connection";
import useCreateSeller from "./useCreateSeller";
import useStoreSellerMetadata from "./useStoreSellerMetadata";

type Props = Parameters<typeof createSellerFromValues>[0];

type CreateSellerFn = ReturnType<typeof useCreateSeller>["mutateAsync"];
type StoreSellerMetadataFn = ReturnType<
  typeof useStoreSellerMetadata
>["mutateAsync"];

export default function useCreateSellerFromValues() {
  const { account: address } = useAccount();
  const { mutateAsync: createSeller } = useCreateSeller();
  const { mutateAsync: storeSellerMetadata } = useStoreSellerMetadata();

  return useMutation((props: Props) => {
    return createSellerFromValues(
      props,
      { address: address ?? "" },
      {
        createSeller,
        storeSellerMetadata
      }
    );
  });
}
async function createSellerFromValues(
  {
    values,
    bosonAccount,
    authTokenId,
    authTokenType,
    kind
  }: {
    values: CreateProfile;
    bosonAccount: BosonAccount;
    authTokenId?: string | null;
    authTokenType?: typeof AuthTokenType[keyof typeof AuthTokenType];
    kind: ProfileType;
  },
  { address }: { address: string },
  {
    createSeller,
    storeSellerMetadata
  }: {
    createSeller: CreateSellerFn;
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
        type: logo?.type,
        width: logo?.width ?? undefined
      },
      {
        url: coverPicture,
        tag: "cover",
        height: cover?.height ?? undefined,
        type: cover?.type,
        width: cover?.width ?? undefined,
        fit: cover?.fit,
        position: cover?.position
      }
    ]
  });
  const createdSellerId = await createSeller({
    address: address || "",
    royaltyPercentage: bosonAccount.secondaryRoyalties || 0,
    addressForRoyaltyPayment: bosonAccount.addressForRoyaltyPayment || "",
    name: values.name,
    description: values.description,
    authTokenId: authTokenId ?? "0",
    authTokenType: authTokenType ?? AuthTokenType.NONE,
    profileLogoUrl: logoImage,
    metadataUri
  });
  return createdSellerId;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from "formik";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../lib/routing/routes";
import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../lib/utils/hooks/useLocalStorage";
import Navigate from "../customNavigation/Navigate";
import { FormField } from "../form";
import { authTokenTypes } from "../modal/components/Profile/Lens/const";
import { getLensTokenIdDecimal } from "../modal/components/Profile/Lens/utils";
import { buildProfileFromMetadata } from "../modal/components/Profile/utils";
import { useModal } from "../modal/useModal";
import BosonButton from "../ui/BosonButton";
import Grid from "../ui/Grid";
import GridContainer from "../ui/GridContainer";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
import differentVariantsProduct from "./img/different-variants-product.png";
import oneItemTypeProduct from "./img/one-item-product.png";
import phygitalProduct from "./img/phygital-product.png";
import physicalProduct from "./img/physical-product.png";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  CreateProductForm,
  CreateProfile,
  CreateYourProfile,
  initialValues
} from "./utils";
import { useCreateForm } from "./utils/useCreateForm";

const productTypeItemsPerRow = {
  xs: 1,
  s: 1,
  m: 1,
  l: 1,
  xl: 1
};
const Label = styled.label`
  max-width: 12.5rem;
  align-items: center;
  border: 1px solid ${colors.lightGrey};
  width: 100%;
  text-align: center;
  margin-top: 0.25rem;
  background: transparent;
  height: 197px;
  cursor: pointer;
`;
const RadioButton = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  img {
    cursor: pointer;
  }
  &:checked + div {
    border: 1px solid ${colors.green};
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
      0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);
  }
  &:disabled + div {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Box = styled.div`
  padding: 1.75rem;
  height: 100%;
  width: 100%;
  p {
    display: block;
  }
  p:first {
    margin: 0.938rem 0 0 0;
  }
`;
const Container = styled.div`
  max-width: 26.5rem;
`;

const ProductImage = styled(Image)`
  width: 6.25rem;
  height: 6.25rem;
  padding-top: 0;
  margin: auto;
`;

interface Props {
  showCreateProductDraftModal: () => void;
  showInvalidRoleModal: () => void;
  isDraftModalClosed: boolean;
}

export default function ProductType({
  showCreateProductDraftModal,
  showInvalidRoleModal,
  isDraftModalClosed
}: Props) {
  const { address } = useAccount();
  const { handleChange, values, nextIsDisabled } = useCreateForm();
  const [createYourProfile, metaCreateYourProfile, helpersCreateYourProfile] =
    useField<CreateYourProfile["createYourProfile"]>("createYourProfile");
  const isProfileSetFromForm = (
    Object.keys(createYourProfile.value) as Array<
      keyof typeof createYourProfile.value
    >
  ).some((key) => {
    if (key === "contactPreference") {
      return (
        createYourProfile.value[key].value !==
        metaCreateYourProfile.initialValue?.[key].value
      );
    }
    if (key === "coverPicture" || key === "logo") {
      return (
        createYourProfile.value[key]?.[0]?.src !==
        metaCreateYourProfile.initialValue?.[key]?.[0]?.src
      );
    }
    return (
      createYourProfile.value[key] !== metaCreateYourProfile.initialValue?.[key]
    );
  });
  const { showModal, store } = useModal();
  // const fileName = useMemo<CreateProductImageCreteYourProfileLogo>(
  //   () => `create-product-image_createYourProfile.logo`,
  //   []
  // );
  // const [, setBase64] = useLocalStorage<GetItemFromStorageKey | null>(
  //   fileName as GetItemFromStorageKey,
  //   null
  // );
  const {
    sellers: currentSellers,
    sellerType: currentRoles,
    lens,
    isLoading,
    isRefetching,
    isSuccess,
    isFetching,
    refetch
  } = useCurrentSellers();
  const [shownDraftModal, setShowDraftModal] = useState<boolean>(false);

  const [isRegularSellerSet, setIsRegularSeller] = useState<boolean>(false);
  const isAssistant = currentRoles?.find((role) => role === "assistant");
  const isClerk = currentRoles?.find((role) => role === "clerk");
  const isAdmin = currentRoles?.find((role) => role === "admin");
  const isSellerNotAssistant = (isClerk || isAdmin) && !isAssistant;

  // If the seller exists but no LENS profile attached to it, it's a regular seller
  // const isRegularSeller =
  //   currentSellers && currentSellers?.length > 0 && !lens?.length;

  const isAdminLinkedToLens =
    !isLoading &&
    isSuccess &&
    !!currentSellers.some((seller, index) => {
      return (
        seller.authTokenType === authTokenTypes.LENS &&
        seller.authTokenId === getLensTokenIdDecimal(lens[index].id).toString()
      );
    });

  const hasValidAdminAccount = isAdminLinkedToLens;
  const isSeller = !!currentSellers.length;
  const seller = currentSellers?.[0];
  // const currentAssistant = currentSellers.find((seller) => {
  //   return seller.assistant.toLowerCase() === address?.toLowerCase();
  // }); // lens profile of the current user
  // const assistantLens: Profile | null = useMemo(
  //   () =>
  //     lens.find((lensProfile) => {
  //       const lensIdDecimal = getLensTokenIdDecimal(lensProfile.id).toString();
  //       const authTokenId = currentAssistant?.authTokenId;
  //       return lensIdDecimal === authTokenId;
  //     }) || null,
  //   [currentAssistant?.authTokenId, lens]
  // );
  const setProfileInForm = useCallback(
    (regularProfile: CreateYourProfile["createYourProfile"]) => {
      helpersCreateYourProfile.setValue(regularProfile);
      // Save values in local storage in case Edit draft is chosen in the next step
      const currentValues = getItemFromStorage<CreateProductForm | null>(
        "create-product",
        null
      );
      const newValues: CreateProductForm = {
        ...initialValues,
        ...currentValues,
        createYourProfile: regularProfile
      };
      saveItemInStorage("create-product", newValues);
      setIsRegularSeller(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [firstLensProfile] = lens;
  useEffect(() => {
    const metadata = seller?.metadata;
    const authTokenType = seller?.authTokenType;

    if (!isProfileSetFromForm && metadata && authTokenType !== undefined) {
      const profileDataFromMetadata: CreateProfile = buildProfileFromMetadata(
        metadata,
        authTokenType,
        firstLensProfile
      );
      setProfileInForm(profileDataFromMetadata);
    }
  }, [
    isProfileSetFromForm,
    seller?.metadata,
    setProfileInForm,
    firstLensProfile,
    seller?.authTokenType
  ]);

  useEffect(() => {
    if (!(isSuccess && !isRefetching && !isLoading && !isFetching)) {
      return;
    }

    if (isSellerNotAssistant) {
      // The current wallet is not the assistant of the seller
      showInvalidRoleModal();
    } else if (!shownDraftModal) {
      // Show the draft modal to let the user choosing if they wants to use Draft
      setShowDraftModal(true);
      showCreateProductDraftModal();
    } else if (!isRegularSellerSet && !isSeller && isDraftModalClosed) {
      // Seller needs to set their profile
      if (!store.modalType) {
        // Show create profile popup
        showModal(
          "CREATE_PROFILE",
          {
            title: "Create Profile",
            initialRegularCreateProfile: values["createYourProfile"],
            seller: currentSellers?.length ? currentSellers[0] : undefined,
            lensProfile: lens?.length ? lens[0] : undefined,
            onRegularProfileCreated: setProfileInForm,
            closable: false,
            onClose: async () => {
              await refetch();
            }
          },
          "auto",
          undefined,
          {
            xs: `${breakpointNumbers.m + 1}px`
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasValidAdminAccount,
    isSellerNotAssistant,
    isSeller,
    isRegularSellerSet,
    isDraftModalClosed,
    shownDraftModal,
    isFetching,
    isLoading,
    isRefetching,
    isSuccess,
    values.createYourProfile
  ]);

  if (!address) {
    return <Navigate to={{ pathname: BosonRoutes.Root }} />;
  }

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Product Type</SectionTitle>
      <Container>
        <GridContainer itemsPerRow={productTypeItemsPerRow}>
          <FormField
            title="Select Product Type"
            required
            style={{
              marginBottom: 0
            }}
          >
            <Grid>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.productType"
                  value="physical"
                  checked={values.productType.productType === "physical"}
                  onChange={handleChange}
                />
                <Box>
                  <ProductImage src={physicalProduct} />
                  <Typography tag="p">Physical</Typography>
                </Box>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.productType"
                  value="phygital"
                  checked={values.productType.productType === "phygital"}
                  onChange={handleChange}
                  disabled
                />
                <Box>
                  <ProductImage src={phygitalProduct} />
                  <Typography tag="p" margin="1rem 0 0 0">
                    Phygital
                  </Typography>
                  <Typography tag="p" $fontSize="0.7rem" margin="0.3rem 0 0 0">
                    COMING SOON
                  </Typography>
                </Box>
              </Label>
            </Grid>
          </FormField>
          <FormField
            title="Product Variants"
            required
            style={{
              marginBottom: 0
            }}
          >
            <Grid>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.productVariant"
                  value="oneItemType"
                  checked={values.productType.productVariant === "oneItemType"}
                  onChange={handleChange}
                />
                <Box>
                  <ProductImage
                    src={oneItemTypeProduct}
                    style={{
                      width: "62px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography tag="p">One item type</Typography>
                </Box>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.productVariant"
                  value="differentVariants"
                  checked={
                    values.productType.productVariant === "differentVariants"
                  }
                  onChange={handleChange}
                />
                <Box>
                  <ProductImage
                    src={differentVariantsProduct}
                    style={{
                      width: "54px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography tag="p">Different Variants</Typography>
                </Box>
              </Label>
            </Grid>
          </FormField>
        </GridContainer>
        <ProductButtonGroup>
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={nextIsDisabled}
          >
            Next
          </BosonButton>
        </ProductButtonGroup>
      </Container>
    </ContainerProductPage>
  );
}

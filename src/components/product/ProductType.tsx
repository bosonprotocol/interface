/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { useAccountDrawer } from "components/header/accountDrawer";
import { useField } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../lib/routing/routes";
import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useGetSellerMetadata } from "../../lib/utils/hooks/seller/useGetSellerMetadata";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../lib/utils/hooks/useLocalStorage";
import Navigate from "../customNavigation/Navigate";
import { Error as SimpleError, FormField } from "../form";
import { authTokenTypes } from "../modal/components/Profile/Lens/const";
import { getLensTokenIdDecimal } from "../modal/components/Profile/Lens/utils";
import { buildProfileFromMetadata } from "../modal/components/Profile/utils";
import { useModal } from "../modal/useModal";
import { getSellerCenterPath } from "../seller/paths";
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
  getOptionsCurrencies,
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
export const Label = styled.label`
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
export const RadioButton = styled.input`
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

export const Box = styled.div`
  padding: 0.875rem;
  height: 100%;
  width: 100%;
  p {
    display: block;
  }
  p:first {
    margin: 0.938rem 0 0 0;
  }
`;

export const RadioButtonText = styled(Typography).attrs({
  tag: "p",
  fontWeight: "600",
  $fontSize: "1rem",
  margin: "1.5rem 0",
  color: colors.darkGrey
})``;

const Container = styled.div`
  max-width: 26.5rem;
`;

export const ProductImage = styled(Image)`
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
  const { config } = useConfigContext();
  const [connectModalOpen, openConnectModal] = useAccountDrawer();
  const navigate = useKeepQueryParamsNavigate();
  const { address } = useAccount();
  const { handleChange, values, nextIsDisabled, handleBlur, errors, touched } =
    useCreateForm();
  const [createYourProfile, metaCreateYourProfile, helpersCreateYourProfile] =
    useField<CreateYourProfile["createYourProfile"]>("createYourProfile");
  const isProfileSetFromForm = (
    Object.keys(createYourProfile.value || {}) as Array<
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

  const isAdminLinkedToLens =
    !isLoading &&
    isSuccess &&
    !!currentSellers.some((seller, index) => {
      return (
        seller.authTokenType === authTokenTypes.LENS &&
        seller.authTokenId === getLensTokenIdDecimal(lens[index]?.id).toString()
      );
    });

  const hasValidAdminAccount = isAdminLinkedToLens;
  const isSeller = !!currentSellers.length;
  const seller = currentSellers?.[0];
  const { refetch: fetchSellerMetadata } = useGetSellerMetadata(
    {
      seller
    },
    {
      enabled: false
    }
  );

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
        coreTermsOfSale: {
          ...initialValues.coreTermsOfSale,
          currency: getOptionsCurrencies(config.envConfig)[0]
        },
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
    const metadataUri = seller?.metadataUri;

    if (
      !isProfileSetFromForm &&
      (metadata || metadataUri) &&
      authTokenType !== undefined
    ) {
      if (metadata) {
        const profileDataFromMetadata: CreateProfile = buildProfileFromMetadata(
          metadata,
          authTokenType,
          firstLensProfile
        );
        setProfileInForm(profileDataFromMetadata);
      } else {
        (async () => {
          const { data: metadataToUse } = await fetchSellerMetadata();
          if (!metadataToUse) {
            const error = new Error(
              `There was a problem while getting the seller metadata of ${seller.id}`
            );
            console.error(error);
            Sentry.captureException(error);
            return;
          }
          const profileDataFromMetadata: CreateProfile =
            buildProfileFromMetadata(
              metadataToUse,
              authTokenType,
              firstLensProfile
            );
          setProfileInForm(profileDataFromMetadata);
        })();
      }
    }
  }, [
    isProfileSetFromForm,
    fetchSellerMetadata,
    seller?.metadata,
    seller?.id,
    seller?.metadataUri,
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
        showModal("ACCOUNT_CREATION", {
          title: store.modalProps?.title,
          onClose: () => {
            navigate({
              pathname: BosonRoutes.Root
            });
          },
          onClickCreateAccount: () => {
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
        });
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
  const [wasConnectModalOpen, setWasConnectModalOpen] =
    useState<boolean>(false);
  const reactRouterNavigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const prevPath = (state as { prevPath: string })?.prevPath;
  useEffect(() => {
    if (!address && openConnectModal) {
      openConnectModal();
      setWasConnectModalOpen(true);
    }
  }, [address, openConnectModal]);

  if (!address) {
    if (wasConnectModalOpen && !connectModalOpen) {
      if (prevPath && prevPath !== "/sell/create-product") {
        reactRouterNavigate(-1);
      } else {
        return <Navigate to={{ pathname: BosonRoutes.Root }} />;
      }
    }
    return <Typography>Please connect your wallet</Typography>;
  }
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Product type</SectionTitle>
      <Container>
        <GridContainer itemsPerRow={productTypeItemsPerRow}>
          <FormField
            title="Select product type"
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
                  checked={values.productType?.productType === "physical"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Grid
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  style={{ height: "100%" }}
                >
                  <ProductImage src={physicalProduct} />
                  <Typography
                    tag="p"
                    fontWeight="600"
                    $fontSize="1rem"
                    margin="1.5rem 0"
                    color={colors.darkGrey}
                  >
                    Physical
                  </Typography>
                </Grid>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.productType"
                  value="phygital"
                  checked={values.productType?.productType === "phygital"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Grid
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  style={{ height: "100%" }}
                >
                  <ProductImage src={phygitalProduct} />
                  <Typography
                    tag="p"
                    fontWeight="600"
                    $fontSize="1rem"
                    margin="1rem 0 0 0"
                    color={colors.darkGrey}
                  >
                    Phygital
                  </Typography>
                  <Typography
                    tag="p"
                    fontWeight="600"
                    $fontSize="0.7rem"
                    margin="0.3rem 0 1.3125rem 0"
                    color={colors.darkGrey}
                  >
                    COMING SOON
                  </Typography>
                </Grid>
              </Label>
            </Grid>
            <SimpleError
              display={
                touched.productType?.productType &&
                !!errors?.productType?.productType
              }
              message={errors?.productType?.productType}
            />
          </FormField>
          <FormField
            title="Product variants"
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
                  checked={values.productType?.productVariant === "oneItemType"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Grid
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  style={{ height: "100%" }}
                >
                  <ProductImage
                    src={oneItemTypeProduct}
                    style={{
                      width: "62px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <RadioButtonText>One item type</RadioButtonText>
                </Grid>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.productVariant"
                  value="differentVariants"
                  checked={
                    values.productType?.productVariant === "differentVariants"
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Grid
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  style={{ height: "100%" }}
                >
                  <ProductImage
                    src={differentVariantsProduct}
                    style={{
                      width: "54px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <RadioButtonText>Different variants</RadioButtonText>
                </Grid>
              </Label>
            </Grid>
            <SimpleError
              display={
                touched.productType?.productVariant &&
                !!errors?.productType?.productVariant
              }
              message={errors?.productType?.productVariant}
            />
          </FormField>
          <FormField
            title="Token Gating"
            required
            style={{
              marginBottom: 0
            }}
          >
            <Grid>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.tokenGatedOffer"
                  value="false"
                  checked={values.productType?.tokenGatedOffer === "false"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Grid
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  style={{ height: "100%" }}
                >
                  <ProductImage
                    src={oneItemTypeProduct}
                    style={{
                      width: "62px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <RadioButtonText>Ungated</RadioButtonText>
                </Grid>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="productType.tokenGatedOffer"
                  value="true"
                  checked={values.productType?.tokenGatedOffer === "true"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Grid
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  style={{ height: "100%" }}
                >
                  <ProductImage
                    src={differentVariantsProduct}
                    style={{
                      width: "54px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <RadioButtonText>Token gated</RadioButtonText>
                </Grid>
              </Label>
            </Grid>
            <SimpleError
              display={
                touched.productType?.tokenGatedOffer &&
                !!errors?.productType?.tokenGatedOffer
              }
              message={errors?.productType?.tokenGatedOffer}
            />
          </FormField>
        </GridContainer>
        <ProductButtonGroup>
          <BosonButton
            variant="accentInverted"
            type="button"
            style={{
              whiteSpace: "pre"
            }}
            onClick={() => {
              navigate({
                pathname: getSellerCenterPath("Dashboard")
              });
            }}
          >
            Seller Hub
          </BosonButton>
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

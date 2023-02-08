/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { CONFIG } from "../../lib/config";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { fetchIpfsBase64Media } from "../../lib/utils/base64";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import {
  CreateProductImageCreteYourProfileLogo,
  getItemFromStorage,
  GetItemFromStorageKey,
  saveItemInStorage,
  useLocalStorage
} from "../../lib/utils/hooks/useLocalStorage";
import Navigate from "../customNavigation/Navigate";
import { FormField } from "../form";
import { authTokenTypes } from "../modal/components/CreateProfile/Lens/const";
import ProfileMultiSteps from "../modal/components/CreateProfile/Lens/ProfileMultiSteps";
import {
  getLensEmail,
  getLensProfilePictureUrl,
  getLensTokenIdDecimal,
  getLensWebsite
} from "../modal/components/CreateProfile/Lens/utils";
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
import { CreateProductForm, CreateYourProfile, initialValues } from "./utils";
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
  const [, , helpersCreateYourProfile] =
    useField<CreateYourProfile["createYourProfile"]>("createYourProfile");
  const ipfsMetadataStorage = useIpfsStorage();
  const { showModal, store, updateProps } = useModal();
  const fileName = useMemo<CreateProductImageCreteYourProfileLogo>(
    () => `create-product-image_createYourProfile.logo`,
    []
  );
  const [, setBase64] = useLocalStorage<GetItemFromStorageKey | null>(
    fileName as GetItemFromStorageKey,
    null
  );
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
  const isOperator = currentRoles?.find((role) => role === "operator");
  const isClerk = currentRoles?.find((role) => role === "clerk");
  const isAdmin = currentRoles?.find((role) => role === "admin");
  const isSellerNotOperator = (isClerk || isAdmin) && !isOperator;

  const isAdminLinkedToLens =
    !isLoading &&
    isSuccess &&
    !!currentSellers.some((seller, index) => {
      return (
        seller.authTokenType === authTokenTypes.LENS &&
        seller.authTokenId === getLensTokenIdDecimal(lens[index].id).toString()
      );
    });

  const hasValidAdminAccount =
    (CONFIG.lens.enabled && isAdminLinkedToLens) || !CONFIG.lens.enabled;
  const isSeller = !!currentSellers.length;
  const currentOperator = currentSellers.find((seller) => {
    return seller.operator.toLowerCase() === address?.toLowerCase();
  }); // lens profile of the current user
  const operatorLens: Profile | null = useMemo(
    () =>
      lens.find((lensProfile) => {
        const lensIdDecimal = getLensTokenIdDecimal(lensProfile.id).toString();
        const authTokenId = currentOperator?.authTokenId;
        return lensIdDecimal === authTokenId;
      }) || null,
    [currentOperator?.authTokenId, lens]
  );
  const onRegularProfileCreated = useCallback(
    (regularProfile: CreateYourProfile) => {
      helpersCreateYourProfile.setValue(regularProfile.createYourProfile);
      // Save values in local storage in case Edit draft is chosen in the next step
      const currentValues = getItemFromStorage<CreateProductForm | null>(
        "create-product",
        null
      );
      const newValues: CreateProductForm = {
        ...initialValues,
        ...currentValues,
        createYourProfile: regularProfile.createYourProfile
      };
      saveItemInStorage("create-product", newValues);
      setIsRegularSeller(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    if (CONFIG.lens.enabled && operatorLens) {
      (async () => {
        try {
          const logoUrl = getLensProfilePictureUrl(operatorLens as Profile);
          const [logoBase64] = await fetchIpfsBase64Media(
            [logoUrl],
            ipfsMetadataStorage
          );
          if (!logoBase64) {
            return; // should never happen
          }
          const wrongDataFormat = "data:application/octet-stream;base64,";
          const indexWrongDataFormat = logoBase64.indexOf(wrongDataFormat);
          const fixedBase64 =
            indexWrongDataFormat === -1
              ? logoBase64
              : "data:image/jpeg;base64," +
                logoBase64.substring(
                  indexWrongDataFormat + wrongDataFormat.length
                );
          setBase64(fixedBase64 as any);
          const createYourProfile = {
            logo: [
              {
                src: fixedBase64
              }
            ],
            name: operatorLens.name || "",
            email: getLensEmail(operatorLens as Profile) || "",
            description: operatorLens.bio || "",
            website: getLensWebsite(operatorLens as Profile) || ""
          };
          helpersCreateYourProfile.setValue(createYourProfile);
        } catch (error) {
          console.error(error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsMetadataStorage, operatorLens]);

  useEffect(() => {
    if (!(isSuccess && !isRefetching && !isLoading && !isFetching)) {
      return;
    }

    if (!CONFIG.lens.enabled && !shownDraftModal) {
      setShowDraftModal(true);
      showCreateProductDraftModal();
    } else if (!isRegularSellerSet && isDraftModalClosed) {
      if (store.modalType) {
        if (!CONFIG.lens.enabled) {
          updateProps<"CREATE_PROFILE">({
            ...store,
            modalProps: {
              ...store.modalProps,
              initialRegularCreateProfile: values,
              isSeller: !!isSeller
            }
          });
        }
      } else {
        showModal(
          "CREATE_PROFILE",
          {
            ...(CONFIG.lens.enabled &&
            ((isSeller && !hasValidAdminAccount) || !isSeller)
              ? {
                  headerComponent: (
                    <ProfileMultiSteps
                      createOrSelect={null}
                      activeStep={0}
                      createOrViewRoyalties={null}
                      key="ProductType"
                    />
                  )
                }
              : { title: "Create Profile" }),
            initialRegularCreateProfile: values,
            isSeller: !!isSeller,
            onRegularProfileCreated,
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
    } else if (isSellerNotOperator) {
      showInvalidRoleModal();
    } else if (CONFIG.lens.enabled && !shownDraftModal && !isRegularSellerSet) {
      setShowDraftModal(true);
      showCreateProductDraftModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasValidAdminAccount,
    isSellerNotOperator,
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
                  <Typography tag="p">Phygital</Typography>
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

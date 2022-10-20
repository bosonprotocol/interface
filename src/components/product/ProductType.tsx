/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@bosonprotocol/react-kit";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { CONFIG } from "../../lib/config";
import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { dataURItoBlob, fetchIpfsImage } from "../../lib/utils/base64";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import {
  CreateProductImageCreteYourProfileLogo,
  GetItemFromStorageKey,
  useLocalStorage
} from "../../lib/utils/hooks/useLocalStorage";
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
import { CreateYourProfile } from "./utils";
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
  const { handleChange, values, nextIsDisabled, setFieldValue } =
    useCreateForm();

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
    isSuccess
  } = useCurrentSellers();

  const [shownDraftModal, setShowDraftModal] = useState<boolean>(false);

  const [isRegularSellerSet, setIsRegularSeller] = useState<boolean>(false);
  const isOperator = currentRoles?.find((role) => role === "operator");

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
      setFieldValue("createYourProfile", regularProfile.createYourProfile);
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
          const logoBase64 = await fetchIpfsImage(logoUrl, ipfsMetadataStorage);
          if (!logoBase64) {
            return; // should never happened
          }
          setBase64(logoBase64 as any);
          const createYourProfile = {
            logo: new File([dataURItoBlob(logoBase64)], "logo", {
              type: logoBase64.split(";")[0].split(":")[1]
            }),
            name: operatorLens.name,
            email: getLensEmail(operatorLens as Profile),
            description: operatorLens.bio,
            website: getLensWebsite(operatorLens as Profile)
          };
          setFieldValue("createYourProfile", createYourProfile);
        } catch (error) {
          console.error(error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsMetadataStorage, operatorLens]);

  useEffect(() => {
    if (!isSuccess || isLoading) {
      return;
    }

    if (!CONFIG.lens.enabled && !shownDraftModal) {
      setShowDraftModal(true);
      showCreateProductDraftModal();
    } else if (
      (!isRegularSellerSet && !CONFIG.lens.enabled && isDraftModalClosed) ||
      (CONFIG.lens.enabled &&
        ((isSeller && !hasValidAdminAccount) || !isSeller))
    ) {
      if (store.modalType) {
        if (!CONFIG.lens.enabled) {
          updateProps<"CREATE_PROFILE">({
            ...store,
            modalProps: {
              ...store.modalProps,
              initialRegularCreateProfile: values
            }
          });
        }
      } else {
        showModal(
          "CREATE_PROFILE",
          {
            ...(CONFIG.lens.enabled
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
            onRegularProfileCreated,
            closable: false,
            onClose: () => {
              showCreateProductDraftModal();
            }
          },
          "auto",
          undefined,
          {
            xs: `${breakpointNumbers.m + 1}px`
          }
        );
      }
    } else if (
      isOperator &&
      hasValidAdminAccount &&
      CONFIG.lens.enabled &&
      !shownDraftModal
    ) {
      setShowDraftModal(true);
      showCreateProductDraftModal();
    } else if (CONFIG.lens.enabled && !isOperator) {
      showInvalidRoleModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasValidAdminAccount,
    isOperator,
    isSeller,
    isRegularSellerSet,
    isDraftModalClosed,
    shownDraftModal,
    isLoading,
    isSuccess,
    values.createYourProfile
  ]);

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
                  disabled
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
          <Button variant="primaryFill" type="submit" disabled={nextIsDisabled}>
            Next
          </Button>
        </ProductButtonGroup>
      </Container>
    </ContainerProductPage>
  );
}

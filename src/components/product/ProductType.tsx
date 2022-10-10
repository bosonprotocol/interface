/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { CONFIG } from "../../lib/config";
import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import {
  dataURItoBlob,
  fetchIpfsImage,
  loadAndSetImage
} from "../../lib/utils/base64";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useCurrentSeller } from "../../lib/utils/hooks/useCurrentSeller";
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
import Button from "../ui/Button";
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
}

export default function ProductType({
  showCreateProductDraftModal,
  showInvalidRoleModal
}: Props) {
  const { address } = useAccount();
  const { handleChange, values, nextIsDisabled, setFieldValue } =
    useCreateForm();
  const ipfsMetadataStorage = useIpfsStorage();
  const { showModal } = useModal();
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
    isLoading
  } = useCurrentSeller();
  const admin = currentSellers.find(
    (seller) => seller.admin !== ethers.constants.AddressZero
  );
  const {
    sellers: adminSellers,
    lens,
    isLoading: isAdminLoading
  } = useCurrentSeller({
    address: admin
  });
  const [shownDraftModal, setShowDraftModal] = useState<boolean>(false);

  const [isRegularSellerSet, setIsRegularSeller] = useState<boolean>(false);
  const isOperator = currentRoles?.find((role) => role === "operator");
  const isAdminLinkedToLens = adminSellers.some((adminSeller, index) => {
    return (
      adminSeller.authTokenType === authTokenTypes.Lens &&
      adminSeller.authTokenId ===
        getLensTokenIdDecimal(lens[index].id).toString()
    );
  });
  const hasValidAdminAccount =
    (CONFIG.lens.enabled && isAdminLinkedToLens) || !CONFIG.lens.enabled;
  const isSeller = currentSellers.length;
  const currentOperator = currentSellers.find((seller) => {
    return seller.operator === address;
  }); // lens profile of the current user
  const operatorLens: Profile = lens.find((lensProfile) => {
    return (
      getLensTokenIdDecimal(lensProfile.id) === currentOperator.authTokenId
    );
  });

  const onRegularProfileCreated = useCallback(
    (regularProfile: CreateYourProfile) => {
      if (regularProfile.createYourProfile.logo) {
        loadAndSetImage(
          regularProfile.createYourProfile.logo[0],
          (base64Uri) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setBase64(base64Uri as any);
          }
        );
      }
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

          setFieldValue("createYourProfile", {
            logo: new File([dataURItoBlob(logoBase64)], "logo", {
              type: logoBase64.split(";")[0].split(":")[1]
            }),
            name: operatorLens.name,
            email: getLensEmail(operatorLens as Profile),
            description: operatorLens.bio,
            website: getLensWebsite(operatorLens as Profile)
          });
        } catch (error) {
          console.error(error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsMetadataStorage, operatorLens]);
  useEffect(() => {
    if (isLoading || isAdminLoading) {
      return;
    }
    if (
      (!isRegularSellerSet && !CONFIG.lens.enabled) ||
      (CONFIG.lens.enabled &&
        ((isSeller && !hasValidAdminAccount) || !isSeller))
    ) {
      showModal(
        "CREATE_PROFILE",
        {
          headerComponent: (
            <ProfileMultiSteps
              createOrSelect={null}
              activeStep={0}
              createOrViewRoyalties={null}
              key="ProductType"
            />
          ),
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
    } else if (
      ((isOperator && hasValidAdminAccount && CONFIG.lens.enabled) ||
        (isRegularSellerSet && !CONFIG.lens.enabled)) &&
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
    isLoading,
    isAdminLoading,
    values
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
          <Button theme="primary" type="submit" disabled={nextIsDisabled}>
            Next
          </Button>
        </ProductButtonGroup>
      </Container>
    </ContainerProductPage>
  );
}

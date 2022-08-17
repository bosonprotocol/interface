import dayjs from "dayjs";
import map from "lodash/map";
import { Warning } from "phosphor-react";
import { Image } from "phosphor-react";
import { useCallback, useMemo } from "react";

import Collapse from "../../components/collapse/Collapse";
import InitializeChat from "../../components/modal/components/Chat/components/InitializeChat";
import { ImageContainer, ImageWrapper } from "../../components/ui/Image";
import { getLocalStorageItems } from "../../lib/utils/getLocalStorageItems";
import { getItemFromStorage } from "../../lib/utils/hooks/useLocalStorage";
import { useChatContext } from "../../pages/chat/ChatProvider/ChatContext";
import { FormField } from "../form";
import CurrencyIcon from "../price/CurrencyIcon";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import {
  CollapseContainer,
  CollapseContent,
  ConfirmationAlert,
  ConfirmationContent,
  ConfirmProductDetailsButtonGroup,
  ConfirmProductDetailsContainer,
  ContentValue,
  CurrencyIconWrapper,
  FormFieldContainer,
  GridBox,
  IconWrapper,
  InitializeChatContainer,
  LogoImg,
  ProductBox,
  ProductEmptyImage,
  ProductInformationContent,
  ProductSubtitle,
  ProductTypeBox,
  RenderProductImageWrapper,
  SpaceContainer,
  Tag,
  TagsWrapper,
  TermsOfSaleContent
} from "./ConfirmProductDetails.styles";
import oneItemTypeProductSmall from "./img/one-item-product-small.png";
import physicalProductSmall from "./img/physical-product-small.png";
import { SectionTitle } from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmProductDetails({ togglePreview }: Props) {
  const { bosonXmtp } = useChatContext();
  const { values } = useCreateForm();

  const handleOpenPreview = () => {
    togglePreview(true);
  };

  const previewImages = getLocalStorageItems({
    key: "create-product-image"
  });

  const logoImage = previewImages?.[0] ?? null;

  const renderProductType = useMemo(() => {
    let src = "";
    let description = "";
    if (values.productType.productType === "physical") {
      src = physicalProductSmall;
      description = "Physical";
    } else if (values.productType.productType === "phygital") {
      // MISSING UI AND FOR NOW ONLY physical available
      // description = "Phygital";
    }
    return (
      <>
        <Typography
          tag="p"
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold"
          }}
        >
          Product Type*
        </Typography>
        <ProductBox>
          <img src={src} alt={description} />
          <Typography tag="p">{description}</Typography>
        </ProductBox>
      </>
    );
  }, [values.productType.productType]);

  const renderProductVariant = useMemo(() => {
    let src = "";
    let description = "";
    if (values.productType.productVariant === "oneItemType") {
      src = oneItemTypeProductSmall;
      description = "One Item Type";
    } else if (values.productType.productVariant === "differentVariants") {
      // MISSING UI AND FOR NOW ONLY oneItemType available
      // description = "Different Variants";
    }
    return (
      <>
        <Typography
          tag="p"
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold"
          }}
        >
          Product Variant*
        </Typography>
        <ProductBox>
          <img src={src} alt={description} />
          <Typography tag="p">{description}</Typography>
        </ProductBox>
      </>
    );
  }, [values.productType.productVariant]);

  const renderProductImage = useCallback(
    ({ placeholder, key }: { placeholder: string; key: string }) => {
      const src = getItemFromStorage(key, "");
      return (
        <RenderProductImageWrapper $isPlaceholder={!src}>
          {src ? (
            <ImageWrapper>
              <ImageContainer src={src} alt={placeholder} />
            </ImageWrapper>
          ) : (
            <ProductEmptyImage>
              <Image size={24} />
              <Typography tag="p">{placeholder}</Typography>
            </ProductEmptyImage>
          )}
        </RenderProductImageWrapper>
      );
    },
    []
  );
  return (
    <ConfirmProductDetailsContainer>
      <SectionTitle tag="h2">Confirm Product Details</SectionTitle>
      <CollapseContainer>
        <Collapse
          title={
            <Typography
              tag="h3"
              style={{
                fontSize: "1.5rem"
              }}
            >
              Profile Info
            </Typography>
          }
        >
          <CollapseContent>
            <FormField
              title="Logo / profile picture"
              required={true}
              style={{
                marginBottom: "2rem"
              }}
            >
              <LogoImg src={logoImage} alt="logo/ profile picture" />
            </FormField>
            <Grid
              justifyContent="flex-start"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <GridBox $minWidth="7.1rem">
                <FormFieldContainer>
                  <FormField title="Your brand / name" required={true}>
                    <ContentValue tag="p">
                      {values.creteYourProfile.name}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="6rem">
                <FormFieldContainer>
                  <FormField title="Contact E-Mail" required={true}>
                    <ContentValue tag="p">
                      {values.creteYourProfile.email}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="9.688rem">
                <FormFieldContainer>
                  <FormField
                    title="Website / Social media link"
                    required={false}
                  >
                    <ContentValue tag="p">
                      {values.creteYourProfile.website}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
            </Grid>
            <FormFieldContainer
              style={{
                marginBottom: 0
              }}
            >
              <FormField title="Description" required={true}>
                <ContentValue tag="p">
                  {values.creteYourProfile.description}
                </ContentValue>
              </FormField>
            </FormFieldContainer>
          </CollapseContent>
        </Collapse>
      </CollapseContainer>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Product Data</Typography>}>
          <ProductInformationContent>
            <ProductSubtitle tag="h4">Product Information</ProductSubtitle>
            <Grid
              justifyContent="flex-start"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <ProductTypeBox>{renderProductType}</ProductTypeBox>
              <ProductTypeBox>{renderProductVariant}</ProductTypeBox>
            </Grid>
            <Grid justifyContent="flex-start" alignItems="flex-start">
              <GridBox $minWidth="5.625rem">
                <FormFieldContainer>
                  <FormField title="Product Title" required={true}>
                    <ContentValue tag="p">
                      {values.productInformation.productTitle}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="4.1rem">
                <FormFieldContainer>
                  <FormField title="Category" required={true}>
                    <ContentValue tag="p">
                      {values.productInformation.category?.label}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="6.9rem">
                <FormFieldContainer>
                  <FormField title="Product Attribute" required={true}>
                    <ContentValue tag="p">
                      {map(
                        values.productInformation.attributes,
                        (elem) => elem.name
                      ).join(", ")}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
            </Grid>
            <FormFieldContainer>
              <FormField title="Description" required={true}>
                <ContentValue tag="p">
                  {values.productInformation.description}
                </ContentValue>
              </FormField>
            </FormFieldContainer>
            <FormFieldContainer>
              <FormField title="Search Tags" required={false}>
                <TagsWrapper>
                  {map(values.productInformation.tags, (tag, index) => {
                    return (
                      <Tag key={index}>
                        <span className="text">{tag}</span>
                      </Tag>
                    );
                  })}
                </TagsWrapper>
              </FormField>
            </FormFieldContainer>
            <div>
              <ProductSubtitle tag="h4">Product Images</ProductSubtitle>
              <SpaceContainer>
                {renderProductImage({
                  key: "create-product-image_productImages.thumbnail",
                  placeholder: "Thumbnail"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.secondary",
                  placeholder: "Secondary"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.everyAngle",
                  placeholder: "Every angle"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.details",
                  placeholder: "Details"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.inUse1",
                  placeholder: "In Use"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.styledScene",
                  placeholder: "Styled Scene"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.sizeAndScale",
                  placeholder: "Size and Scale"
                })}
                {renderProductImage({
                  key: "create-product-image_productImages.more",
                  placeholder: "More"
                })}
              </SpaceContainer>
            </div>
          </ProductInformationContent>
        </Collapse>
      </CollapseContainer>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Terms of Sale</Typography>}>
          <TermsOfSaleContent>
            <Grid
              justifyContent="flex-start"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <GridBox $minWidth="16rem">
                <FormFieldContainer>
                  <FormField title="Price" required={true}>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale.price &&
                        values.coreTermsOfSale.currency?.value &&
                        values.coreTermsOfSale.currency?.label && (
                          <>
                            <CurrencyIconWrapper>
                              <CurrencyIcon
                                currencySymbol={
                                  values.coreTermsOfSale.currency.value
                                }
                              />
                            </CurrencyIconWrapper>
                            {`${values.coreTermsOfSale.price} ${values.coreTermsOfSale.currency.label} (Price for all
                      variants)`}
                          </>
                        )}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="9.5rem">
                <FormFieldContainer>
                  <FormField title="Quantity" required={true}>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale.quantity}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox>
                <FormFieldContainer>
                  <FormField title="Token Gated Offer" required={true}>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale?.tokenGatedOffer?.label}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
            </Grid>
            <Grid justifyContent="flex-start" alignItems="flex-start">
              <GridBox $minWidth="16rem">
                <FormFieldContainer
                  style={{
                    marginBottom: 0
                  }}
                >
                  <FormField title="Redemption period" required={true}>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale?.redemptionPeriod[0] &&
                        values.coreTermsOfSale?.redemptionPeriod[1] && (
                          <>
                            {dayjs(
                              values.coreTermsOfSale.redemptionPeriod[0]
                            ).format("MMM DD")}{" "}
                            -{" "}
                            {dayjs(
                              values.coreTermsOfSale.redemptionPeriod[1]
                            ).format("MMM DD")}
                          </>
                        )}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox>
                <FormFieldContainer
                  style={{
                    marginBottom: 0
                  }}
                >
                  <FormField title="Offer Validity period" required={true}>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale?.offerValidityPeriod[0] &&
                        values.coreTermsOfSale?.offerValidityPeriod[1] && (
                          <>
                            {dayjs(
                              values.coreTermsOfSale.offerValidityPeriod[0]
                            ).format("MMM DD")}{" "}
                            -{" "}
                            {dayjs(
                              values.coreTermsOfSale.offerValidityPeriod[1]
                            ).format("MMM DD")}
                          </>
                        )}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
            </Grid>
          </TermsOfSaleContent>
        </Collapse>
      </CollapseContainer>
      <ConfirmationAlert>
        <IconWrapper>
          <Warning />
        </IconWrapper>
        <ConfirmationContent>
          <Typography tag="p">
            You wont be able to make changes after confirming
          </Typography>
          <Typography tag="p">
            By selecting confirm, you agree to pay the above fees, accept Boson
            seller agreement and Payments Terms of Use, acknowledge reading the
            User Privacy Notice and assume full responsibility for the item
            offered and the content of your listing.
          </Typography>
        </ConfirmationContent>
      </ConfirmationAlert>
      {!bosonXmtp && (
        <InitializeChatContainer>
          <InitializeChat />
        </InitializeChatContainer>
      )}
      <ConfirmProductDetailsButtonGroup>
        <Button theme="secondary" type="submit">
          Confirm
        </Button>
        <Button theme="primary" type="button" onClick={handleOpenPreview}>
          Preview product detail page
        </Button>
      </ConfirmProductDetailsButtonGroup>
    </ConfirmProductDetailsContainer>
  );
}

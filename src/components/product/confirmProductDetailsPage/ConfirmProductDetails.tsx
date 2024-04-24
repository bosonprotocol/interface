import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import Collapse from "components/collapse/Collapse";
import { FormField } from "components/form";
import { Spinner } from "components/loading/Spinner";
import InitializeChat from "components/modal/components/Chat/components/InitializeChat";
import differentVariantsProduct from "components/product/img/different-variants-product.png";
import oneItemTypeProductSmall from "components/product/img/one-item-product-small.png";
import phygitalProductSmall from "components/product/img/phygital-product-small.png";
import physicalProductSmall from "components/product/img/physical-product-small.png";
import {
  optionUnitValues,
  ProductTypeTypeValues,
  ProductTypeVariantsValues
} from "components/product/utils";
import Tooltip from "components/tooltip/Tooltip";
import BosonButton from "components/ui/BosonButton";
import { Grid } from "components/ui/Grid";
import Image from "components/ui/Image";
import { Typography } from "components/ui/Typography";
import Video from "components/ui/Video";
import dayjs from "dayjs";
import { CONFIG } from "lib/config";
import { ChatInitializationStatus } from "lib/utils/hooks/chat/useChatStatus";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useForm } from "lib/utils/hooks/useForm";
import map from "lodash/map";
import { useChatContext } from "pages/chat/ChatProvider/ChatContext";
import { AgreeToTermsAndSellerAgreement } from "pages/create-product/AgreeToTermsAndSellerAgreement";
import { Warning } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";

import { SectionTitle } from "../Product.styles";
import { getBundleItemName } from "../productDigital/getBundleItemName";
import {
  ChatDotsIcon,
  CheckIcon,
  CollapseContainer,
  ConfirmationAlert,
  ConfirmationContent,
  ConfirmProductDetailsButtonGroup,
  ConfirmProductDetailsContainer,
  ContentValue,
  FormFieldContainer,
  GridBox,
  IconWrapper,
  Info,
  InfoMessage,
  InitializeChatContainer,
  ProductBox,
  ProductInformationContent,
  ProductSubtitle,
  ProductTypeBox,
  SpaceContainer,
  Tag,
  TagsWrapper,
  TermsOfSaleContent
} from "./ConfirmProductDetails.styles";
import { ConfirmProductDigital } from "./ConfirmProductDigital";

const VariantsTable = styled.table`
  th:not(:first-child),
  td:not(:first-child) {
    padding: 5px;
  }
  th[data-images] {
    text-align: left;
  }
  * {
    font-size: 0.75rem;
  }
  th {
    font-weight: 600;
  }
`;

const VariantImage = styled(Image)`
  all: unset;
  height: 50px;
  width: 50px;
  img {
    all: unset;
    height: 50px;
    width: 50px;
  }
`;
interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
  chatInitializationStatus: ChatInitializationStatus;
  isMultiVariant: boolean;
  isOneSetOfImages: boolean;
}

export default function ConfirmProductDetails({
  togglePreview,
  chatInitializationStatus,
  isMultiVariant,
  isOneSetOfImages
}: Props) {
  const { bosonXmtp } = useChatContext();
  const { values } = useForm();
  const { account: address } = useAccount();

  const showSuccessInitialization =
    [
      ChatInitializationStatus.INITIALIZED,
      ChatInitializationStatus.ALREADY_INITIALIZED
    ].includes(chatInitializationStatus) && bosonXmtp;
  const showInitializeChat =
    (chatInitializationStatus === ChatInitializationStatus.NOT_INITIALIZED &&
      address &&
      !bosonXmtp) ||
    chatInitializationStatus === ChatInitializationStatus.ERROR;

  const handleOpenPreview = () => {
    togglePreview(true);
  };

  const renderProductType = useMemo(() => {
    let src = "";
    let description = "";
    if (values.productType?.productType === ProductTypeTypeValues.physical) {
      src = physicalProductSmall;
      description = "Physical";
    } else if (
      values.productType?.productType === ProductTypeTypeValues.phygital
    ) {
      src = phygitalProductSmall;
      description = "Phygital";
    }
    return (
      <>
        <Typography tag="p" fontSize="0.75rem" fontWeight="600">
          Product type*
        </Typography>
        <ProductBox>
          <img src={src} alt={description} height="41" />
          <Typography tag="p">{description}</Typography>
        </ProductBox>
      </>
    );
  }, [values.productType.productType]);

  const renderProductVariant = useMemo(() => {
    let src = "";
    let description = "";
    if (
      values.productType.productVariant ===
      ProductTypeVariantsValues.oneItemType
    ) {
      src = oneItemTypeProductSmall;
      description = "One item type";
    } else if (
      values.productType.productVariant ===
      ProductTypeVariantsValues.differentVariants
    ) {
      src = differentVariantsProduct;
      description = "Different variants";
    }
    return (
      <>
        <Typography
          tag="p"
          style={{
            fontSize: "0.75rem",
            fontWeight: "600"
          }}
        >
          Product variant*
        </Typography>
        <ProductBox>
          <img src={src} alt={description} height="41" />
          <Typography tag="p">{description}</Typography>
        </ProductBox>
      </>
    );
  }, [values.productType.productVariant]);

  const variantIndex = 0;
  const firstVariant = values.productVariants.variants[variantIndex];
  const quantity = isMultiVariant
    ? firstVariant.quantity
    : values.coreTermsOfSale?.quantity;
  const commonTermsOfSale = isMultiVariant
    ? values.variantsCoreTermsOfSale
    : values.coreTermsOfSale;
  const { offerValidityPeriod, redemptionPeriod, voucherValidDurationInDays } =
    commonTermsOfSale;
  return (
    <ConfirmProductDetailsContainer>
      <SectionTitle tag="h2">Confirm Product Details</SectionTitle>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Product Data</Typography>}>
          <ProductInformationContent>
            <div>
              <ProductSubtitle tag="h4">Product Information</ProductSubtitle>
              <Grid
                justifyContent="flex-start"
                alignItems="flex-start"
                flexWrap="wrap"
              >
                <ProductTypeBox>{renderProductType}</ProductTypeBox>
                <ProductTypeBox>{renderProductVariant}</ProductTypeBox>
              </Grid>
              <Grid
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="1rem"
              >
                <GridBox $minWidth="5.625rem">
                  <FormFieldContainer>
                    <FormField title="Product title" required>
                      <ContentValue tag="p">
                        {values.productInformation.productTitle}
                      </ContentValue>
                    </FormField>
                  </FormFieldContainer>
                </GridBox>
                <GridBox $minWidth="4.1rem">
                  <FormFieldContainer>
                    <FormField title="Category" required>
                      <ContentValue tag="p">
                        {values.productInformation.category?.label}
                      </ContentValue>
                    </FormField>
                  </FormFieldContainer>
                </GridBox>
                {!!values.productInformation.attributes &&
                  !!values.productInformation.attributes.length &&
                  values.productInformation.attributes[0].name !== "" && (
                    <GridBox $minWidth="6.9rem">
                      <FormFieldContainer>
                        <FormField title="Product Attributes">
                          <ContentValue tag="p">
                            {map(
                              values.productInformation.attributes,
                              (elem) => elem.name
                            ).join(", ")}
                          </ContentValue>
                        </FormField>
                      </FormFieldContainer>
                    </GridBox>
                  )}
              </Grid>
              <FormFieldContainer>
                <FormField title="Description" required>
                  <ContentValue tag="p">
                    {values.productInformation.description}
                  </ContentValue>
                </FormField>
              </FormFieldContainer>
              <FormFieldContainer style={{ margin: 0 }}>
                <FormField title="Search tags" required>
                  <TagsWrapper>
                    {map(values.productInformation.tags, (tag, index) => {
                      return (
                        <Tag key={`productInformation_tags${index}`}>
                          <span className="text">{tag}</span>
                        </Tag>
                      );
                    })}
                  </TagsWrapper>
                </FormField>
              </FormFieldContainer>
            </div>
            {isMultiVariant && (
              <div>
                <ProductSubtitle tag="h4">Variants</ProductSubtitle>
                <VariantsTable>
                  <thead>
                    <tr>
                      <th data-name>Variant name</th>
                      <th data-price>Price</th>
                      <th data-currency>Currency</th>
                      <th data-quantity>Quantity</th>
                      {!isOneSetOfImages && <th data-images>Images</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {values.productVariants.variants.map((variant, idx) => {
                      const variantImages =
                        values.productVariantsImages?.[idx]?.productImages;
                      return (
                        <tr key={variant.name}>
                          <td data-name>
                            <Typography justifyContent="flex-start">
                              {variant.name}
                            </Typography>
                          </td>
                          <td data-price>
                            <Typography justifyContent="center">
                              {variant.price}
                            </Typography>
                          </td>
                          <td data-currency>
                            <Typography justifyContent="center">
                              {variant.currency.label}
                            </Typography>
                          </td>
                          <td data-quantity>
                            <Typography justifyContent="center">
                              {variant.quantity}
                            </Typography>
                          </td>
                          {!isOneSetOfImages && (
                            <td data-images>
                              <Grid justifyContent="flex-start" gap="0.5rem">
                                {variantImages &&
                                  Object.entries(variantImages).map(
                                    ([name, images]) => {
                                      if (
                                        !images ||
                                        !images.length ||
                                        !images?.[0]?.src
                                      ) {
                                        return null;
                                      }
                                      const [img] = images;
                                      const imgSrc = img.src;
                                      return (
                                        <VariantImage src={imgSrc} key={name} />
                                      );
                                    }
                                  )}
                              </Grid>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </VariantsTable>
              </div>
            )}
            <ConfirmProductDigital />
            {(!isMultiVariant || (isMultiVariant && isOneSetOfImages)) && (
              <div>
                <ProductSubtitle tag="h4">Product Images</ProductSubtitle>
                <SpaceContainer>
                  {map(
                    values?.productImages,
                    (v, i) =>
                      v &&
                      v?.[0]?.src && (
                        <Image
                          key={`Image_${v?.[0]?.src}_${i}`}
                          src={v?.[0]?.src || ""}
                        />
                      )
                  )}
                </SpaceContainer>
              </div>
            )}
            {values.productAnimation?.[0]?.src && (
              <div>
                <ProductSubtitle tag="h4">Product Animation</ProductSubtitle>
                <SpaceContainer>
                  <Video
                    src={values.productAnimation?.[0]?.src}
                    videoProps={{
                      autoPlay: true,
                      loop: true,
                      muted: true
                    }}
                  />
                </SpaceContainer>
              </div>
            )}
            {!!values.bundleItemsMedia?.length && (
              <div>
                <ProductSubtitle tag="h4">
                  Digital images & videos
                </ProductSubtitle>
                {values.bundleItemsMedia.map((biMedia, index) => {
                  const bundleItem =
                    values.productDigital?.bundleItems?.[index];
                  const name = getBundleItemName(bundleItem);
                  return (
                    <Grid
                      key={`${biMedia.image?.[0]?.src}-${biMedia.video?.[0]?.src}`}
                      flexDirection="column"
                      alignItems="initial"
                    >
                      <Typography>{name}</Typography>
                      <SpaceContainer>
                        <Image src={biMedia.image?.[0]?.src || ""} />
                        <Video
                          src={biMedia.video?.[0]?.src || ""}
                          videoProps={{
                            autoPlay: true,
                            loop: true,
                            muted: true
                          }}
                        />
                      </SpaceContainer>
                    </Grid>
                  );
                })}
              </div>
            )}
          </ProductInformationContent>
        </Collapse>
      </CollapseContainer>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Terms of Sale</Typography>}>
          <TermsOfSaleContent>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {!isMultiVariant && (
                <>
                  <GridBox $minWidth="16rem">
                    <FormFieldContainer>
                      <FormField title="Price" required>
                        <ContentValue tag="p">
                          {values.coreTermsOfSale.price &&
                            values.coreTermsOfSale.currency?.value &&
                            values.coreTermsOfSale.currency?.label && (
                              <>
                                <Tooltip
                                  content={
                                    values.coreTermsOfSale.currency.value
                                  }
                                  wrap={false}
                                >
                                  <CurrencyDisplay
                                    currency={
                                      values.coreTermsOfSale.currency
                                        .value as Currencies
                                    }
                                    height={18}
                                  />
                                </Tooltip>
                                {`${values.coreTermsOfSale.price} ${values.coreTermsOfSale.currency.label}`}
                              </>
                            )}
                        </ContentValue>
                      </FormField>
                    </FormFieldContainer>
                  </GridBox>
                  <GridBox $minWidth="9.5rem">
                    <FormFieldContainer>
                      <FormField title="Quantity" required>
                        <ContentValue tag="p">{quantity}</ContentValue>
                      </FormField>
                    </FormFieldContainer>
                  </GridBox>
                  <GridBox>
                    <FormFieldContainer>
                      <FormField title="Token Gated Offer" required>
                        <ContentValue tag="p">
                          {values.productType?.tokenGatedOffer === "true"
                            ? "Yes"
                            : "No"}
                        </ContentValue>
                      </FormField>
                    </FormFieldContainer>
                  </GridBox>
                  <div />
                  <GridBox $minWidth="16rem">
                    <FormFieldContainer
                      style={{
                        marginBottom: 0
                      }}
                    >
                      <FormField title="Buyer cancellation penalty" required>
                        <ContentValue tag="p">
                          {values?.termsOfExchange?.buyerCancellationPenalty ||
                            0}{" "}
                          {values?.termsOfExchange?.buyerCancellationPenaltyUnit
                            .label === optionUnitValues["%"]
                            ? "%"
                            : values?.termsOfExchange
                                ?.buyerCancellationPenaltyUnit.label}
                        </ContentValue>
                      </FormField>
                    </FormFieldContainer>
                  </GridBox>
                  <GridBox>
                    <FormFieldContainer>
                      <FormField title="Seller deposit" required>
                        <ContentValue tag="p">
                          {values?.termsOfExchange?.sellerDeposit || 0}{" "}
                          {values?.termsOfExchange?.sellerDepositUnit.label ===
                          optionUnitValues["%"]
                            ? "%"
                            : values?.termsOfExchange?.sellerDepositUnit.label}
                        </ContentValue>
                      </FormField>
                    </FormFieldContainer>
                  </GridBox>
                </>
              )}
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              <GridBox>
                <FormFieldContainer
                  style={{
                    marginBottom: 0
                  }}
                >
                  <FormField title="Offer validity period" required>
                    <ContentValue tag="p">
                      {Array.isArray(offerValidityPeriod) &&
                      offerValidityPeriod[0] &&
                      offerValidityPeriod[1] ? (
                        <>
                          {dayjs(offerValidityPeriod[0]).format(
                            CONFIG.shortDateFormat
                          )}{" "}
                          -{" "}
                          {dayjs(offerValidityPeriod[1]).format(
                            CONFIG.shortDateFormat
                          )}
                        </>
                      ) : !Array.isArray(offerValidityPeriod) ? (
                        <>
                          {dayjs(offerValidityPeriod).format(
                            CONFIG.shortDateFormat
                          )}
                          {" - (no expiration)"}
                        </>
                      ) : (
                        <></>
                      )}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="16rem">
                <FormFieldContainer
                  style={{
                    marginBottom: 0
                  }}
                >
                  <FormField
                    title={
                      Array.isArray(redemptionPeriod)
                        ? "Redemption period"
                        : "Redemption start date"
                    }
                    required={Array.isArray(redemptionPeriod)}
                  >
                    <ContentValue tag="p">
                      {Array.isArray(redemptionPeriod) &&
                      redemptionPeriod[0] &&
                      redemptionPeriod[1] ? (
                        <>
                          {dayjs(redemptionPeriod[0]).format(
                            CONFIG.shortDateFormat
                          )}{" "}
                          -{" "}
                          {dayjs(redemptionPeriod[1]).format(
                            CONFIG.shortDateFormat
                          )}
                        </>
                      ) : !Array.isArray(redemptionPeriod) ? (
                        <>
                          {dayjs(redemptionPeriod).format(
                            CONFIG.shortDateFormat
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="16rem">
                <FormFieldContainer
                  style={{
                    marginBottom: 0
                  }}
                >
                  {!Array.isArray(redemptionPeriod) &&
                    voucherValidDurationInDays && (
                      <FormField title="Redemption duration" required>
                        <ContentValue tag="p">
                          {voucherValidDurationInDays} days
                        </ContentValue>
                      </FormField>
                    )}
                </FormFieldContainer>
              </GridBox>
            </div>
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
        </ConfirmationContent>
      </ConfirmationAlert>
      {showInitializeChat && (
        <InitializeChatContainer>
          <InitializeChat
            isError={
              chatInitializationStatus === ChatInitializationStatus.ERROR
            }
            message="To proceed, first initialize your chat client to enable two way communication with buyers and to receive delivery details."
          />
        </InitializeChatContainer>
      )}
      {showSuccessInitialization && (
        <InitializeChatContainer>
          <Info justifyContent="space-between" gap="2rem">
            <Grid justifyContent="flex-start" gap="1rem">
              <ChatDotsIcon size={24} />
              <InfoMessage fontSize="1rem" fontWeight="600">
                You succesfully initialized your chat client
              </InfoMessage>
            </Grid>
            <div>
              <CheckIcon />
            </div>
          </Info>
        </InitializeChatContainer>
      )}

      <Grid
        flexDirection="column"
        marginTop="5rem"
        alignItems="flex-start"
        gap="1rem"
      >
        <AgreeToTermsAndSellerAgreement isMultiVariant={isMultiVariant} />
        <ConfirmProductDetailsButtonGroup>
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={
              ![
                ChatInitializationStatus.INITIALIZED,
                ChatInitializationStatus.ALREADY_INITIALIZED
              ].includes(chatInitializationStatus) ||
              !values.confirmProductDetails?.acceptsTerms
            }
          >
            {chatInitializationStatus ===
              ChatInitializationStatus.NOT_INITIALIZED && bosonXmtp ? (
              <Spinner size={20} />
            ) : (
              "Confirm"
            )}
          </BosonButton>
          <BosonButton
            variant="accentInverted"
            type="button"
            onClick={handleOpenPreview}
            disabled={
              ![
                ChatInitializationStatus.INITIALIZED,
                ChatInitializationStatus.ALREADY_INITIALIZED
              ].includes(chatInitializationStatus)
            }
          >
            Preview product detail page
          </BosonButton>
        </ConfirmProductDetailsButtonGroup>
      </Grid>
    </ConfirmProductDetailsContainer>
  );
}

import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import map from "lodash/map";
import { Warning } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import Collapse from "../../components/collapse/Collapse";
import { Spinner } from "../../components/loading/Spinner";
import InitializeChat from "../../components/modal/components/Chat/components/InitializeChat";
import { CONFIG } from "../../lib/config";
import { ChatInitializationStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { useChatContext } from "../../pages/chat/ChatProvider/ChatContext";
import { FormField } from "../form";
import Tooltip from "../tooltip/Tooltip";
import BosonButton from "../ui/BosonButton";
import Grid from "../ui/Grid";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
import Video from "../ui/Video";
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
import differentVariantsProduct from "./img/different-variants-product.png";
import oneItemTypeProductSmall from "./img/one-item-product-small.png";
import physicalProductSmall from "./img/physical-product-small.png";
import { SectionTitle } from "./Product.styles";
import { optionUnitValues } from "./utils";
import { useCreateForm } from "./utils/useCreateForm";

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

  const { values } = useCreateForm();
  const { address } = useAccount();

  const showSuccessInitialization =
    chatInitializationStatus === "INITIALIZED" && bosonXmtp;
  const showInitializeChat =
    (chatInitializationStatus === "NOT_INITIALIZED" && address && !bosonXmtp) ||
    chatInitializationStatus === "ERROR";

  const handleOpenPreview = () => {
    togglePreview(true);
  };

  const renderProductType = useMemo(() => {
    let src = "";
    let description = "";
    if (values.productType.productType === "physical") {
      src = physicalProductSmall;
      description = "Physical";
    } else if (values.productType.productType === "phygital") {
      // TODO: MISSING UI AND FOR NOW ONLY physical available
      // description = "Phygital";
    }
    return (
      <>
        <Typography tag="p" $fontSize="0.75rem" fontWeight="600">
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
    if (values.productType.productVariant === "oneItemType") {
      src = oneItemTypeProductSmall;
      description = "One item type";
    } else if (values.productType.productVariant === "differentVariants") {
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
  const { offerValidityPeriod, redemptionPeriod, tokenGatedOffer } =
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
                {values.productInformation.attributes &&
                  values.productInformation.attributes.length &&
                  values.productInformation.attributes[0].name !== "" && (
                    <GridBox $minWidth="6.9rem">
                      <FormFieldContainer>
                        <FormField title="Product Attribute">
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
                          <Grid
                            data-name
                            as="td"
                            flexDirection="row"
                            alignItems="flex-start"
                          >
                            {variant.name}
                          </Grid>
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
              flex="1 1"
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
                          {tokenGatedOffer?.label}
                        </ContentValue>
                      </FormField>
                    </FormFieldContainer>
                  </GridBox>
                </>
              )}
            </Grid>
            <Grid
              justifyContent="flex-start"
              alignItems="flex-start"
              flex="1 1"
            >
              <GridBox $minWidth="16rem">
                <FormFieldContainer
                  style={{
                    marginBottom: 0
                  }}
                >
                  <FormField title="Redemption period" required>
                    <ContentValue tag="p">
                      {redemptionPeriod[0] && redemptionPeriod[1] && (
                        <>
                          {dayjs(redemptionPeriod[0]).format("MMM DD")} -{" "}
                          {dayjs(redemptionPeriod[1]).format("MMM DD")}
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
                  <FormField title="Offer validity period" required>
                    <ContentValue tag="p">
                      {offerValidityPeriod[0] && offerValidityPeriod[1] && (
                        <>
                          {dayjs(offerValidityPeriod[0]).format(
                            CONFIG.shortMonthWithDay
                          )}{" "}
                          -{" "}
                          {dayjs(offerValidityPeriod[1]).format(
                            CONFIG.shortMonthWithDay
                          )}
                        </>
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
                  <FormField title="Buyer cancellation penalty" required>
                    <ContentValue tag="p">
                      {values?.termsOfExchange?.buyerCancellationPenalty || 0}{" "}
                      {values?.termsOfExchange?.buyerCancellationPenaltyUnit
                        .label === optionUnitValues["%"]
                        ? "%"
                        : values?.termsOfExchange?.buyerCancellationPenaltyUnit
                            .label}
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
        </ConfirmationContent>
      </ConfirmationAlert>
      {showInitializeChat && (
        <InitializeChatContainer>
          <InitializeChat
            isError={chatInitializationStatus === "ERROR"}
            message="To proceed, first initialize your chat client to enable two way communication with buyers and to receive delivery details."
          />
        </InitializeChatContainer>
      )}
      {showSuccessInitialization && (
        <InitializeChatContainer>
          <Info justifyContent="space-between" gap="2rem">
            <Grid justifyContent="flex-start" gap="1rem">
              <ChatDotsIcon size={24} />
              <InfoMessage $fontSize="1rem" fontWeight="600">
                You succesfully initialized your chat client
              </InfoMessage>
            </Grid>
            <div>
              <CheckIcon />
            </div>
          </Info>
        </InitializeChatContainer>
      )}
      <ConfirmProductDetailsButtonGroup>
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={
            !["INITIALIZED", "ALREADY_INITIALIZED"].includes(
              chatInitializationStatus
            )
          }
        >
          {chatInitializationStatus === "NOT_INITIALIZED" && bosonXmtp ? (
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
            !["INITIALIZED", "ALREADY_INITIALIZED"].includes(
              chatInitializationStatus
            )
          }
        >
          Preview product detail page
        </BosonButton>
      </ConfirmProductDetailsButtonGroup>
    </ConfirmProductDetailsContainer>
  );
}

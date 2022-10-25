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
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
import Video from "../ui/Video";
import {
  ChatDotsIcon,
  CheckIcon,
  CollapseContainer,
  CollapseContent,
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
import { useCreateForm } from "./utils/useCreateForm";

const VariantsTable = styled.table`
  th:not(:first-child),
  td:not(:first-child) {
    padding: 5px;
  }
  th[data-images] {
    text-align: left;
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
        <Typography tag="p" $fontSize="0.75rem" fontWeight="bold">
          Product Type*
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
      description = "One Item Type";
    } else if (values.productType.productVariant === "differentVariants") {
      src = differentVariantsProduct;
      description = "Different Variants";
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
  // TODO: check if profile info is displayed correctly while using a lens profile
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
              required
              style={{
                marginBottom: "2rem"
              }}
            >
              {values?.createYourProfile?.logo?.[0]?.src && (
                <Image
                  src={values?.createYourProfile?.logo?.[0]?.src || ""}
                  style={{
                    width: "80px",
                    height: "80px",
                    paddingTop: "0"
                  }}
                  alt="logo/ profile picture"
                />
              )}
            </FormField>
            <Grid
              justifyContent="flex-start"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <GridBox $minWidth="7.1rem">
                <FormFieldContainer>
                  <FormField title="Your brand / name" required>
                    <ContentValue tag="p">
                      {values.createYourProfile.name}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="6rem">
                <FormFieldContainer>
                  <FormField title="Contact E-Mail" required>
                    <ContentValue tag="p">
                      {values.createYourProfile.email}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox $minWidth="9.75rem">
                <FormFieldContainer>
                  <FormField title="Website / Social media link">
                    <ContentValue tag="p">
                      {values.createYourProfile.website}
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
              <FormField title="Description" required>
                <ContentValue tag="p">
                  {values.createYourProfile.description}
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
                  <FormField title="Product Title" required>
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
            <FormFieldContainer>
              <FormField title="Search Tags" required>
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
                            <Typography justifyContent="center">
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
            <Grid justifyContent="flex-start" alignItems="flex-start">
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
                  <FormField title="Offer Validity period" required>
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
      {showInitializeChat && (
        <InitializeChatContainer>
          <InitializeChat isError={chatInitializationStatus === "ERROR"} />
        </InitializeChatContainer>
      )}
      {showSuccessInitialization && (
        <InitializeChatContainer>
          <Info justifyContent="space-between" gap="2rem">
            <Grid justifyContent="flex-start" gap="1rem">
              <ChatDotsIcon size={24} />
              <InfoMessage $fontSize="1rem" fontWeight="bold">
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
        <Button
          theme="primary"
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
        </Button>
        <Button theme="secondary" type="button" onClick={handleOpenPreview}>
          Preview product detail page
        </Button>
      </ConfirmProductDetailsButtonGroup>
    </ConfirmProductDetailsContainer>
  );
}

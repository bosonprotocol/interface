import { Button, Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import map from "lodash/map";
import { Warning } from "phosphor-react";
import { useMemo } from "react";
import { useAccount } from "wagmi";

import Collapse from "../../components/collapse/Collapse";
import { Spinner } from "../../components/loading/Spinner";
import InitializeChat from "../../components/modal/components/Chat/components/InitializeChat";
import { CONFIG } from "../../lib/config";
import { ChatInitializationStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { useChatContext } from "../../pages/chat/ChatProvider/ChatContext";
import { FormField } from "../form";
import Tooltip from "../tooltip/Tooltip";
import Grid from "../ui/Grid";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
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
import oneItemTypeProductSmall from "./img/one-item-product-small.png";
import physicalProductSmall from "./img/physical-product-small.png";
import { SectionTitle } from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
  chatInitializationStatus: ChatInitializationStatus;
}

export default function ConfirmProductDetails({
  togglePreview,
  chatInitializationStatus
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
      // TODO: description = "Different Variants";
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
                  <FormField title="Price" required>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale.price &&
                        values.coreTermsOfSale.currency?.value &&
                        values.coreTermsOfSale.currency?.label && (
                          <>
                            <Tooltip
                              content={values.coreTermsOfSale.currency.value}
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
                    <ContentValue tag="p">
                      {values.coreTermsOfSale.quantity}
                    </ContentValue>
                  </FormField>
                </FormFieldContainer>
              </GridBox>
              <GridBox>
                <FormFieldContainer>
                  <FormField title="Token Gated Offer" required>
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
                  <FormField title="Redemption period" required>
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
                  <FormField title="Offer Validity period" required>
                    <ContentValue tag="p">
                      {values.coreTermsOfSale?.offerValidityPeriod[0] &&
                        values.coreTermsOfSale?.offerValidityPeriod[1] && (
                          <>
                            {dayjs(
                              values.coreTermsOfSale.offerValidityPeriod[0]
                            ).format(CONFIG.shortMonthWithDay)}{" "}
                            -{" "}
                            {dayjs(
                              values.coreTermsOfSale.offerValidityPeriod[1]
                            ).format(CONFIG.shortMonthWithDay)}
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
        </Button>
        <Button
          variant="accentInverted"
          type="button"
          onClick={handleOpenPreview}
        >
          Preview product detail page
        </Button>
      </ConfirmProductDetailsButtonGroup>
    </ConfirmProductDetailsContainer>
  );
}

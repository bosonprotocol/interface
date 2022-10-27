import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DarkerBackground,
  DetailGrid,
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid
} from "../../components/detail/Detail.style";
import DetailChart from "../../components/detail/DetailChart";
import DetailShare from "../../components/detail/DetailShare";
import DetailSlider from "../../components/detail/DetailSlider";
import DetailTable from "../../components/detail/DetailTable";
import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
import Image from "../../components/ui/Image";
import Loading from "../../components/ui/Loading";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import useProductByUuid from "../../lib/utils/hooks/product/useProductByUuid";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useSellers } from "../../lib/utils/hooks/useSellers";
import { VariantV1 } from "./types";
import VariationSelects from "./VariationSelects";

export default function ProductDetail() {
  const { [UrlParameters.uuid]: productUuid = "" } = useParams();

  const {
    data: productResult,
    isError,
    isLoading
  } = useProductByUuid(productUuid, { enabled: !!productUuid });
  console.log({ productResult });
  const product = productResult?.product;
  const variants = productResult?.variants;
  const variantsWithV1 = variants?.filter(
    ({ offer: { metadata } }) => metadata?.type === "PRODUCT_V1"
  ) as VariantV1[] | undefined;
  const defaultVariant = variantsWithV1?.[0];

  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );
  const selectedOffer = selectedVariant?.offer;
  const hasVariants =
    !!variantsWithV1?.length &&
    variantsWithV1.every((variant) => !!variant.variations.length);
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [defaultVariant]);

  const seller = product?.productV1Seller?.seller;
  const sellerId = seller?.id;

  const { data: exchanges } = useExchanges(
    {
      offerId: selectedOffer?.id || "",
      disputed: null
    },
    {
      enabled: !!selectedOffer?.id
    }
  );

  if (selectedOffer) {
    selectedOffer.exchanges = exchanges;
  }

  const { data: sellers } = useSellers(
    {
      id: sellerId,
      includeFunds: true
    },
    {
      enabled: !!sellerId
    }
  );

  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === selectedOffer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = Number(selectedOffer?.sellerDeposit || 0);
  const hasSellerEnoughFunds =
    offerRequiredDeposit > 0
      ? Number(sellerAvailableDeposit) >= offerRequiredDeposit
      : true;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div data-testid="errorProduct">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!productResult || !selectedOffer || !product || !product.id) {
    return <div data-testid="notFound">This product does not exist</div>;
  }

  const {
    name,
    offerImg,
    shippingInfo,
    description,
    artistDescription,
    images
  } = getOfferDetails(selectedOffer);
  return (
    <DetailWrapper>
      <LightBackground>
        <MainDetailGrid>
          <ImageWrapper>
            <Image src={offerImg} dataTestId="offerImage" />
          </ImageWrapper>
          <div>
            <SellerID
              offer={selectedOffer}
              buyerOrSeller={selectedOffer?.seller}
              justifyContent="flex-start"
              withProfileImage
            />
            <Typography
              tag="h1"
              data-testid="name"
              style={{ fontSize: "2rem", marginBottom: "2rem" }}
            >
              {name}
            </Typography>

            {hasVariants && (
              <VariationSelects
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                variants={variantsWithV1}
              />
            )}

            <DetailWidget
              pageType="offer"
              offer={selectedOffer}
              name={name}
              image={offerImg}
              hasSellerEnoughFunds={hasSellerEnoughFunds}
            />
          </div>
          <DetailShare />
        </MainDetailGrid>
      </LightBackground>
      <DarkerBackground>
        <DetailGrid>
          <div>
            <Typography tag="h3">Product description</Typography>
            <Typography
              tag="p"
              data-testid="description"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {description}
            </Typography>
            {/* TODO: hidden for now */}
            {/* <DetailTable data={productData} tag="strong" inheritColor /> */}
          </div>
          <div>
            <Typography tag="h3">About the creator</Typography>
            <Typography tag="p" style={{ whiteSpace: "pre-wrap" }}>
              {artistDescription}
            </Typography>
          </div>
        </DetailGrid>
        {images.length > 0 && <DetailSlider images={images} />}
        <DetailGrid>
          <DetailChart offer={selectedOffer} title="Inventory graph" />
          {(!!shippingInfo.shipping || !!shippingInfo.shippingTable.length) && (
            <div>
              <Typography tag="h3">Shipping information</Typography>
              <Typography tag="p" style={{ color: colors.darkGrey }}>
                {shippingInfo.shipping}
              </Typography>
              <DetailTable data={shippingInfo.shippingTable} inheritColor />
            </div>
          )}
        </DetailGrid>
      </DarkerBackground>
    </DetailWrapper>
  );
}

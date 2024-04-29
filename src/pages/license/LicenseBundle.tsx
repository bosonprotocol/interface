import { hooks } from "@bosonprotocol/react-kit";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { isTruthy } from "lib/types/helpers";
import { getProductV1BundleItemsFilter } from "lib/utils/bundle/filter";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import { VariantV1 } from "pages/products/types";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/customNavigation/LinkWithQuery";
import LicenseComponent from "../../components/license/License";
import { Typography } from "../../components/ui/Typography";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";

const Container = styled.div`
  display: block;
  overflow: auto;
`;

export default function LicenseBundle() {
  const { [UrlParameters.uuid]: uuid, [UrlParameters.sellerId]: sellerId } =
    useParams();

  // Note: ideally the license is referring to the tNFT token; However, the
  //  token only exists after a commit and the token metadata are built just
  //  before the offer creation. So, here we are referring to an offer
  //  identified by its uuid and sellerId (offerId is not even known before the offer is
  //  created)

  const { data: bundleResult } = hooks.useBundleByUuid(
    sellerId,
    uuid,
    useCoreSDK()
  );
  const variantsWithV1: VariantV1[] | undefined = useMemo(
    () =>
      bundleResult
        ?.flatMap((bundle) => {
          const bundleItems = bundle.items;
          const productV1Items = bundleItems
            ? getProductV1BundleItemsFilter(bundleItems)
            : undefined;
          if (!productV1Items) {
            return null;
          }
          return productV1Items.map(
            (productV1Item) =>
              ({
                variations: productV1Item.variations,
                offer: bundle.offer
              }) as VariantV1
          );
        })
        .filter(isTruthy),
    [bundleResult]
  );

  const defaultVariant: VariantV1 | undefined =
    variantsWithV1?.find((variant) => !variant.offer.voided) ??
    variantsWithV1?.[0];
  const offer = defaultVariant?.offer;
  const offerId = offer?.id;
  if (!offerId) {
    return (
      <EmptyErrorMessage
        title="Not found"
        message="This bundle does not exist"
      />
    );
  }

  return (
    <>
      <Container>
        <LicenseComponent
          offerId={offerId}
          offerData={undefined}
        ></LicenseComponent>
      </Container>
      <Typography tag="p">
        Click&nbsp;
        <LinkWithQuery
          to={BosonRoutes.ContractualAgreement.replace(
            `:${UrlParameters.offerId}`,
            offerId
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {"here"}
        </LinkWithQuery>
        &nbsp;{"to read the Buyer & Seller Agreement"}
      </Typography>
    </>
  );
}

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { useCurrentSellerId } from "../../lib/utils/hooks/useCurrentSellerId";
import Grid from "../ui/Grid";
import Loading from "../ui/Loading";
import Typography from "../ui/Typography";
import { sellerPageTypes } from "./SellerPages";

const SellerMain = styled.main`
  padding: 1.375rem 2.5rem 2.75rem 2.5rem;
  background: ${colors.lightGrey};
`;
const SellerTitle = styled(Typography)`
  margin: 0 0 1.25rem 0;
`;
const SellerInner = styled.div`
  background: ${colors.white};
  padding: 1rem;
`;

interface SellerWrapperProps {
  children: React.ReactNode;
  label: string;
}
function SellerWrapper({ label, children }: SellerWrapperProps) {
  return (
    <SellerMain>
      <SellerTitle tag="h3">{label}</SellerTitle>
      <SellerInner>{children}</SellerInner>
    </SellerMain>
  );
}

export default function SellerInside() {
  const { [UrlParameters.sellerPage]: sellerPage } = useParams();
  const { isLoading, sellerId } = useCurrentSellerId();

  const { label, component } = useMemo(
    () => sellerPageTypes[sellerPage as keyof typeof sellerPageTypes],
    [sellerPage]
  );

  if (isLoading) {
    return (
      <SellerWrapper label={label}>
        <Loading />
      </SellerWrapper>
    );
  }

  if (sellerId === null) {
    return (
      <SellerWrapper label={label}>
        <Grid justifyContent="center" padding="5rem">
          <Typography tag="h5">
            The seller with that ID doesn't exist!
          </Typography>
        </Grid>
      </SellerWrapper>
    );
  }

  return <SellerWrapper label={label}>{component({ sellerId })}</SellerWrapper>;
}

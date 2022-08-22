import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { sellerPageTypes } from "./SellerPages";

const SellerMain = styled.main`
  padding: 1.375rem 2.5rem 2.75rem 2.5rem;
  background: ${colors.lightGrey};
  min-height: calc(100vh - 5.5rem);
`;
export default function SellerInside() {
  const { [UrlParameters.sellerPage]: sellerPage } = useParams();

  const data = useMemo(
    () => sellerPageTypes[sellerPage as keyof typeof sellerPageTypes],
    [sellerPage]
  );

  return <SellerMain>{data.component()}</SellerMain>;
}

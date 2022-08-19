import styled from "styled-components";

import SellerAside from "../../components/seller/SellerAside";
import SellerInside from "../../components/seller/SellerInside";
import { breakpoint } from "../../lib/styles/breakpoint";

const SellerCenterWrapper = styled.div`
  display: grid;
  grid-template-columns: 15em 1fr;
  gap: 0;
  min-height: calc(100vh - 30.25rem);

  margin: 0 -1rem;
  ${breakpoint.xs} {
    margin: 0 -1.5rem;
  }
  ${breakpoint.s} {
    margin: 0 -1.75rem;
  }
  ${breakpoint.m} {
    margin: 0 -2rem;
  }
  ${breakpoint.xl} {
    margin: 0 -2.25rem;
  }
`;

function SellerCenter() {
  return (
    <SellerCenterWrapper>
      <SellerAside />
      <SellerInside />
    </SellerCenterWrapper>
  );
}

export default SellerCenter;

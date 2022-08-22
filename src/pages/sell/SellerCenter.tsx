import styled from "styled-components";

import SellerAside from "../../components/seller/SellerAside";
import SellerInside from "../../components/seller/SellerInside";
// import { breakpoint } from "../../lib/styles/breakpoint";

const SellerCenterWrapper = styled.div`
  display: grid;
  grid-template-columns: 14.3em 1fr;
  gap: 0;
  min-height: calc(100vh - 30.25rem);
  margin: 0 -1rem;
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

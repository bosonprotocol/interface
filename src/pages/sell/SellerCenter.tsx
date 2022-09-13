import styled from "styled-components";

import SellerAside from "../../components/seller/SellerAside";
import SellerInside from "../../components/seller/SellerInside";

const SellerCenterWrapper = styled.div`
  display: grid;
  grid-template-columns: 14.3em 1fr;
  gap: 0;
  min-height: calc(100vh - 30.25rem);
  margin: 0 -1rem;
  font-family: "Plus Jakarta Sans";
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

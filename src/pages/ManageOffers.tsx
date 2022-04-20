import styled from "styled-components";

import { Layout } from "../components/Layout";

const ManageOffersContainer = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

export default function ManageOffers() {
  return (
    <ManageOffersContainer>
      <h1>Manage Offers</h1>
    </ManageOffersContainer>
  );
}

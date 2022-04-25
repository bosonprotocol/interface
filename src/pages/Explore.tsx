import styled from "styled-components";

import { Layout } from "../components/Layout";

const ExploreContainer = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

export default function Explore() {
  return (
    <ExploreContainer>
      <h1>Explore</h1>
    </ExploreContainer>
  );
}

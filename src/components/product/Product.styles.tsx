import styled from "styled-components";

import Image from "../ui/Image";

export const ProductButtonGroup = styled.div`
  margin-top: 3.5rem;
  display: flex;
  justify-content: flex-start;
  button:not(:last-child) {
    margin-right: 2rem;
  }
  padding-bottom: 2rem;
`;

export const ContainerProductPage = styled.div`
  max-width: 506px;
  width: 100%;
  > h2 {
    margin 3.5rem 0 3rem 0;
  }
  .inputGroup:not(:last-of-type) {
    margin-bottom: 2rem;
  }
`;

export const StyledImage = styled(Image)`
  width: 2.5rem;
  height: 2.5rem;
  padding-top: 0;
  margin: auto;
`;

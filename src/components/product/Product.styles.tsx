import styled from "styled-components";

export const ProductButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  button:not(:last-child) {
    margin-right: 2rem;
  }
`;

export const ContainerProductPage = styled.div`
  max-width: 506px;
  > h2 {
    margin 56px 0;
  }
  .inputGroup:not(:last-child) {
    margin-bottom: 32px;
  }
`;

import styled from "styled-components";

export const ProductButtonGroup = styled.div`
  margin-top: 56px;
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
    margin 56px 0px 48px 0px;
  }
  .inputGroup:not(:last-of-type) {
    margin-bottom: 32px;
  }
`;

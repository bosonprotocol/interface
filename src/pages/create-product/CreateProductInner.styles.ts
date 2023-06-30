import styled, { css } from "styled-components";

export const ProductLayoutContainer = styled.div(
  ({ isPreviewVisible }: { isPreviewVisible: boolean }) => {
    if (!isPreviewVisible) {
      return css`
        display: flex;
        justify-content: space-between;
        > form {
          width: 100%;
        }
      `;
    }
    return "";
  }
);

export const HelpWrapper = styled.div`
  padding-left: 3rem;
`;

export const CreateProductWrapper = styled.div`
  width: 100%;

  > div:first-child {
    margin-bottom: 2rem;
  }
`;

export const MultiStepsContainer = styled.div`
  display: flex;
  padding-top: 1rem;
`;

import styled from "styled-components";

export const ProductLayoutContainer = styled.div(
  ({ isPreviewVisible }: { isPreviewVisible: boolean }) => {
    if (!isPreviewVisible) {
      return `
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
  font-family: "Plus Jakarta Sans";

  > div:first-child {
    margin-bottom: 2rem;
  }
`;

export const MultiStepsContainer = styled.div`
  display: flex;
  padding-top: 1rem;
`;

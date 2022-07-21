import isArray from "lodash/isArray";
import styled from "styled-components";

import Help from "./Help";

interface IProductLayout {
  helpData?: {
    title: string | JSX.Element;
    description: string | JSX.Element;
  }[];
  children: JSX.Element;
  style?: React.CSSProperties;
}

const ProductLayoutContainer = styled.main`
  display: flex;
  justify-content: space-between;
`;

export default function ProductLayout({ helpData, children }: IProductLayout) {
  return (
    <ProductLayoutContainer>
      {children}
      {isArray(helpData) && <Help data={helpData} />}
    </ProductLayoutContainer>
  );
}

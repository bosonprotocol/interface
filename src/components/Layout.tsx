import { ReactNode } from "react";
import styled from "styled-components";

const Root = styled.div`
  max-width: 1500px;
  padding: 0 16px;
  margin: 0 auto;

  @media (min-width: 578px) {
    padding: 0px 24px;
  }

  @media (min-width: 768px) {
    padding: 0px 28px;
  }

  @media (min-width: 981px) {
    padding: 0px 32px;
  }

  @media (min-width: 1500px) {
    padding: 0px 32px;
  }
`;

interface IProps {
  children: ReactNode;
}

export default function Layout({ children, ...props }: IProps) {
  return <Root {...props}>{children}</Root>;
}

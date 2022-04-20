import styled from "styled-components";

const Root = styled.div`
  max-width: 1500px;
  padding: 0 16px;

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
  children: JSX.Element | JSX.Element[];
}

export function Layout({ children, ...props }: IProps) {
  return <Root {...props}>{children}</Root>;
}

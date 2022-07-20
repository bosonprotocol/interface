import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

interface Props {
  children?: ReactNode;
}
export default function Stepper({ children, ...rest }: Props) {
  return <Container {...rest}>{children}</Container>;
}

import styled from "styled-components";

const Card = styled.div<{
  width?: string;
  padding?: string;
  border?: string;
  $borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  padding: ${({ padding }) => padding ?? "1rem"};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? "16px"};
  border: ${({ border }) => border};
`;
export default Card;

export const GrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.deprecated_bg3};
`;

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.deprecated_bg3};
`;

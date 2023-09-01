import { colors } from "lib/styles/colors";
import { darken } from "polished";
import styled from "styled-components";

const ResourceLink = styled.a`
  display: flex;
  color: ${colors.blue};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  gap: 4px;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${darken(0.1, colors.blue)};
    text-decoration: none;
  }
`;
export default function Resource({
  name,
  link
}: {
  name: string;
  link: string;
}) {
  return (
    <ResourceLink href={link}>
      {name}
      <sup>↗</sup>
    </ResourceLink>
  );
}

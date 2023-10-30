import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import Image from "../ui/Image";
import Typography from "../ui/Typography";

export const ProductButtonGroup = styled.div`
  margin-top: 3.5rem;
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  padding-bottom: 2rem;
`;

export const ContainerProductPage = styled.div`
  width: 100%;
  .inputGroup:not(:last-of-type) {
    margin-bottom: 2rem;
  }
  ${breakpoint.m} {
    max-width: 37rem;
  }
`;

export const SectionTitle = styled(Typography)`
  margin: 1rem 0 3rem 0;
`;
export const SectionSubTitle = styled(Typography)`
  margin: 1rem 0 1rem 0;
`;

export const StyledImage = styled(Image)`
  width: 2.5rem;
  height: 2.5rem;
  padding-top: 0;
  margin: auto;
`;

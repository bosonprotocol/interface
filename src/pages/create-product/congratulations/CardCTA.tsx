import React, { ReactElement } from "react";
import styled, { css } from "styled-components";

import { Grid } from "../../../components/ui/Grid";
import { Typography } from "../../../components/ui/Typography";
import { colors } from "../../../lib/styles/colors";

type CardCTAProps = {
  title: string;
  text: string;
  icon: ReactElement;
  cta: ReactElement;
  theme?: "light" | "dark";
};

const StyledGrid = styled(Grid)`
  ${({ theme }: { theme: CardCTAProps["theme"] }) => {
    if (theme === "dark") {
      return css`
        background: ${colors.black};
        color: ${colors.white};
      `;
    }
    return css`
      background: ${colors.lightGrey};
    `;
  }}
`;

const IconContainer = styled(Grid)`
  top: 0.5rem;
  right: 0;
  margin-bottom: 1rem;
  svg {
    > * {
      stroke-width: 14px;
    }
  }
`;

export const CardCTA: React.FC<CardCTAProps> = ({
  title,
  text,
  icon,
  cta,
  theme = "light"
}) => {
  return (
    <StyledGrid
      flexDirection="column"
      alignItems="flex-start"
      padding="1.5rem"
      theme={theme}
    >
      <>
        <IconContainer>{icon}</IconContainer>
        <Typography fontWeight="600" fontSize="1.25rem">
          {title}
        </Typography>
        <Typography tag="p">{text}</Typography>
        {cta}
      </>
    </StyledGrid>
  );
};

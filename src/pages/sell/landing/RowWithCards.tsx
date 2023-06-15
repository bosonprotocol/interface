import React, { ReactNode } from "react";
import styled from "styled-components";

import Grid from "../../../components/ui/Grid";
import GridContainer from "../../../components/ui/GridContainer";
import Typography from "../../../components/ui/Typography";

const CardsContainer = styled(GridContainer)``;

interface RowWithCardsProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const RowWithCards: React.FC<RowWithCardsProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <Grid flexDirection="column" alignItems="flex-start">
      <Typography
        tag="h2"
        fontWeight="600"
        $fontSize="2rem"
        marginBottom="0.25rem"
      >
        {title}
      </Typography>
      <Typography fontWeight="400" $fontSize="20px" marginBottom="2.5rem">
        {subtitle}
      </Typography>
      <CardsContainer
        itemsPerRow={{
          xs: 2,
          s: 3,
          m: 3,
          l: 3,
          xl: 3
        }}
        columnGap="2.5rem"
        rowGap="2.5rem"
      >
        {children}
      </CardsContainer>
    </Grid>
  );
};

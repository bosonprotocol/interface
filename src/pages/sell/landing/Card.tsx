import React, { ReactNode } from "react";
import styled from "styled-components";

import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { colors } from "../../../lib/styles/colors";

const StyledGrid = styled(Grid)`
  background: ${colors.lightGrey2};
  padding: 1.5rem;
`;

const Tag = styled.div`
  background: ${colors.white};
  padding: 0.3125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

interface CardProps {
  image: ReactNode;
  title: string;
  subtitle: string;
  tags?: string[];
}

export const Card: React.FC<CardProps> = ({ image, title, subtitle, tags }) => {
  return (
    <StyledGrid flexDirection="column" alignItems="flex-start">
      {image}
      <Typography fontWeight="600" $fontSize="1.25rem">
        {title}
      </Typography>
      <Typography fontWeight="400" $fontSize="1rem" margin="0.25rem 0 2.5rem 0">
        {subtitle}
      </Typography>
      {tags && (
        <Grid justifyContent="flex-start" gap="1rem">
          {tags.map((tag) => {
            return <Tag key={tag}>{tag}</Tag>;
          })}
        </Grid>
      )}
    </StyledGrid>
  );
};

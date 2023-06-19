import React, { ReactNode } from "react";
import styled from "styled-components";

import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { colors } from "../../../lib/styles/colors";

const StyledGrid = styled(Grid)`
  background: ${colors.lightGrey2};
  padding: 1.5rem;
  color: initial;
  :hover {
    cursor: pointer;
    filter: drop-shadow(5px 5px 10px ${colors.grey}) brightness(101%);

    .title {
      text-decoration: underline;
    }
    img {
      transform: scale(1.1);
      transition: all 0.2s ease;
    }
  }
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
  as?: React.ElementType;
  tags?: string[];
  onClick?: () => void;
  [x: string]: any;
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  tags,
  onClick,
  as,
  ...rest
}) => {
  return (
    <StyledGrid
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      onClick={onClick}
      as={as}
      {...rest}
    >
      {image}
      <Typography
        fontWeight="600"
        $fontSize="1.25rem"
        marginTop="1rem"
        className="title"
      >
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

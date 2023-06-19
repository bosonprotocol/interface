import { ArrowRight, Clock } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

type SalesChannelCardProps = {
  title: string;
  text: string;
  to: string;
  time: string;
};

const StyledGrid = styled(Grid)`
  background: ${colors.white};
  position: relative;
`;

const Time = styled(Grid)`
  width: initial;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${colors.lightGrey};
  padding: 0.25rem 0.5rem;
`;

export const SalesChannelCard: React.FC<SalesChannelCardProps> = ({
  title,
  text,
  to,
  time
}) => {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <StyledGrid flexDirection="column" alignItems="flex-start" padding="1.5rem">
      <Time gap="0.25rem">
        <Clock size={16} color={colors.secondary} />
        <Typography
          fontWeight="600"
          $fontSize="0.75rem"
          color={colors.darkGrey}
        >
          {time}
        </Typography>
      </Time>
      <Typography fontWeight="600" $fontSize="1.25rem" margin="0.8rem 0 0 0">
        {title}
      </Typography>
      <Typography tag="p">{text}</Typography>
      <Button
        theme="secondary"
        size="small"
        onClick={() => {
          navigate({
            pathname: to
          });
        }}
      >
        Setup <ArrowRight size={24} />
      </Button>
    </StyledGrid>
  );
};

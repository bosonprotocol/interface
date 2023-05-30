import { ArrowRight } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

type SalesChannelCardProps = {
  title: string;
  text: string;
  to: keyof typeof BosonRoutes;
};

const StyledGrid = styled(Grid)`
  background: ${colors.white};
`;

export const SalesChannelCard: React.FC<SalesChannelCardProps> = ({
  title,
  text,
  to: BosonRoutesKey
}) => {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <StyledGrid flexDirection="column" alignItems="flex-start" padding="1.5rem">
      <Typography fontWeight="600" $fontSize="1.25rem">
        {title}
      </Typography>
      <Typography tag="p">{text}</Typography>
      <Button
        theme="secondary"
        size="small"
        onClick={() => {
          navigate({ pathname: BosonRoutes[BosonRoutesKey] });
        }}
      >
        Setup <ArrowRight size={24} />
      </Button>
    </StyledGrid>
  );
};

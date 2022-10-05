import { CaretRight } from "phosphor-react";
import React, { useCallback } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";

interface Props {
  steps: {
    id: number;
    label: string;
    url: string;
    hightlighted: boolean;
  }[];
  margin?: string;
}
const StyledCaret = styled(CaretRight)`
  margin-right: 0.3125rem;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  cursor: pointer;
`;

function Breadcrumbs({ steps, margin }: Props) {
  const navigate = useKeepQueryParamsNavigate();

  const isNotFinalStep = useCallback(
    (stepId: number) => stepId + 1 < steps.length,
    [steps]
  );

  return (
    <Grid $width="fit-content" margin={margin ? margin : "0"}>
      {steps.map((step) => (
        <Button
          key={step.id}
          onClick={() => {
            navigate({ pathname: step.url });
          }}
        >
          <Typography
            $fontSize="0.875rem"
            fontWeight="600"
            color={step.hightlighted ? colors.secondary : colors.darkGrey}
            margin="0 0.3125rem 0 0"
          >
            {step.label}
          </Typography>{" "}
          {isNotFinalStep(step.id) && (
            <StyledCaret
              size={18}
              color={step.hightlighted ? colors.secondary : colors.darkGrey}
            />
          )}
        </Button>
      ))}
    </Grid>
  );
}

export default Breadcrumbs;

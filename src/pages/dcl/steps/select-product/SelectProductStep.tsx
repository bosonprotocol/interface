import { PlusCircle } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { Input, Select } from "../../../../components/form";
import BosonButton from "../../../../components/ui/BosonButton";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { DCLLayout } from "../../styles";

const StyledGrid = styled(Grid)`
  background: ${colors.white};
`;

type SelectProductStepProps = {
  goToNextStep: () => void;
};

export const SelectProductStep: React.FC<SelectProductStepProps> = ({
  goToNextStep
}) => {
  return (
    <DCLLayout width="auto">
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography fontWeight="600" $fontSize="1.5rem">
          DCL Setup
        </Typography>
        <StyledGrid
          style={{ minHeight: "31.25rem" }}
          alignItems="flex-start"
          padding="1.5rem"
        >
          <Grid>
            <Grid alignItems="center">
              <Select name="sortyBy" options={[]} />
              <Input name="filter" />
            </Grid>
            <BosonButton style={{ whiteSpace: "pre" }}>
              Add product <PlusCircle size={15} />
            </BosonButton>
          </Grid>
        </StyledGrid>
      </Grid>
    </DCLLayout>
  );
};

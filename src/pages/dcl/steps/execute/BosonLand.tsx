import { ArrowSquareOut } from "phosphor-react";
import React from "react";

import BosonButton from "../../../../components/ui/BosonButton";
import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { DCLLayout } from "../../styles";

interface BosonLandProps {
  setSuccess: () => void;
}

export const BosonLand: React.FC<BosonLandProps> = ({ setSuccess }) => {
  return (
    <DCLLayout width="auto">
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography fontWeight="600" $fontSize="2rem">
          Add product to your Boson Land
        </Typography>
        <Typography tag="p">
          To get access and sell on Boson Land you need to apply through the
          Typeform link below. We will get in touch with you within 1-3 business
          days. If any questions arise do not hesitate to contact us.
        </Typography>
        <Button theme="secondary">
          Apply <ArrowSquareOut size={24} />
        </Button>
        <BosonButton
          onClick={() => setSuccess()}
          style={{ marginTop: "3.5rem" }}
        >
          Done
        </BosonButton>
      </Grid>
    </DCLLayout>
  );
};

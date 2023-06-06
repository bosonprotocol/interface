import { ArrowSquareOut, GithubLogo } from "phosphor-react";
import React from "react";

import { FormField, Input } from "../../../../components/form";
import BosonButton from "../../../../components/ui/BosonButton";
import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { DCLLayout } from "../../styles";

interface OwnLandProps {
  setSuccess: () => void;
}

export const OwnLand: React.FC<OwnLandProps> = ({ setSuccess }) => {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <DCLLayout width="auto">
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography fontWeight="600" $fontSize="2rem">
          Add product to your land
        </Typography>
        <Typography tag="p">
          The developer documentation provides comprehensive guidance on
          integrating the Boson Kiosk into your virtual property in
          Decentraland. This capability will enable scene builders in
          Decentraland to incorporate a Boson Kiosk into their virtual
          environments.
        </Typography>
        <Typography tag="p">
          The integration of a Boson Kiosk enables potential buyers to purchase
          Boson rNFTs (redeemable Non-Fungible Tokens) directly within the
          Metaverse. This is achieved through direct interaction with the Boson
          Protocol on the Polygon platform.
        </Typography>
        <Typography tag="p">
          Do not hesitate to get in touch in case you need any help!
        </Typography>
        <Grid justifyContent="flex-start" gap="1.25rem">
          <a
            href="https://docs.bosonprotocol.io/docs/quick_start/metaverse_tutorial/selling_in_dcl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button theme="secondary">
              Documentation <ArrowSquareOut size={24} />
            </Button>
          </a>
          <a
            href="https://github.com/bosonprotocol/boson-dcl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button theme="secondary">
              GitHub <GithubLogo size={24} />
            </Button>
          </a>
        </Grid>
        <Typography margin="3.5rem 0 0 0" fontWeight="600" $fontSize="1.25rem">
          Link product
        </Typography>
        <FormField
          title="Product location URL"
          style={{ margin: "1.5rem 0 3.5rem 0" }}
        >
          <Input
            name="step2.locationUrl"
            style={{ maxWidth: "31.625rem" }}
            placeholder="URL..."
          />
        </FormField>
        <BosonButton onClick={() => setSuccess()}>Save</BosonButton>
      </Grid>
    </DCLLayout>
  );
};

import { Info } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { ModalProps } from "../../ModalContext";
import { FormModel } from "./RedeemModalFormModel";

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
  [FormModel.formFields.name.name]: string;
  [FormModel.formFields.streetNameAndNumber.name]: string;
  [FormModel.formFields.city.name]: string;
  [FormModel.formFields.state.name]: string;
  [FormModel.formFields.zip.name]: string;
  [FormModel.formFields.country.name]: string;
  [FormModel.formFields.email.name]: string;
}

export default function RedeemSuccessModal({
  hideModal,
  name,
  streetNameAndNumber,
  city,
  state,
  zip,
  country,
  email
}: Props) {
  return (
    <>
      <StyledGrid justifyContent="flex-start" gap="0.5rem">
        <Info size={30} />
        <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
          This exchange is facilitated by Boson Protocol's settlement mechanism.
        </Typography>
      </StyledGrid>
      <Typography
        fontWeight="600"
        $fontSize="1rem"
        lineHeight="1.5rem"
        margin="1rem 0"
      >
        Your item is on its way to:
      </Typography>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography>{name}</Typography>
        <Typography>{streetNameAndNumber}</Typography>
        <Typography>{city}</Typography>
        <Typography>{state}</Typography>
        <Typography>{zip}</Typography>
        <Typography>{country}</Typography>
        <Typography>{email}</Typography>
      </Grid>
      <Typography
        fontWeight="600"
        $fontSize="1rem"
        lineHeight="1.5rem"
        margin="1rem 0"
      >
        What's next?
      </Typography>
      <Typography>
        Lean back and enjoy the wait! The seller will provide updates on the
        shipment of your purchase via email. May problems arise, feel free to
        contact the Dispute Resolver.
      </Typography>
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <Button theme="primary" onClick={() => hideModal()}>
          Done
        </Button>
      </Grid>
    </>
  );
}

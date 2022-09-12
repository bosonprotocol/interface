import { useField } from "formik";
import { Info } from "phosphor-react";
import { useEffect } from "react";
import styled from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { FormModel } from "../RedeemModalFormModel";

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

interface Props {
  onNextClick: () => void;
}

export default function Summary({ onNextClick }: Props) {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps({
      ...store,
      modalProps: {
        ...store.modalProps,
        title: "Congratulations!"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [nameField] = useField(FormModel.formFields.name.name);
  const [streetNameAndNumberField] = useField(
    FormModel.formFields.streetNameAndNumber.name
  );
  const [cityField] = useField(FormModel.formFields.city.name);
  const [stateField] = useField(FormModel.formFields.state.name);
  const [zipField] = useField(FormModel.formFields.zip.name);
  const [countryField] = useField(FormModel.formFields.country.name);
  const [emailField] = useField(FormModel.formFields.email.name);
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
        <Typography>{nameField.value}</Typography>
        <Typography>{streetNameAndNumberField.value}</Typography>
        <Typography>{cityField.value}</Typography>
        <Typography>{stateField.value}</Typography>
        <Typography>{zipField.value}</Typography>
        <Typography>{countryField.value}</Typography>
        <Typography>{emailField.value}</Typography>
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
        <Button theme="primary" onClick={() => onNextClick()}>
          Done
        </Button>
      </Grid>
    </>
  );
}

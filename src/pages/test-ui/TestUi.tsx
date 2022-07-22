import styled from "styled-components";

import DatePicker from "../../components/datepicker/DatePicker";
import Field, { FieldType } from "../../components/form/Field";
import FormField from "../../components/form/FormField";
import Grid from "../../components/ui/Grid";
import { breakpoint } from "../../lib/styles/breakpoint";

const LandingPage = styled.div`
  padding: 0 0.5rem 0 0.5rem;
  ${breakpoint.m} {
    padding: 0 2rem 0 2rem;
  }
  ${breakpoint.xl} {
    padding: 0 4rem 0 4rem;
  }
`;
export default function TestUi() {
  return (
    <LandingPage>
      <Grid flexDirection="column" alignItems="flex-start">
        <FormField
          header="Header of the Datepicker"
          subheader="Subheader informations"
          tooltip="You can see tooltip once you hover on the info icon."
          required
        >
          <DatePicker />
        </FormField>
        <FormField
          header="Header of the Input"
          subheader="Subheader informations"
        >
          <Field fieldType={FieldType.Input} />
        </FormField>
        <FormField
          header="Header of the Textarea"
          subheader="Subheader informations"
        >
          <Field fieldType={FieldType.Textarea} />
        </FormField>
      </Grid>
    </LandingPage>
  );
}

import { Form, Formik } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import Collapse from "../../../../../../collapse/Collapse";
import FormField from "../../../../../../form/FormField";
import Input from "../../../../../../form/Input";
import Button from "../../../../../../ui/Button";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

const Container = styled.div`
  background: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

function EscalateStepTwo() {
  const initialValues = {};
  return (
    <Formik<typeof initialValues>
      initialValues={{ ...initialValues }}
      validationSchema={null}
      onSubmit={async (values) => {
        console.log(values);
      }}
    >
      {() => {
        return (
          <Form>
            <Container>
              <Collapse
                wrap
                title={
                  <Typography tag="h6" margin="0">
                    1. Sign Message
                  </Typography>
                }
              >
                <Grid
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap="1rem"
                >
                  <Typography
                    $fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Click the button below to sign an arbitrary message with
                    your wallet. This will allow the dispute resolver to verify
                    your identity.
                  </Typography>
                  <FormField title="Message">
                    <Input name="message" />
                  </FormField>
                  <Button theme="bosonSecondaryInverse">Sign</Button>
                </Grid>
              </Collapse>
              <Collapse
                wrap
                title={
                  <Typography tag="h6" margin="0">
                    2. Confirm Escalation
                  </Typography>
                }
              >
                <Grid
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap="1rem"
                >
                  <Typography
                    $fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Confirm the dispute escalation transaction.
                  </Typography>
                  <Button theme="escalate">Escalate</Button>
                </Grid>
              </Collapse>
              <Collapse
                wrap
                title={
                  <Typography tag="h6" margin="0">
                    3. Case Description and Evidence
                  </Typography>
                }
              >
                <Grid
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap="1rem"
                >
                  <Typography
                    $fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Email the dispute resolver by copying the below details and
                    attaching any evidence (e.g. Chat Transcript, Files, etc)
                  </Typography>
                  <FormField title="Email Address">
                    <Input name="email" />
                  </FormField>
                  <FormField title="Authentication message">
                    Exchange ID Dispute ID Signature
                  </FormField>
                </Grid>
              </Collapse>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
}

export default EscalateStepTwo;

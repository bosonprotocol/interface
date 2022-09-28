import { Form, Formik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import Collapse from "../../../../../../collapse/Collapse";
import { Checkbox } from "../../../../../../form";
import FormField from "../../../../../../form/FormField";
import Input from "../../../../../../form/Input";
import Button from "../../../../../../ui/Button";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  background: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

interface Props {
  exchange: Exchange;
}
function EscalateStepTwo({ exchange }: Props) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const initialValues = {};

  return (
    <Formik<typeof initialValues>
      initialValues={{ ...initialValues }}
      validationSchema={null}
      onSubmit={async (values) => {
        console.log(values);
      }}
    >
      {({ values }) => {
        console.log(values);
        return (
          <Form>
            <Container>
              <Collapse
                isInitiallyOpen={activeStep === 0}
                disable={activeStep < 0}
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
                  align-items="flex-start"
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
                  <FormField theme="white" title="Message">
                    <Input
                      name="message"
                      placeholder="“I, 0xabc123, wish to escalate the dispute relating to exchange with ID: X”"
                    />
                  </FormField>
                  <Button
                    theme="bosonSecondaryInverse"
                    onClick={() => {
                      setActiveStep(1);
                    }}
                  >
                    Sign
                  </Button>
                </Grid>
              </Collapse>
              <Collapse
                isInitiallyOpen={activeStep === 1}
                disable={activeStep < 1}
                wrap
                title={
                  <Typography tag="h6" margin="0">
                    2. Case Description and Evidence
                  </Typography>
                }
              >
                <Grid
                  flexDirection="column"
                  justifyContent="flex-start"
                  align-items="flex-start"
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
                  <FormField theme="white" title="Email Address">
                    <Input
                      name="email"
                      placeholder="disputes@bosonprotocol.io"
                    />
                  </FormField>
                  <FormField theme="white" title="Authentication message">
                    <Input name="exchangeId" placeholder="XY" />
                    <Input name="disputeId" placeholder="XY" />
                    <Input
                      name="Signature"
                      placeholder="893984vgghjkjhlklkjkjljlkjlkjkljlhkjgjhgjhhgf"
                    />
                  </FormField>
                  <FormField theme="white" title="Chat transcript">
                    <Button
                      theme="bosonSecondaryInverse"
                      onClick={() => {
                        setActiveStep(2);
                      }}
                    >
                      Download CSV
                    </Button>
                  </FormField>
                </Grid>
              </Collapse>
              <div>
                <Checkbox
                  name="confirm"
                  text="I confirm that I've sent the required email to the Dispute Resolver."
                />
              </div>
              <Collapse
                isInitiallyOpen={activeStep === 2}
                disable={activeStep < 2}
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
                  align-items="flex-start"
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
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
}

export default EscalateStepTwo;

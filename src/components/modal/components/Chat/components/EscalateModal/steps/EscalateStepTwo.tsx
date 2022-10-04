import { BigNumberish } from "ethers";
import { Form, Formik, FormikProps, FormikState } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";
import * as Yup from "yup";

import { CONFIG } from "../../../../../../../lib/config";
import { colors } from "../../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../../../../lib/utils/useCoreSdk";
import { poll } from "../../../../../../../pages/create-product/utils";
import Collapse from "../../../../../../collapse/Collapse";
import { Checkbox } from "../../../../../../form";
import FormField from "../../../../../../form/FormField";
import Input from "../../../../../../form/Input";
import Textarea from "../../../../../../form/Textarea";
import ErrorToast from "../../../../../../toasts/common/ErrorToast";
import SuccessTransactionToast from "../../../../../../toasts/SuccessTransactionToast";
import Button from "../../../../../../ui/Button";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";
import { useModal } from "../../../../../useModal";

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
export const FormModel = {
  formFields: {
    message: {
      name: "message",
      requiredErrorMessage: "This field is required",
      placeholder:
        "“I, 0xabc123, wish to escalate the dispute relating to exchange with ID: X”"
    },
    email: {
      name: "email",
      requiredErrorMessage: "This field is required",
      value: "disputes@bosonprotocol.io",
      disabled: true
    },
    exchangeId: {
      name: "exchangeId",
      requiredErrorMessage: "This field is required",
      disabled: true
    },
    disputeId: {
      name: "disputeId",
      requiredErrorMessage: "This field is required",
      disabled: true
    },
    signature: {
      name: "signature",
      requiredErrorMessage: "This field is required",
      disabled: true
    },
    confirm: {
      name: "confirm",
      requiredErrorMessage: "This field must be checked",
      text: "I confirm that I've sent the required email to the Dispute Resolver."
    }
  }
};

const validationSchemaPerStep = [
  Yup.object({
    [FormModel.formFields.message.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.message.requiredErrorMessage)
  }),
  Yup.object({
    [FormModel.formFields.exchangeId.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.exchangeId.requiredErrorMessage),
    [FormModel.formFields.disputeId.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.disputeId.requiredErrorMessage),
    [FormModel.formFields.signature.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.signature.requiredErrorMessage),
    [FormModel.formFields.confirm.name]: Yup.bool().oneOf(
      [true],
      FormModel.formFields.message.requiredErrorMessage
    )
  }),
  Yup.object({})
];

interface Props {
  exchange: Exchange;
  refetch: () => void;
}
function EscalateStepTwo({ exchange, refetch }: Props) {
  const { hideModal, showModal } = useModal();
  const coreSDK = useCoreSDK();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const { address } = useAccount();
  const { isLoading, signMessage } = useSignMessage({
    onSuccess(data) {
      setActiveStep(1);
      setSignature(data);
    }
  });

  const validationSchema = validationSchemaPerStep[activeStep];
  const initialValues = useMemo(
    () => ({
      [FormModel.formFields.message
        .name]: `I, ${address}, wish to escalate the dispute relating to exchange with ID: ${exchange.id}`,
      [FormModel.formFields.email.name]: FormModel.formFields.email.value,
      [FormModel.formFields.exchangeId.name]: `Exchange ID: ${exchange?.id}`,
      [FormModel.formFields.disputeId.name]: `Dispute ID: ${
        exchange?.dispute?.id || exchange?.id
      }`,
      [FormModel.formFields.signature.name]: `Signature: ${signature}`,
      [FormModel.formFields.confirm.name]: false
    }),
    [signature, exchange, address]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<FormikProps<any> | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [activeStep]);

  const handleEscalate = useCallback(async () => {
    try {
      setLoading(true);
      showModal("WAITING_FOR_CONFIRMATION");
      const tx = await coreSDK.escalateDispute(exchange.id);
      showModal("TRANSACTION_SUBMITTED", {
        action: "Escalate dispute",
        txHash: tx.hash
      });
      await tx.wait();
      await poll(
        async () => {
          const escalatedDispute = await coreSDK.getDisputeById(
            exchange.dispute?.id as BigNumberish
          );
          return escalatedDispute.escalatedDate;
        },
        (escalatedDate) => {
          return !escalatedDate;
        },
        500
      );
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={`Escalated dispute: ${exchange?.offer?.metadata?.name}`}
          url={CONFIG.getTxExplorerUrl?.(tx?.hash || "")}
        />
      ));
      refetch();
    } catch (error) {
      console.error(error);
      const message = (error as unknown as { message: string }).message;
      toast((t) => (
        <ErrorToast t={t}>
          <Typography tag="p" color={colors.red}>
            {message
              ? message?.split("[")?.[0]
              : "An error occured. Please try again."}
          </Typography>
        </ErrorToast>
      ));
      return false;
    } finally {
      hideModal();
      setLoading(false);
    }

    return true;
  }, [exchange, coreSDK, hideModal, refetch, showModal]);

  return (
    <Formik<typeof initialValues>
      initialValues={{ ...initialValues }}
      validationSchema={validationSchema}
      onSubmit={async (values) => values}
      validateOnMount
      enableReinitialize
    >
      {({ values, errors }: FormikState<typeof initialValues>) => {
        return (
          <Form>
            <Container>
              <Collapse
                isInitiallyOpen={activeStep === 0}
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
                  alignItems="flex-start"
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
                    <Textarea {...FormModel.formFields.message} />
                  </FormField>
                  <Button
                    theme="bosonSecondaryInverse"
                    disabled={!!errors?.message || isLoading}
                    isLoading={isLoading}
                    onClick={() => {
                      const message = values?.message as string;
                      signMessage({ message });
                    }}
                  >
                    Sign
                  </Button>
                </Grid>
              </Collapse>
              <Collapse
                isInitiallyOpen={activeStep === 1 && values?.confirm !== true}
                disable={activeStep === 0}
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
                  alignItems="flex-start"
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
                  <FormField
                    theme="white"
                    title="Email Address"
                    valueToCopy={{
                      [FormModel.formFields.email.name]: values?.email || ""
                    }}
                  >
                    <Input {...FormModel.formFields.email} />
                  </FormField>
                  <FormField
                    theme="white"
                    title="Authentication message"
                    valueToCopy={{
                      [FormModel.formFields.exchangeId.name]:
                        values?.exchangeId || "",
                      [FormModel.formFields.disputeId.name]:
                        values?.disputeId || "",
                      [FormModel.formFields.signature.name]:
                        values?.signature || ""
                    }}
                  >
                    <Input {...FormModel.formFields.exchangeId} />
                    <Input {...FormModel.formFields.disputeId} />
                    <Input {...FormModel.formFields.signature} />
                  </FormField>
                  <FormField theme="white" title="Chat transcript">
                    <Button theme="bosonSecondaryInverse" disabled>
                      Download CSV
                    </Button>
                  </FormField>
                  <FormField theme="white" title="">
                    <Checkbox
                      {...FormModel.formFields.confirm}
                      disabled={activeStep === 0}
                    />
                  </FormField>
                </Grid>
              </Collapse>
              <Collapse
                isInitiallyOpen={values.confirm === true}
                disable={activeStep < 1 && !values.confirm}
                wrap
                title={
                  <Typography tag="h6" margin="0">
                    3. Confirm Escalation
                  </Typography>
                }
              >
                <Grid
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  gap="1rem"
                >
                  <Typography
                    $fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Confirm the dispute escalation transaction.
                  </Typography>
                  <Button
                    theme="escalate"
                    onClick={handleEscalate}
                    isLoading={loading}
                    disabled={loading}
                  >
                    Escalate
                  </Button>
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

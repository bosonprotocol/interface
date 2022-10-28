import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, subgraph } from "@bosonprotocol/react-kit";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { Form, Formik, FormikProps, FormikState } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";
import * as Yup from "yup";

import { CONFIG } from "../../../../../../../lib/config";
import { colors } from "../../../../../../../lib/styles/colors";
import { useAddPendingTransaction } from "../../../../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useDisputeResolvers } from "../../../../../../../lib/utils/hooks/useDisputeResolvers";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../../../../lib/utils/useCoreSdk";
import { poll } from "../../../../../../../pages/create-product/utils";
import Collapse from "../../../../../../collapse/Collapse";
import { Checkbox } from "../../../../../../form";
import { FieldInput } from "../../../../../../form/Field.styles";
import FormField from "../../../../../../form/FormField";
import Input from "../../../../../../form/Input";
import Textarea from "../../../../../../form/Textarea";
import ErrorToast from "../../../../../../toasts/common/ErrorToast";
import SuccessTransactionToast from "../../../../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../../../../ui/BosonButton";
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

const UnsignedMessageWrapper = styled.div`
  display: inline-flex;
  width: 100%;
  #unsigned_prefix {
    padding-right: 0;
    width: auto;
  }
  #unsigned_message {
    padding-left: 0;
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
    email_test: {
      name: "email",
      requiredErrorMessage: "This field is required",
      value: "disputes-test@redeemeum.com",
      disabled: true
    },
    email: {
      name: "email",
      requiredErrorMessage: "This field is required",
      value: "disputes@redeemeum.com",
      disabled: true
    },
    subject: {
      name: "subject",
      requiredErrorMessage: "This field is required",
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
    },
    buyerAddress: {
      name: "buyerAddress",
      requiredErrorMessage: "This field is required",
      text: "0x000",
      disabled: true
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
    [FormModel.formFields.subject.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.subject.requiredErrorMessage),
    [FormModel.formFields.buyerAddress.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.buyerAddress.requiredErrorMessage),
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
  const { data } = useDisputeResolvers();
  const feeAmount = data?.disputeResolvers[0]?.fees[0]?.feeAmount;
  const { hideModal, showModal } = useModal();
  const emailFormField =
    CONFIG.envName === "production"
      ? FormModel.formFields.email
      : FormModel.formFields.email_test;

  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();

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
      [emailFormField.name]: emailFormField.value,
      [FormModel.formFields.exchangeId.name]: `Exchange ID: ${exchange?.id}`,
      [FormModel.formFields.subject
        .name]: `Escalated Dispute (ID: ${exchange?.id})`,
      [FormModel.formFields.disputeId.name]: `Dispute ID: ${
        exchange?.dispute?.id || exchange?.id
      }`,
      [FormModel.formFields.signature.name]: `Signature: ${signature}`,
      [FormModel.formFields.buyerAddress
        .name]: `Buyer address: ${exchange.buyer.wallet}`,
      [FormModel.formFields.confirm.name]: false
    }),
    [signature, exchange, address, emailFormField]
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
      let tx: TransactionResponse;
      showModal("WAITING_FOR_CONFIRMATION");
      const buyerEscalationDeposit =
        exchange.offer.disputeResolutionTerms.buyerEscalationDeposit;
      const exchangeTokenAddress = exchange.offer.exchangeToken.address;
      const isMetaTx = Boolean(
        coreSDK?.isMetaTxConfigSet &&
          address &&
          (exchangeTokenAddress !== ethers.constants.AddressZero ||
            BigNumber.from(buyerEscalationDeposit).eq(0))
      );
      // in case buyerEscalationDeposit is > 0 and in native currency, meta-tx is not possible (because escalation requires a payment)
      if (isMetaTx) {
        tx = await escalateDisputeWithMetaTx(coreSDK, exchange.id);
      } else {
        tx = await coreSDK.escalateDispute(exchange.id);
      }
      showModal("TRANSACTION_SUBMITTED", {
        action: "Escalate dispute",
        txHash: tx.hash
      });
      addPendingTransaction({
        type: subgraph.EventType.DisputeEscalated,
        hash: tx.hash,
        isMetaTx,
        accountType: "Buyer",
        exchange: {
          id: exchange.id
        }
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
  }, [
    exchange,
    coreSDK,
    address,
    hideModal,
    refetch,
    showModal,
    addPendingTransaction
  ]);

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
                    <Textarea {...FormModel.formFields.message} disabled />
                  </FormField>
                  <BosonButton
                    variant="accentFill"
                    style={{ color: "white" }}
                    disabled={!!errors?.message || isLoading}
                    loading={isLoading}
                    onClick={() => {
                      const message = values?.message as string;
                      signMessage({ message });
                    }}
                  >
                    Sign
                  </BosonButton>
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
                      [emailFormField.name]: values?.email || ""
                    }}
                  >
                    <Input {...emailFormField} />
                  </FormField>
                  <FormField
                    theme="white"
                    title="Email Subject"
                    valueToCopy={{
                      [FormModel.formFields.subject
                        .name]: `Escalated Dispute (ID: ${exchange.id})`
                    }}
                  >
                    <Input {...FormModel.formFields.subject} />
                  </FormField>
                  <FormField
                    theme="white"
                    title="Email Body"
                    valueToCopy={{
                      [FormModel.formFields.exchangeId.name]:
                        values?.exchangeId || "",
                      [FormModel.formFields.disputeId.name]:
                        values?.disputeId || "",
                      [FormModel.formFields.buyerAddress.name]:
                        values?.buyerAddress ? values?.buyerAddress : "",
                      [`Unsigned message: ${FormModel.formFields.message.name}`]:
                        values?.message
                          ? `Unsigned message: ${values?.message}`
                          : "",
                      [FormModel.formFields.signature.name]:
                        values?.signature || ""
                    }}
                  >
                    <Input {...FormModel.formFields.exchangeId} />
                    <Input {...FormModel.formFields.disputeId} />
                    <Input {...FormModel.formFields.buyerAddress} disabled />
                    <UnsignedMessageWrapper>
                      <FieldInput
                        value="Unsigned message:"
                        disabled
                        id="unsigned_prefix"
                      />
                      <Input
                        {...FormModel.formFields.message}
                        disabled
                        id="unsigned_message"
                      />
                    </UnsignedMessageWrapper>
                    <Input {...FormModel.formFields.signature} />
                  </FormField>
                  <FormField theme="white" title="Chat transcript">
                    <BosonButton
                      variant="accentFill"
                      style={{ color: "white" }}
                      disabled
                    >
                      Download CSV
                    </BosonButton>
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
                    Your Escalation deposit is {feeAmount} {""}
                    {exchange.offer.exchangeToken.symbol}. This dispute resolver
                    will decide on the distribution of all funds in escrow (item
                    price, seller deposit and escalation deposit) between buyer
                    and seller
                  </Typography>
                  <BosonButton
                    variant="secondaryFill"
                    style={{ color: "black" }}
                    onClick={handleEscalate}
                    loading={loading}
                    disabled={loading || values?.confirm !== true}
                  >
                    Escalate
                  </BosonButton>
                </Grid>
              </Collapse>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
}

async function escalateDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxEscalateDispute({
      exchangeId,
      nonce
    });
  return coreSdk.relayMetaTransaction({
    functionName,
    functionSignature,
    sigR: r,
    sigS: s,
    sigV: v,
    nonce
  });
}

export default EscalateStepTwo;

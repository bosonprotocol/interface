import {
  MessageData,
  MessageType,
  ThreadId,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, Provider, subgraph } from "@bosonprotocol/react-kit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { BigNumber, BigNumberish, ethers, providers, utils } from "ethers";
import { Form, Formik, FormikProps, FormikState } from "formik";
import {
  useAccount,
  useSigner,
  useSignMessage
} from "lib/utils/hooks/connection/connection";
import { poll } from "lib/utils/promises";
import {
  sendAndAddMessageToUI,
  sendErrorMessageIfTxFails
} from "pages/chat/utils/send";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import * as Yup from "yup";

import { colors } from "../../../../../../../lib/styles/colors";
import {
  ChatInitializationStatus,
  useChatStatus
} from "../../../../../../../lib/utils/hooks/chat/useChatStatus";
import { useAddPendingTransaction } from "../../../../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useDisputeResolvers } from "../../../../../../../lib/utils/hooks/useDisputeResolvers";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../../../../lib/utils/useCoreSdk";
import { useChatContext } from "../../../../../../../pages/chat/ChatProvider/ChatContext";
import { ICON_KEYS } from "../../../../../../../pages/chat/components/conversation/const";
import { MessageDataWithInfo } from "../../../../../../../pages/chat/types";
import Collapse from "../../../../../../collapse/Collapse";
import { Checkbox } from "../../../../../../form";
import { FieldInput } from "../../../../../../form/Field.styles";
import FormField from "../../../../../../form/FormField";
import Input from "../../../../../../form/Input";
import Textarea from "../../../../../../form/Textarea";
import { Spinner } from "../../../../../../loading/Spinner";
import SuccessTransactionToast from "../../../../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../../../../ui/BosonButton";
import Button from "../../../../../../ui/Button";
import { Grid } from "../../../../../../ui/Grid";
import { Typography } from "../../../../../../ui/Typography";
import { useModal } from "../../../../../useModal";
import InitializeChatWithSuccess from "../../InitializeChatWithSuccess";

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

const requiredErrorMessage = "This field is required";
const FormModel = {
  formFields: {
    message: {
      name: "message",
      placeholder:
        "“I, 0xabc123, wish to escalate the dispute relating to exchange with ID: X”"
    },
    email_test: {
      name: "email",
      value: "disputes-test@redeemeum.com",
      disabled: true
    },
    email: {
      name: "email",
      value: "disputes@redeemeum.com",
      disabled: true
    },
    subject: {
      name: "subject",
      disabled: true
    },
    exchangeId: {
      name: "exchangeId",
      disabled: true
    },
    disputeId: {
      name: "disputeId",
      disabled: true
    },
    signature: {
      name: "signature",
      disabled: true
    },
    confirm: {
      name: "confirm",
      text: "I confirm that I've sent the required email to the Dispute Resolver."
    },
    buyerAddress: {
      name: "buyerAddress",
      text: "0x000",
      disabled: true
    }
  }
};

const validationSchemaPerStep = [
  Yup.object({
    [FormModel.formFields.message.name]: Yup.string()
      .trim()
      .required(requiredErrorMessage)
  }),
  Yup.object({
    [FormModel.formFields.exchangeId.name]: Yup.string()
      .trim()
      .required(requiredErrorMessage),
    [FormModel.formFields.subject.name]: Yup.string()
      .trim()
      .required(requiredErrorMessage),
    [FormModel.formFields.buyerAddress.name]: Yup.string()
      .trim()
      .required(requiredErrorMessage),
    [FormModel.formFields.disputeId.name]: Yup.string()
      .trim()
      .required(requiredErrorMessage),
    [FormModel.formFields.signature.name]: Yup.string()
      .trim()
      .required(requiredErrorMessage),
    [FormModel.formFields.confirm.name]: Yup.bool().oneOf(
      [true],
      "This field must be checked"
    )
  }),
  Yup.object({})
];

export type EscalateChatProps = {
  setHasError?: Dispatch<SetStateAction<boolean>>;
  addMessage?: (
    newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
  ) => Promise<void>;
  onSentMessage?: (messageData: MessageData, uuid: string) => Promise<void>;
};

type Props = EscalateChatProps & {
  exchange: Exchange;
  refetch: () => void;
};
function EscalateStepTwo({
  exchange,
  refetch,
  addMessage,
  onSentMessage,
  setHasError
}: Props) {
  const signer = useSigner();
  const { config } = useConfigContext();
  const { bosonXmtp } = useChatContext();
  const { chatInitializationStatus } = useChatStatus();
  const { data } = useDisputeResolvers();
  const disputeResolver = data?.disputeResolvers[0];
  const feeAmount = disputeResolver?.fees[0]?.feeAmount;
  const { hideModal, showModal } = useModal();
  const emailFormField =
    config.envName === "production"
      ? FormModel.formFields.email
      : FormModel.formFields.email_test;

  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const { account: address } = useAccount();
  const { isLoading, mutateAsync: signMessage } = useSignMessage();

  const threadId = useMemo<ThreadId | null>(() => {
    if (!exchange) {
      return null;
    }
    return {
      exchangeId: exchange.id,
      buyerId: exchange.buyer.id,
      sellerId: exchange.seller.id
    };
  }, [exchange]);
  const destinationAddressLowerCase = exchange?.offer.seller.assistant;
  const destinationAddress = destinationAddressLowerCase
    ? utils.getAddress(destinationAddressLowerCase)
    : "";
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

  const showSuccessInitialization =
    [
      ChatInitializationStatus.INITIALIZED,
      ChatInitializationStatus.ALREADY_INITIALIZED
    ].includes(chatInitializationStatus) && bosonXmtp;
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
                    fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Click the button below to sign an arbitrary message with
                    your wallet. This will allow the dispute resolver to verify
                    your identity.
                  </Typography>
                  <FormField title="Message">
                    <Textarea {...FormModel.formFields.message} disabled />
                  </FormField>
                  <BosonButton
                    variant="accentFill"
                    style={{ color: "white" }}
                    disabled={!!errors?.message || isLoading}
                    loading={isLoading}
                    onClick={async () => {
                      const message = values?.message as string;
                      const signature = await signMessage({ message });
                      if (signature) {
                        setActiveStep(1);
                        setSignature(signature);
                      }
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
                    fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Email the dispute resolver by copying the below details and
                    attaching any evidence (e.g. Chat Transcript, Files, etc)
                  </Typography>
                  <FormField
                    title="Email Address"
                    valueToCopy={{
                      [emailFormField.name]: values?.email || ""
                    }}
                  >
                    <Input {...emailFormField} />
                  </FormField>
                  <FormField
                    title="Email Subject"
                    valueToCopy={{
                      [FormModel.formFields.subject
                        .name]: `Escalated Dispute (ID: ${exchange.id})`
                    }}
                  >
                    <Input {...FormModel.formFields.subject} />
                  </FormField>
                  <FormField
                    title="Email Body"
                    valueToCopy={{
                      [FormModel.formFields.exchangeId.name]:
                        values?.exchangeId || "",
                      [FormModel.formFields.disputeId.name]:
                        values?.disputeId || "",
                      [FormModel.formFields.buyerAddress.name]:
                        values?.buyerAddress ? values?.buyerAddress : "",
                      [`Signed message: ${FormModel.formFields.message.name}`]:
                        values?.message
                          ? `Signed message: ${values?.message}`
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
                        value="Signed message:"
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
                  <FormField title="Chat transcript">
                    <BosonButton
                      variant="accentFill"
                      style={{ color: "white" }}
                      disabled
                    >
                      Download CSV
                    </BosonButton>
                  </FormField>
                  <FormField title="">
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
                    fontSize="1rem"
                    fontWeight="400"
                    color={colors.darkGrey}
                  >
                    Your Escalation deposit is {feeAmount} {""}
                    {exchange.offer.exchangeToken.symbol}. This dispute resolver
                    will decide on the distribution of all funds in escrow (item
                    price, seller deposit and escalation deposit) between buyer
                    and seller
                  </Typography>
                  <InitializeChatWithSuccess />
                  <Button
                    onClick={async () => {
                      const handleSendingEscalateMessage = async () => {
                        if (bosonXmtp && threadId && address) {
                          try {
                            setHasError?.(false);
                            const newMessage = {
                              threadId,
                              content: {
                                value: {
                                  title: "Buyer has escalated the dispute",
                                  description:
                                    "The dispute has been escalated to the 3rd party dispute resolver. The dispute resolver will decide on the outcome of the dispute.",
                                  disputeResolverInfo: [
                                    { label: "Name", value: "Redeemeum UK" },
                                    {
                                      label: "Email address",
                                      value: "disputes@redeemeum.com"
                                    }
                                  ] as { label: string; value: string }[],
                                  icon: ICON_KEYS.info,
                                  heading: "Dispute has been escalated",
                                  body: "The dispute resolver will contact you about the dispute via the email address provided in your profiile."
                                }
                              },
                              contentType: MessageType.EscalateDispute,
                              version
                            } as const;
                            await sendAndAddMessageToUI({
                              bosonXmtp,
                              addMessage,
                              onSentMessage,
                              address,
                              destinationAddress,
                              newMessage
                            });
                          } catch (error) {
                            console.error(error);
                            setHasError?.(true);
                            Sentry.captureException(error, {
                              extra: {
                                ...threadId,
                                destinationAddress,
                                action: "handleSendingEscalateMessage",
                                location: "EscalateModal"
                              }
                            });
                          }
                        }
                      };
                      let tx: TransactionResponse | undefined = undefined;
                      try {
                        setLoading(true);
                        showModal(
                          "WAITING_FOR_CONFIRMATION",
                          undefined,
                          "auto",
                          undefined,
                          {
                            xs: "400px"
                          }
                        );
                        const buyerEscalationDeposit =
                          exchange.offer.disputeResolutionTerms
                            .buyerEscalationDeposit;
                        const exchangeTokenAddress =
                          exchange.offer.exchangeToken.address;
                        const isMetaTx = Boolean(
                          coreSDK?.isMetaTxConfigSet &&
                            address &&
                            (exchangeTokenAddress !==
                              ethers.constants.AddressZero ||
                              BigNumber.from(buyerEscalationDeposit).eq(0))
                        );
                        await handleSendingEscalateMessage();

                        await sendErrorMessageIfTxFails({
                          sendsTxFn: async () => {
                            // in case buyerEscalationDeposit is > 0 and in native currency, meta-tx is not possible (because escalation requires a payment)
                            if (isMetaTx) {
                              tx = await escalateDisputeWithMetaTx(
                                coreSDK,
                                exchange.id
                              );
                            } else {
                              tx = await coreSDK.escalateDispute(exchange.id);
                            }
                          },
                          addMessageIfTxFailsFn: async (errorMessageObj) => {
                            bosonXmtp &&
                              address &&
                              (await sendAndAddMessageToUI({
                                bosonXmtp,
                                addMessage,
                                onSentMessage,
                                address,
                                destinationAddress,
                                newMessage: errorMessageObj
                              }));
                          },
                          errorMessage:
                            "Escalate dispute transaction was not successful",
                          threadId,
                          sendUserRejectionError: true,
                          userRejectionErrorMessage:
                            "Escalate dispute transaction was not confirmed"
                        });
                        if (!tx) {
                          return;
                        }
                        tx = tx as TransactionResponse;

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
                            const escalatedDispute =
                              await coreSDK.getDisputeById(
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
                            url={config.envConfig.getTxExplorerUrl?.(
                              tx?.hash || ""
                            )}
                          />
                        ));
                        refetch();
                        hideModal();
                      } catch (error) {
                        console.error(error);
                        hideModal();
                        const hasUserRejectedTx = getHasUserRejectedTx(error);
                        if (hasUserRejectedTx) {
                          showModal("TRANSACTION_FAILED");
                        } else {
                          Sentry.captureException(error);
                          showModal("TRANSACTION_FAILED", {
                            errorMessage: "Something went wrong",
                            detailedErrorMessage:
                              await extractUserFriendlyError(error, {
                                txResponse: tx as providers.TransactionResponse,
                                provider: signer?.provider as Provider
                              })
                          });
                        }
                        return false;
                      } finally {
                        setLoading(false);
                      }

                      return true;
                    }}
                    disabled={
                      loading ||
                      values?.confirm !== true ||
                      !showSuccessInitialization
                    }
                  >
                    Escalate {loading && <Spinner size={20} />}
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

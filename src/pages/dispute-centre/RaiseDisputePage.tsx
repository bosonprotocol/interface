import { MessageType } from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, hooks, Provider, subgraph } from "@bosonprotocol/react-kit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { ConnectWalletErrorMessage } from "components/error/ConnectWalletErrorMessage";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { BigNumberish, providers } from "ethers";
import { Formik } from "formik";
import { useSigner } from "lib/utils/hooks/connection/connection";
import { poll } from "lib/utils/promises";
import { ArrowLeft } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";

import ExchangePreview from "../../components/modal/components/Chat/components/ExchangePreview";
import { useModal } from "../../components/modal/useModal";
import MultiSteps from "../../components/step/MultiSteps";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import { Grid } from "../../components/ui/Grid";
import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import {
  createPendingTx,
  usePendingTransactionsStore
} from "../../lib/utils/hooks/transactions/usePendingTransactions";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import { goToViewMode, ViewMode } from "../../lib/viewMode";
import { useChatContext } from "../chat/ChatProvider/ChatContext";
import { createProposal } from "../chat/utils/create";
import {
  sendAndAddMessageToUI,
  sendErrorMessageIfTxFails,
  sendProposalToChat
} from "../chat/utils/send";
import {
  disputeCentreInitialValues,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary,
  disputeCentreValidationSchemaTellUsMore
} from "./const";
import DisputeCentreForm from "./DisputeCentreForm";

const DISPUTE_STEPS = [
  {
    name: "Choose issue",
    steps: 1
  } as const,
  {
    name: "Describe problem",
    steps: 1
  } as const,
  {
    name: "Additional details",
    steps: 1
  } as const,
  {
    name: "Make a proposal",
    steps: 1
  } as const,
  {
    name: "Review & Submit",
    steps: 1
  } as const
];

const ItemWidget = styled.div``;

const DisputeContainer = styled(Grid)`
  height: 100%;
  background: ${colors.lightGrey};
`;

const GetStartedBox = styled.div<{ isLteS: boolean }>`
  width: ${({ isLteS }) => (isLteS ? "calc(100% - 3.125rem)" : "41.75rem")};
  padding: 2rem;
  margin-top: 1rem;
  background: ${colors.white};
  margin-bottom: 3.125rem;
  height: max-content;
`;

const ItemPreview = styled(Grid)<{ isLteS: boolean }>`
  width: ${({ isLteS }) => (isLteS ? "calc(100% - 3.125rem)" : "41.75rem")};
  background-color: ${colors.white};
`;

async function raiseDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxRaiseDispute({
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

const validationSchema = [
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaTellUsMore,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary
];
function RaiseDisputePage() {
  const signer = useSigner();
  const { config } = useConfigContext();
  const { bosonXmtp } = useChatContext();
  const { showModal, hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const { isMetaTx, signerAddress: address } = hooks.useMetaTx(coreSDK);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [isRightArrowEnabled, setIsRightArrowEnabled] =
    useState<boolean>(false);
  const { [UrlParameters.exchangeId]: exchangeId } = useParams();
  const navigate = useKeepQueryParamsNavigate();
  const { isLteS } = useBreakpoints();
  const { data: buyers } = useBuyers(
    {
      wallet: address
    },
    {
      enabled: !!address
    }
  );
  const buyerId = buyers?.[0]?.id || "";
  const {
    data: exchanges = [],
    isError,
    isLoading
  } = useExchanges({
    id: exchangeId,
    disputed: null
  });
  const { addPendingTransaction } = usePendingTransactionsStore();

  const [exchange] = exchanges;

  const handleClickStep = (val: number) => {
    if (val < currentStep) {
      setCurrentStep(val);
    }
  };

  if (!address) {
    return <ConnectWalletErrorMessage />;
  }

  if (!exchange && isLoading) {
    return <LoadingMessage message="Loading exchange info..." />;
  }

  if (!exchange || isError) {
    return (
      <EmptyErrorMessage
        title="An error occurred"
        message="There has been an error while retrieving this exchange"
      />
    );
  }

  if (
    !buyerId ||
    exchange.buyer.wallet.toLowerCase() !== address?.toLowerCase()
  ) {
    return (
      <EmptyErrorMessage
        title="Wrong account"
        message="You have to be the buyer of this exchange to raise a dispute"
      />
    );
  }

  if (exchange.disputed) {
    return (
      <EmptyErrorMessage
        title="Disputed"
        message="This exchange has already been disputed"
      />
    );
  }

  return (
    <>
      <Grid alignItems="center" gap="2.5rem">
        {!isLteS && (
          <Grid alignItems="center" style={{ flex: "1 1 0" }}>
            <ArrowLeft
              size={32}
              color={
                currentStep === 0 ? colors.lightArrowColor : colors.darkGrey
              }
              onClick={() => {
                goToViewMode(
                  ViewMode.DAPP,
                  generatePath(BosonRoutes.Exchange, {
                    [UrlParameters.exchangeId]: exchangeId as string
                  }) as `/${string}`
                );
              }}
            />
          </Grid>
        )}
        <Grid
          padding={isLteS ? "2.5rem 0" : "0.5rem 0"}
          style={{ flex: "1 1 auto" }}
        >
          <MultiSteps
            data={DISPUTE_STEPS}
            active={currentStep}
            callback={handleClickStep}
            disableInactiveSteps
            isRightArrowEnabled={isRightArrowEnabled}
          />
        </Grid>
      </Grid>
      <DisputeContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <ItemPreview
          justifyContent="space-between"
          margin="2rem 0 0 0"
          padding="2rem"
          isLteS={isLteS}
        >
          <ExchangePreview exchange={exchange} />
        </ItemPreview>
        <GetStartedBox isLteS={isLteS}>
          <ItemWidget>
            <Formik
              initialValues={disputeCentreInitialValues}
              onSubmit={async (values) => {
                let tx: TransactionResponse | undefined = undefined;
                try {
                  if (!bosonXmtp && values.proposalType?.label) {
                    const err = new Error(
                      "You have to initialize the chat before raising a dispute"
                    );
                    setSubmitError(err);
                    console.error(err.message);
                    Sentry.captureException(err);
                    return;
                  }
                  const threadId = {
                    buyerId: exchange.buyer.id,
                    sellerId: exchange.seller.id,
                    exchangeId: exchange.id
                  };
                  const destinationAddress = exchange.seller.assistant;
                  if (bosonXmtp) {
                    setSubmitError(null);
                    const { proposal, filesWithData } = await createProposal({
                      isSeller: false,
                      sellerOrBuyerId: exchange.buyer.id,
                      proposalFields: {
                        description: values.description,
                        upload: values.upload,
                        proposalTypeName: values.proposalType?.label || "",
                        refundPercentage: values.refundPercentage,
                        disputeContext: [values.tellUsMore]
                      },
                      exchangeId: exchange.id,
                      coreSDK
                    });
                    await sendProposalToChat({
                      bosonXmtp,
                      proposal,
                      files: filesWithData,
                      destinationAddress,
                      threadId,
                      type: MessageType.Proposal
                    });
                  }

                  showModal(
                    "WAITING_FOR_CONFIRMATION",
                    undefined,
                    "auto",
                    undefined,
                    {
                      xs: "400px"
                    }
                  );
                  await sendErrorMessageIfTxFails({
                    sendsTxFn: async () => {
                      if (isMetaTx) {
                        tx = await raiseDisputeWithMetaTx(coreSDK, exchange.id);
                      } else {
                        tx = await coreSDK.raiseDispute(exchange.id);
                      }
                    },
                    addMessageIfTxFailsFn: async (errorMessageObj) => {
                      bosonXmtp &&
                        (await sendAndAddMessageToUI({
                          bosonXmtp,
                          address,
                          destinationAddress,
                          newMessage: errorMessageObj
                        }));
                    },
                    errorMessage:
                      "Raise dispute transaction was not successful",
                    threadId,
                    sendUserRejectionError: true,
                    userRejectionErrorMessage:
                      "Raise dispute transaction was not confirmed"
                  });
                  if (!tx) {
                    return;
                  }
                  tx = tx as TransactionResponse;

                  showModal("TRANSACTION_SUBMITTED", {
                    action: "Raise dispute",
                    txHash: tx.hash
                  });
                  addPendingTransaction(
                    createPendingTx({
                      type: subgraph.EventType.DisputeRaised,
                      executedBy: address,
                      accountType: "Buyer",
                      hash: tx.hash,
                      exchange: {
                        id: exchange.id
                      }
                    })
                  );

                  await tx.wait();
                  await poll(
                    async () => {
                      const disputedExchange = await coreSDK.getExchangeById(
                        exchange.id
                      );
                      return disputedExchange.disputedDate;
                    },
                    (disputedDate) => {
                      return !disputedDate;
                    },
                    500
                  );
                  toast((t) => (
                    <SuccessTransactionToast
                      t={t}
                      action={`Raised dispute: ${exchange.offer.metadata.name}`}
                      url={config.envConfig.getTxExplorerUrl?.(tx?.hash)}
                    />
                  ));
                  hideModal();
                  navigate({
                    pathname: DrCenterRoutes.Root
                  });
                } catch (error) {
                  console.error(error);
                  const hasUserRejectedTx = getHasUserRejectedTx(error);
                  if (hasUserRejectedTx) {
                    showModal("TRANSACTION_FAILED");
                  } else {
                    Sentry.captureException(error);
                    showModal("TRANSACTION_FAILED", {
                      errorMessage: "Something went wrong",
                      detailedErrorMessage:
                        (error as Error)?.message === "message too big"
                          ? "Please use a smaller image or fewer images"
                          : await extractUserFriendlyError(error, {
                              txResponse: tx as providers.TransactionResponse,
                              provider: signer?.provider as Provider
                            })
                    });
                  }

                  setSubmitError(error as Error);
                }
              }}
              validationSchema={validationSchema[currentStep]}
            >
              {() => (
                <DisputeCentreForm
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  exchange={exchange}
                  submitError={submitError}
                  setIsRightArrowEnabled={setIsRightArrowEnabled}
                />
              )}
            </Formik>
          </ItemWidget>
        </GetStartedBox>
      </DisputeContainer>
    </>
  );
}

export default RaiseDisputePage;

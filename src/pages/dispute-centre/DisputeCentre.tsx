import { Formik } from "formik";
import { ArrowLeft } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import ExchangePreview from "../../components/modal/components/Chat/components/ExchangePreview";
import { useModal } from "../../components/modal/useModal";
import {
  disputeCentreInitialValues,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary,
  disputeCentreValidationSchemaTellUsMore
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import Grid from "../../components/ui/Grid";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import { useChatContext } from "../chat/ChatProvider/ChatContext";
import { createProposal } from "../chat/utils/create";
import { sendProposalToChat } from "../chat/utils/send";
import { poll } from "../create-product/utils";
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

function DisputeCentre() {
  const { bosonXmtp } = useChatContext();
  const { showModal, hideModal } = useModal();
  const { address } = useAccount();
  const coreSDK = useCoreSDK();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [isRightArrowEnabled, setIsRightArrowEnabled] =
    useState<boolean>(false);
  const { [UrlParameters.exchangeId]: exchangeId } = useParams();
  const navigate = useKeepQueryParamsNavigate();
  const { isLteS } = useBreakpoints();
  const { data: buyers } = useBuyers({
    wallet: address
  });
  const buyerId = buyers?.[0]?.id || "";
  const {
    data: exchanges = [],
    isError,
    isLoading
  } = useExchanges({
    id: exchangeId,
    disputed: null
  });

  const [exchange] = exchanges;

  const handleClickStep = (val: number) => {
    if (val < currentStep) {
      setCurrentStep(val);
    }
  };

  const validationSchema = [
    disputeCentreValidationSchemaGetStarted,
    disputeCentreValidationSchemaTellUsMore,
    disputeCentreValidationSchemaAdditionalInformation,
    disputeCentreValidationSchemaMakeProposal,
    disputeCentreValidationSchemaProposalSummary
  ];

  if (!exchange && isLoading) {
    return <p>Loading exchange info...</p>;
  }

  if (!exchange || isError) {
    return <p>There has been an error while retrieving this exchange</p>;
  }

  if (
    !buyerId ||
    exchange.buyer.wallet.toLowerCase() !== address?.toLowerCase()
  ) {
    return <p>You have to be the buyer of this exchange to raise a dispute</p>;
  }

  if (exchange.disputed) {
    return <p>This exchange has already been disputed</p>;
  }

  return (
    <>
      <Grid alignItems="center" gap="2.5rem" flex="1 0">
        {!isLteS && (
          <Grid alignItems="center">
            <ArrowLeft
              size={32}
              color={
                currentStep === 0 ? colors.lightArrowColor : colors.darkGrey
              }
              onClick={() => {
                navigate({
                  pathname: generatePath(BosonRoutes.Exchange, {
                    [UrlParameters.exchangeId]: exchangeId as string
                  })
                });
              }}
            />
          </Grid>
        )}
        <Grid padding={isLteS ? "2.5rem 0" : "0.5rem 0"}>
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
                try {
                  if (!bosonXmtp && values.proposalType?.label) {
                    const err = new Error(
                      "You have to initialize the chat before raising a dispute"
                    );
                    setSubmitError(err);
                    console.error(err.message);
                    return;
                  }
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
                        disputeContext: [values.getStarted, values.tellUsMore]
                      },
                      exchangeId: exchange.id,
                      coreSDK
                    });
                    await sendProposalToChat({
                      bosonXmtp,
                      proposal,
                      files: filesWithData,
                      destinationAddress: exchange.seller.operator,
                      threadId: {
                        buyerId: exchange.buyer.id,
                        sellerId: exchange.seller.id,
                        exchangeId: exchange.id
                      }
                    });
                  }
                  const tx = await coreSDK.raiseDispute(exchange.id);
                  showModal("WAITING_FOR_CONFIRMATION");
                  showModal("TRANSACTION_SUBMITTED", {
                    action: "Raise dispute",
                    txHash: tx.hash
                  });
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
                      url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                    />
                  ));
                  hideModal();
                  navigate({
                    pathname: BosonRoutes.DisputeCenter
                  });
                } catch (error) {
                  console.error(error);
                  const hasUserRejectedTx =
                    (error as unknown as { code: string }).code ===
                    "ACTION_REJECTED";
                  if (hasUserRejectedTx) {
                    showModal("CONFIRMATION_FAILED");
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

export default DisputeCentre;

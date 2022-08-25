import { Formik } from "formik";
import { ArrowLeft } from "phosphor-react";
import { useState } from "react";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import ExchangePreview from "../../components/modal/components/Chat/components/ExchangePreview";
import {
  disputeCentreInitialValues,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary,
  disputeCentreValidationSchemaTellUsMore
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import Grid from "../../components/ui/Grid";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import { useChatContext } from "../chat/ChatProvider/ChatContext";
import { createProposal } from "../chat/utils/create";
import { sendProposalToChat } from "../chat/utils/send";
import DisputeCentreForm from "./DisputeCentreForm";

const DISPUTE_STEPS = [
  {
    name: "Choose isue",
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

const GetStartedBox = styled.div`
  width: 41.75rem;
  padding: 2rem;
  margin-top: 1rem;
  background: ${colors.white};
  margin-bottom: 3.125rem;
  height: max-content;
`;

const MultiStepsContainer = styled.div`
  padding-bottom: 0.5rem;
`;

const ItemPreview = styled(Grid)`
  width: 41.75rem;
  background-color: ${colors.white};
`;

function DisputeCentre() {
  const { bosonXmtp } = useChatContext();
  const { address } = useAccount();
  const coreSDK = useCoreSDK();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const params = useParams();
  const exchangeId = params["*"];
  const navigate = useKeepQueryParamsNavigate();
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
    disputed: null,
    buyerId
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

  if (exchange.disputed) {
    return <p>This exchange has already been disputed</p>;
  }

  return (
    <>
      <Grid alignItems="center" gap="2.5rem" flex="1 0">
        <Grid alignItems="center">
          <ArrowLeft
            size={32}
            onClick={() =>
              navigate({
                pathname: generatePath(BosonRoutes.Exchange, {
                  [UrlParameters.exchangeId]: exchangeId
                })
              })
            }
          />
        </Grid>
        <Grid padding="0.5rem 0">
          <MultiSteps
            data={DISPUTE_STEPS}
            active={currentStep}
            callback={handleClickStep}
            disableInactiveSteps
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
        >
          <ExchangePreview exchange={exchange} />
        </ItemPreview>
        <GetStartedBox>
          <ItemWidget>
            <Formik
              initialValues={disputeCentreInitialValues}
              onSubmit={async (values) => {
                try {
                  if (!bosonXmtp) {
                    console.error(
                      "You have to initialize the chat before raising a dispute"
                    );
                    return;
                  }
                  const { proposal, filesWithData } = await createProposal({
                    isSeller: false,
                    sellerOrBuyerId: exchange.buyer.id,
                    proposalFields: {
                      description: values.description,
                      upload: values.upload,
                      proposalTypeName: values.proposalsTypes?.label || "",
                      refundPercentage: values.refundPercentage,
                      disputeContext: [values.getStarted, values.tellUsMore]
                    }
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
                  const tx = await coreSDK.raiseDispute(
                    exchange.id,
                    proposal.disputeContext.join("\n")
                  );
                  await tx.wait();
                  navigate({
                    pathname: BosonRoutes.Dispute // TODO: change to dispute center
                  });
                } catch (error) {
                  console.error(error); // TODO: handle error
                }
              }}
              validationSchema={validationSchema[currentStep]}
            >
              {() => (
                <DisputeCentreForm
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  exchange={exchange}
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

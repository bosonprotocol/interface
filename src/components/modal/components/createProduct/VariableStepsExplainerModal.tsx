import { CirclesThreePlus, Megaphone, UserCirclePlus } from "phosphor-react";
import React, { useMemo } from "react";
import styled from "styled-components";

import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import {
  To,
  useKeepQueryParamsNavigate
} from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";

const StepWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  ${breakpoint.m} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  svg {
    fill: var(--secondary);
  }
`;

const Step = styled.div`
  position: relative;
  padding: 1rem;
  background: ${colors.lightGrey};
  &:not(:last-child) {
    &:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -1rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${colors.lightGrey};
    }

    &:after {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -2rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${colors.white};
      z-index: 1;
    }
  }
  ${breakpoint.m} {
    &:not(:first-child) {
      padding-left: 2rem;
    }
    &:not(:last-child) {
      &:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -1rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${colors.lightGrey};
        border-bottom: 10rem solid transparent;
        border-right: none;
      }

      &:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -2rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${colors.white};
        border-bottom: 10rem solid transparent;
        border-right: none;
        z-index: 1;
      }
    }
  }
`;

export enum VariableStep {
  CreateYourProfile = "CreateYourProfile",
  CreateYourProducts = "CreateYourProducts",
  SetupYourDCLStore = "SetupYourDCLStore",
  SetupYourWeb3Store = "SetupYourWeb3Store",
  AddSalesChannels = "AddSalesChannels"
}

const variableStepMap = {
  [VariableStep.CreateYourProfile]: {
    key: VariableStep.CreateYourProfile,
    icon: <UserCirclePlus color={colors.secondary} />,
    title: "Create your profile",
    body: "Creating a profile helps establish your branding and Web3 presence in dComemrce"
  },
  [VariableStep.CreateYourProducts]: {
    key: VariableStep.CreateYourProducts,
    icon: <CirclesThreePlus color={colors.secondary} />,
    title: "Create your products",
    body: "Create a physical or digi-physical product, enriching it with details, such as images and videos."
  },
  [VariableStep.SetupYourDCLStore]: {
    key: VariableStep.SetupYourDCLStore,
    icon: <Megaphone color={colors.secondary} />,
    title: "Setup your DCL store",
    body: "Configure your metaverse store on your own land in DCL or on Boson Boulevard."
  },
  [VariableStep.SetupYourWeb3Store]: {
    key: VariableStep.SetupYourWeb3Store,
    icon: <Megaphone color={colors.secondary} />,
    title: "Setup your Web3 store",
    body: "Build and customize your own bespoke decentralized commerce storefront"
  },
  [VariableStep.AddSalesChannels]: {
    key: VariableStep.AddSalesChannels,
    icon: <Megaphone color={colors.secondary} />,
    title: "Add sales channels",
    body: "Choose one or many channels where your products will be shown, selling everywhere!"
  }
};

interface VariableStepsExplainerModalProps {
  order:
    | [VariableStep, VariableStep, VariableStep]
    | [VariableStep, VariableStep, VariableStep, VariableStep];
  to: To;
}

const VariableStepsExplainerModal: React.FC<
  VariableStepsExplainerModalProps
> = ({ order, to }) => {
  const { sellers } = useCurrentSellers();
  const navigate = useKeepQueryParamsNavigate();
  const { showModal, store } = useModal();
  const hasSeller = !!sellers.length;
  const stepsData = useMemo(() => {
    return order.map((o) => variableStepMap[o]);
  }, [order]);
  console.log("sellers", sellers, { hasSeller });
  return (
    <>
      <Grid flexDirection="column" marginBottom="2.5rem">
        <StepWrapper>
          {stepsData.map((data) => {
            return (
              <Step key={data.key}>
                {data.icon}
                <Typography fontWeight="600" $fontSize="1.25rem">
                  {data.title}
                </Typography>
                <Typography fontWeight="400" $fontSize="1rem">
                  {data.body}
                </Typography>
              </Step>
            );
          })}
        </StepWrapper>
      </Grid>
      <BosonButton
        onClick={() => {
          if (hasSeller) {
            navigate(to);
          } else {
            showModal("ACCOUNT_CREATION", {
              title: store.modalProps?.title
            });
          }
        }}
      >
        Get started!
      </BosonButton>
    </>
  );
};

export default VariableStepsExplainerModal;

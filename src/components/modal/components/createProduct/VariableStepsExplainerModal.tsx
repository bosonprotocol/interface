import { CheckCircle } from "phosphor-react";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import { SellerLandingPageParameters } from "../../../../lib/routing/parameters";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import {
  To,
  useKeepQueryParamsNavigate
} from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ConnectButton from "../../../header/ConnectButton";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  VariableStep,
  variableStepMap,
  variableStepToQueryParam
} from "./const";

const StepWrapper = styled.div<{ $numSteps: number }>`
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
    grid-template-columns: repeat(
      ${({ $numSteps }) => $numSteps},
      minmax(0, 1fr)
    );
  }

  svg {
    fill: var(--secondary);
  }
`;

const Step = styled.div<{ $isActive: boolean }>`
  position: relative;
  padding: 1rem;
  background: ${colors.lightGrey};
  ${({ $isActive }) => {
    if ($isActive) {
      return css``;
    }
    return css`
      filter: opacity(50%);
    `;
  }}
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

interface VariableStepsExplainerModalProps {
  order:
    | [VariableStep, VariableStep, VariableStep]
    | [VariableStep, VariableStep, VariableStep, VariableStep];
  to: Omit<To, "search"> & { search?: string[][] };
  text?: string;
  buttonText?: string;
  firstActiveStep?: number;
  doSetQueryParams: boolean;
}

const VariableStepsExplainerModal: React.FC<
  VariableStepsExplainerModalProps
> = ({
  order,
  to,
  text,
  firstActiveStep = 0,
  doSetQueryParams,
  buttonText
}) => {
  const { isConnected } = useAccount();
  const { sellers } = useCurrentSellers();
  const navigate = useKeepQueryParamsNavigate();
  const { showModal, store } = useModal();
  const hasSeller = !!sellers.length;
  const stepsData = useMemo(() => {
    return order.map((o) => variableStepMap[o]);
  }, [order]);
  const modalTitle: string = store.modalProps?.title;
  const nextSearchParams: string[][] = useMemo(() => {
    if (doSetQueryParams) {
      const steps = order.map((o) => variableStepToQueryParam[o]).join(",");
      return [
        [SellerLandingPageParameters.slsteps, steps],
        [SellerLandingPageParameters.sltitle, modalTitle ?? ""]
      ];
    }
    return [];
  }, [doSetQueryParams, order, modalTitle]);
  return (
    <>
      <Grid flexDirection="column" marginBottom="2.5rem">
        {!!text && (
          <Grid flexDirection="column" margin="2.5rem 4.625rem">
            {!!text && (
              <CheckCircle
                size={105}
                color={colors.green}
                style={{ marginBottom: "2rem" }}
              />
            )}
            {!!text && (
              <Typography
                fontWeight="600"
                $fontSize="1.5rem"
                textAlign="center"
              >
                {text}
              </Typography>
            )}
          </Grid>
        )}
        <StepWrapper $numSteps={stepsData.length}>
          {stepsData.map((data, index) => {
            return (
              <Step key={data.key} $isActive={index >= firstActiveStep}>
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
      {isConnected ? (
        <BosonButton
          onClick={() => {
            if (hasSeller) {
              navigate({
                ...to,
                search: [...(to?.search ?? []), ...nextSearchParams]
              });
            } else {
              showModal("ACCOUNT_CREATION", {
                title: store.modalProps?.title
              });
            }
          }}
        >
          {buttonText || "Get started!"}
        </BosonButton>
      ) : (
        <Grid justifyContent="flex-start" gap="1rem">
          <ConnectButton />
          <Typography>Please connect your wallet</Typography>
        </Grid>
      )}
    </>
  );
};

export default VariableStepsExplainerModal;

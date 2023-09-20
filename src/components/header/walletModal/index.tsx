import { useWeb3React } from "@web3-react/core";
import { LinkWithQuery } from "components/customNavigation/LinkWithQuery";
import { MagicLoginButton } from "components/magicLink/Login";
import { AutoColumn } from "components/ui/column";
import { DrCenterRoutes } from "lib/routing/drCenterRoutes";
import { BosonRoutes } from "lib/routing/routes";
import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { getCurrentViewMode, ViewMode } from "lib/viewMode";
import { useEffect } from "react";
import styled from "styled-components";

import { connections, networkConnection } from "../../../lib/connection";
import {
  ActivationStatus,
  useActivationState
} from "../../../lib/connection/activate";
import { isSupportedChain } from "../../../lib/constants/chains";
import Grid from "../../ui/Grid";
import { flexColumnNoWrap } from "../styles";
import ConnectionErrorView from "./ConnectionErrorView";
import Option from "./Option";

const Wrapper = styled.div`
  ${flexColumnNoWrap};
  width: 100%;
  padding: 14px 16px 16px;
  flex: 1;
`;

const OptionGrid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 2px;
  border-radius: 12px;
  overflow: hidden;
  ${breakpoint.m} {
    grid-template-columns: 1fr;
  } ;
`;

const PrivacyPolicyWrapper = styled.div`
  padding: 0 4px;
  color: ${colors.darkGrey};
  font-weight: 400;
  font-size: 0.75rem;

  * {
    font-weight: 400;
    font-size: 0.75rem;
  }
`;

export default function WalletModal() {
  const { connector, chainId } = useWeb3React();

  const { activationState } = useActivationState();

  // Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
  useEffect(() => {
    if (
      chainId &&
      isSupportedChain(chainId) &&
      connector !== networkConnection.connector
    ) {
      networkConnection.connector.activate(chainId);
    }
  }, [chainId, connector]);
  const viewMode = getCurrentViewMode();
  return (
    <Wrapper data-testid="wallet-modal">
      <Grid justifyContent="space-between" marginBottom="16px">
        Connect a wallet
      </Grid>
      {activationState.status === ActivationStatus.ERROR ? (
        <ConnectionErrorView />
      ) : (
        <AutoColumn gap="16px">
          <OptionGrid data-testid="option-grid">
            {connections
              .filter((connection) => connection.shouldDisplay())
              .map((connection) => (
                <Option key={connection.getName()} connection={connection} />
              ))}
          </OptionGrid>
          <MagicLoginButton />
          <PrivacyPolicyWrapper>
            By connecting a wallet, you agree to{" "}
            {viewMode === ViewMode.DAPP ? "Boson App" : "DR Center"}'s{" "}
            <LinkWithQuery
              to={
                viewMode === ViewMode.DAPP
                  ? BosonRoutes.TermsAndConditions
                  : DrCenterRoutes.TermsAndConditions
              }
            >
              Terms & Conditions
            </LinkWithQuery>{" "}
            and consent to its{" "}
            <LinkWithQuery
              to={
                viewMode === ViewMode.DAPP
                  ? BosonRoutes.PrivacyPolicy
                  : DrCenterRoutes.PrivacyPolicy
              }
            >
              Privacy Policy
            </LinkWithQuery>
            . (Last Updated 18 August 2023)
          </PrivacyPolicyWrapper>
        </AutoColumn>
      )}
    </Wrapper>
  );
}

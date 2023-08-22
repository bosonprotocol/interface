import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import styled from "styled-components";

import { connections, networkConnection } from "../../../lib/connection";
import {
  ActivationStatus,
  useActivationState
} from "../../../lib/connection/activate";
import { isSupportedChain } from "../../../lib/constants/chains";
import Grid from "../../ui/Grid";
import ConnectionErrorView from "./ConnectionErrorView";
import Option from "./Option";

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.backgroundSurface};
  width: 100%;
  padding: 14px 16px 16px;
  flex: 1;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 2px;
  border-radius: 12px;
  overflow: hidden;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    grid-template-columns: 1fr;
  `};
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

  return (
    <Wrapper data-testid="wallet-modal">
      <Grid justifyContent="space-between" marginBottom="16px">
        Connect a wallet
      </Grid>
      {activationState.status === ActivationStatus.ERROR ? (
        <ConnectionErrorView />
      ) : (
        <Grid gap="16px" flexDirection="column">
          <OptionGrid data-testid="option-grid">
            {connections
              .filter((connection) => connection.shouldDisplay())
              .map((connection) => (
                <Option key={connection.getName()} connection={connection} />
              ))}
          </OptionGrid>
        </Grid>
      )}
    </Wrapper>
  );
}

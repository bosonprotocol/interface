import { ConnectButton } from "@rainbow-me/rainbowkit";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Account from "./Account";

const GreenButton = styled.button`
  background: ${colors.green};
  padding: 10px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
`;

const RedButton = styled(GreenButton)`
  background: ${colors.darkRed};
`;

export default function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none"
              }
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <GreenButton onClick={openConnectModal} type="button">
                    Connect Wallet
                  </GreenButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <RedButton onClick={openChainModal} type="button">
                    Wrong network
                  </RedButton>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <GreenButton
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 15, height: 15 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </GreenButton>

                  <GreenButton onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </GreenButton>

                  <Account />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

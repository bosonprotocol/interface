import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoMdWallet } from "react-icons/io";
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

const Wallet = styled(IoMdWallet)`
  cursor: pointer;
  font-size: 30px;
  :hover {
    fill: ${colors.green};
  }
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
          <div style={{ display: "flex", gap: 12 }}>
            <Account onClick={openConnectModal} />
            <div
              {...(!mounted && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none"
                }
              })}
              style={{ display: "flex" }}
            >
              {(() => {
                if (!mounted || !account || !chain) {
                  return <Wallet onClick={openConnectModal} />;
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
                    <GreenButton onClick={openAccountModal} type="button">
                      {account.displayName}
                    </GreenButton>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

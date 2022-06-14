import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/browser";
import { BsChevronDown } from "react-icons/bs";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import FallbackAvatar from "../avatar/fallback-avatar";
import Account from "./Account";

const BaseButton = styled.button`
  all: unset;
  padding: 6px 8px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const OutlineButton = styled(BaseButton)`
  background-color: #34495b;

  :hover {
    background-color: #4b627c;
  }
`;

const GreenButton = styled(BaseButton)`
  background: ${colors.green};
  color: ${colors.navy};
`;

const OrangeButton = styled(BaseButton)`
  background: ${colors.orange};
`;

const ENSAvatar = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 100%;
`;

export default function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        account && Sentry.setTag("wallet_address", account?.address);

        return (
          <div style={{ display: "flex", gap: 12 }}>
            <Account connect={openConnectModal} isConnected={!!account} />

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
                  // reset the tag o undefined
                  Sentry.setTag("wallet_address", undefined);
                  return (
                    <GreenButton onClick={openConnectModal} type="button">
                      Connect Wallet
                    </GreenButton>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <OrangeButton onClick={openChainModal} type="button">
                      Wrong network
                      <BsChevronDown size={12} />
                    </OrangeButton>
                  );
                }

                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    <OutlineButton onClick={openChainModal}>
                      {chain.hasIcon && <ENSAvatar src={chain.iconUrl} />}
                      {chain.name}
                      <BsChevronDown size={12} />
                    </OutlineButton>

                    <GreenButton onClick={openAccountModal} type="button">
                      {account.ensAvatar ? (
                        <ENSAvatar src={account.ensAvatar} />
                      ) : (
                        <FallbackAvatar address={account.address} size={18} />
                      )}
                      {account.displayName}
                      <BsChevronDown size={12} />
                    </GreenButton>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}

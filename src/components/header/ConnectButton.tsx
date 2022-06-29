import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/browser";
import { BsChevronDown } from "react-icons/bs";
import styled from "styled-components";

import metamaskLogo from "../../../src/assets/metamask-logo.svg";
import Button from "../../components/ui/Button";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import FallbackAvatar from "../avatar/fallback-avatar";

const MetaMasgLogo = styled.img`
  height: 15px;
  width: 16px;
`;

const ENSAvatar = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 100%;
`;

export default function ConnectButton() {
  const { isLteXS } = useBreakpoints();

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
          <div style={{ display: "flex", gap: 12, padding: "10px 0" }}>
            {/* <Account connect={openConnectModal} isConnected={!!account} /> */}
            {(() => {
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
              ></div>;
              if (!mounted || !account || !chain) {
                // reset the tag o undefined
                Sentry.setTag("wallet_address", undefined);
                return (
                  <Button
                    onClick={openConnectModal}
                    size={isLteXS ? "small" : "regular"}
                  >
                    Connect Wallet
                    {!isLteXS && <MetaMasgLogo src={metamaskLogo} />}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    theme="warning"
                    size={isLteXS ? "small" : "regular"}
                  >
                    Wrong network
                    <BsChevronDown size={12} />
                  </Button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  {/* <Button onClick={openChainModal} theme="outline">
                    {chain.hasIcon && <ENSAvatar src={chain.iconUrl} />}
                    {chain.name}
                    <BsChevronDown size={12} />
                  </Button> */}
                  <Button
                    onClick={openAccountModal}
                    theme="outline"
                    size={isLteXS ? "small" : "regular"}
                  >
                    {account.ensAvatar ? (
                      <ENSAvatar src={account.ensAvatar} />
                    ) : (
                      <FallbackAvatar address={account.address} size={18} />
                    )}
                    {account.displayName}
                    <BsChevronDown size={12} />
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}

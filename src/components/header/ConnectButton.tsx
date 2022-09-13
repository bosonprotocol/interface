import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/browser";
import { CaretDown } from "phosphor-react";
import styled from "styled-components";

import metamaskLogo from "../../../src/assets/metamask-logo.svg";
import Button from "../../components/ui/Button";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import FallbackAvatar from "../avatar/fallback-avatar";

const MetaMaskLogo = styled.img`
  height: 15px;
  width: 16px;
`;

const ENSAvatar = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 100%;
`;

interface Props {
  navigationBarPosition?: string;
}

export default function ConnectButton({ navigationBarPosition = "" }: Props) {
  const { isLteXS } = useBreakpoints();
  const isSideBar = ["left", "right"].includes(navigationBarPosition);
  const buttonPadding = isSideBar ? "0.75rem 1rem" : "";
  const justifyContent = isSideBar ? "center" : "";
  const width = isSideBar ? "100%" : "";
  const buttonPropsWhenSideBar = {
    ...(buttonPadding && { padding: buttonPadding }),
    ...(justifyContent && { justifyContent })
  };
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
                saveItemInStorage("isChainUnsupported", true);
                Sentry.setTag("wallet_address", undefined);

                return (
                  <Button
                    onClick={openConnectModal}
                    size={isLteXS ? "small" : "regular"}
                    style={{
                      whiteSpace: "pre",
                      ...buttonPropsWhenSideBar
                    }}
                  >
                    Connect Wallet
                    {!isLteXS && <MetaMaskLogo src={metamaskLogo} />}
                  </Button>
                );
              }

              if (chain.unsupported) {
                saveItemInStorage("isChainUnsupported", true);
                return (
                  <Button
                    onClick={openChainModal}
                    theme="warning"
                    size={isLteXS ? "small" : "regular"}
                    style={{
                      whiteSpace: "pre",
                      ...buttonPropsWhenSideBar
                    }}
                  >
                    Wrong network
                    <CaretDown size={12} />
                  </Button>
                );
              }
              saveItemInStorage("isChainUnsupported", false);
              return (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    ...(justifyContent && { justifyContent }),
                    ...(width && { width })
                  }}
                >
                  <Button
                    onClick={openAccountModal}
                    theme="outline"
                    size={isLteXS ? "small" : "regular"}
                    style={{
                      whiteSpace: "pre",
                      ...buttonPropsWhenSideBar
                    }}
                  >
                    {account.ensAvatar ? (
                      <ENSAvatar src={account.ensAvatar} />
                    ) : (
                      <FallbackAvatar address={account.address} size={18} />
                    )}
                    {account.displayName}
                    <CaretDown size={12} />
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

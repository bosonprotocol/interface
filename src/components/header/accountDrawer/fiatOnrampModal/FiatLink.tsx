import { CONFIG } from "lib/config";
import { useMagic, useWalletInfo } from "lib/utils/hooks/magic";
import { sanitizeUrl } from "lib/utils/url";
import { MouseEventHandler, ReactNode } from "react";

type FiatLinkProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
};

export const FiatLink: React.FC<FiatLinkProps> = ({ children, onClick }) => {
  const magic = useMagic();
  const { data: walletInfo } = useWalletInfo();
  const showMoonpay =
    !magic || !walletInfo || walletInfo.walletType !== "magic";
  if (showMoonpay) {
    return (
      <a
        href={sanitizeUrl(CONFIG.moonpay.externalLink)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "inherit" }}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <div
      onClick={async () => {
        if (!walletInfo || !magic) {
          return;
        }
        const walletType = walletInfo.walletType;

        if (walletType === "magic") {
          const result = await magic.wallet.showUI();
          console.log("result", result);
        }
      }}
    >
      {children}
    </div>
  );
};

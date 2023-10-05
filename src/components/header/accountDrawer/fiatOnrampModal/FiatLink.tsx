import { CONFIG } from "lib/config";
import { useMagic, useWalletInfo } from "lib/utils/hooks/magic";
import { sanitizeUrl } from "lib/utils/url";
import {
  createContext,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useMemo,
  useState
} from "react";

type FiatLinkProps = {
  children: JSX.Element;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
};

export const FiatLinkContext = createContext({
  loading: false
});

export const FiatLink: React.FC<FiatLinkProps> = ({ children, onClick }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const value = useMemo(() => {
    return {
      loading
    };
  }, [loading]);
  return (
    <FiatLinkContext.Provider value={value}>
      <InnerFiatLink setLoading={setLoading} onClick={onClick}>
        {children}
      </InnerFiatLink>
    </FiatLinkContext.Provider>
  );
};

const InnerFiatLink: React.FC<
  FiatLinkProps & { setLoading: Dispatch<SetStateAction<boolean>> }
> = ({ children, onClick, setLoading }) => {
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
          try {
            setLoading(true);
            const result = await magic.wallet.showUI();
            console.log("result", result);
          } finally {
            setLoading(false);
          }
        }
      }}
    >
      {children}
    </div>
  );
};

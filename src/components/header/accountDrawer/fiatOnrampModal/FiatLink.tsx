import { hooks } from "@bosonprotocol/react-kit";
import { CONFIG } from "lib/config";
import { sanitizeUrl } from "lib/utils/url";
import {
  createContext,
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from "react";

type FiatLinkProps = {
  children: JSX.Element;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
};

const FiatLinkContext = createContext<
  | {
      isFiatLoading: boolean;
      setFiatLoading: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const useFiatLinkContext = () => {
  const context = useContext(FiatLinkContext);
  if (context === undefined) {
    throw new Error("useFiatLinkContext must be within FiatLinkProvider");
  }
  return context;
};

export const FiatLinkProvider = ({ children }: { children: ReactNode }) => {
  const [isFiatLoading, setFiatLoading] = useState<boolean>(false);
  const value = useMemo(() => {
    return {
      isFiatLoading,
      setFiatLoading
    };
  }, [isFiatLoading, setFiatLoading]);
  return (
    <FiatLinkContext.Provider value={value}>
      {children}
    </FiatLinkContext.Provider>
  );
};

export const FiatLink: React.FC<FiatLinkProps> = ({ children, onClick }) => {
  const { setFiatLoading } = useFiatLinkContext();
  const magic = hooks.useMagic();
  const { data: walletInfo } = hooks.useWalletInfo();
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
            setFiatLoading(true);
            await magic.wallet.showUI();
          } finally {
            setFiatLoading(false);
          }
        }
      }}
    >
      {children}
    </div>
  );
};

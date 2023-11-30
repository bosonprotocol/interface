import frame from "assets/frame.png";
import ConnectWallet from "components/header/web3Status";

import { ErrorMessage, ErrorMessageProps } from "./ErrorMessage";

type ConnectWalletErrorMessageProps = Partial<
  Pick<ErrorMessageProps, "cta" | "title" | "message">
>;
export function ConnectWalletErrorMessage({
  cta,
  title,
  message
}: ConnectWalletErrorMessageProps) {
  return (
    <ErrorMessage
      cta={cta ?? <ConnectWallet />}
      message={message ?? "Please connect wallet to proceed"}
      title={title ?? "Connect wallet"}
      img={<img src={frame} alt={title} />}
    />
  );
}

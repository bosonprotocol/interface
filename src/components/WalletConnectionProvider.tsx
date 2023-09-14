import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function WalletConnectionProvider({ children }: Props) {
  return <>{children}</>;
}

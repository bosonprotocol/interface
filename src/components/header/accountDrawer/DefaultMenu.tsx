import Column from "components/ui/column";
import { useAccount } from "lib/utils/hooks/ethers/connection";
import styled from "styled-components";

import WalletModal from "../walletModal";
import AuthenticatedHeader from "./AuthenticatedHeader";

const DefaultMenuWrap = styled(Column)`
  width: 100%;
  height: 100%;
`;

function DefaultMenu() {
  const { account } = useAccount();
  const isAuthenticated = !!account;

  return (
    <DefaultMenuWrap>
      {isAuthenticated ? (
        <AuthenticatedHeader account={account} />
      ) : (
        <WalletModal />
      )}
    </DefaultMenuWrap>
  );
}

export default DefaultMenu;

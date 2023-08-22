import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import Grid from "../../ui/Grid";
import WalletModal from "../walletModal";
import AuthenticatedHeader from "./AuthenticatedHeader";

const DefaultMenuWrap = styled(Grid).attrs({ flexDirection: "column" })`
  width: 100%;
  height: 100%;
`;

function DefaultMenu() {
  const { account } = useWeb3React();
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

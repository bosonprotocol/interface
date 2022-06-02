import { useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import AddressImage from "../../components/offer/AddressImage";
import AddressText from "../../components/offer/AddressText";
import CryptoCurrency from "../../components/price/CryptoCurrency";
import { UrlParameters } from "../../lib/routing/query-parameters";
import { colors } from "../../lib/styles/colors";
import { useEnsName } from "../../lib/utils/hooks/useEnsName";
import Tabs from "./Tabs";

const BasicInfo = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const AddressImageContainer = styled.div`
  border: 6px solid ${colors.cgBlue};
  border-radius: 50%;
  background-color: ${colors.cgBlue};
`;

const EnsName = styled.div`
  font-size: 2rem;
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  * {
    font-size: 1.3rem;
  }

  img {
    width: 20px;
    margin-right: 5px;
  }
`;

export default function MyAccount() {
  const { [UrlParameters.accountId]: account } = useParams();
  const ensName = useEnsName(account || "") || "test ens"; // TODO: remove test ens

  return (
    <>
      <BasicInfo>
        <AddressImageContainer>
          {account && <AddressImage address={account} size={200} />}
        </AddressImageContainer>
        <EnsName>{ensName}</EnsName>
        <AddressContainer>
          <CryptoCurrency currencySymbol="ETH" />
          <AddressText address={account || ""} />
        </AddressContainer>
      </BasicInfo>
      <Tabs />
    </>
  );
}

import styled from "styled-components";
import { useEnsName } from "wagmi";

import Avatar from "../../../components/avatar";
import AddressText from "../../../components/offer/AddressText";
import CurrencyIcon from "../../../components/price/CurrencyIcon";
import Tabs from "../Tabs";

const AddressWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const BasicInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 0 40px 0;
`;

const EnsAndAddress = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const EnsName = styled.div`
  font-size: 1.5rem;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    font-size: 1rem;
  }

  img {
    width: 15px;
    margin-right: 5px;
  }
`;

export default function PrivateAccount({ account }: { account: string }) {
  const { data: ensName } = useEnsName({
    address: account
  });

  return (
    <>
      <AddressWrapper>
        <Avatar address={account} size={200} />
      </AddressWrapper>
      <BasicInfo>
        <EnsAndAddress>
          <EnsName>{ensName}</EnsName>

          <AddressContainer>
            <CurrencyIcon currencySymbol="ETH" />
            <AddressText address={account} />
          </AddressContainer>
        </EnsAndAddress>
      </BasicInfo>
      <Tabs isPrivateProfile={true} address={account} />
    </>
  );
}

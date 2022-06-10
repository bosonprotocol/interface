import styled from "styled-components";
import { useEnsName } from "wagmi";

import Avatar from "../../../components/avatar";
import AddressText from "../../../components/offer/AddressText";
import CurrencyIcon from "../../../components/price/CurrencyIcon";
import Settings from "../../../components/settings";
import Tabs from "../Tabs";

const BasicInfo = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EnsName = styled.div`
  font-size: 1.5rem;
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
  * {
    font-size: 1rem;
  }

  img {
    width: 15px;
    margin-right: 5px;
  }
`;

const SettingsWrapper = styled.div`
  display: flex;
  justify-content: end;
  flex-basis: 200px;
`;

export default function PrivateAccount({ account }: { account: string }) {
  const { data: ensName } = useEnsName({
    address: account
  });

  return (
    <>
      <BasicInfo>
        <Avatar address={account} size={200} />

        <EnsName>{ensName}</EnsName>

        <AddressContainer>
          <CurrencyIcon currencySymbol="ETH" />
          <AddressText address={account} />
        </AddressContainer>
        <SettingsWrapper>
          <Settings />
        </SettingsWrapper>
      </BasicInfo>
      <Tabs isPrivateProfile={true} address={account} />
    </>
  );
}

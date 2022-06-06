import { Image as AccountImage } from "@davatar/react";
import styled from "styled-components";
import { useAccount, useEnsName } from "wagmi";

import AddressText from "../../../components/offer/AddressText";
import CurrencyIcon from "../../../components/price/CurrencyIcon";
import { colors } from "../../../lib/styles/colors";
import Tabs from "../Tabs";
import Settings from "./Settings";

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
  position: relative;
  left: 30%;
`;

const AddressImageContainer = styled.div`
  border: 6px solid ${colors.cgBlue};
  border-radius: 50%;
  background-color: ${colors.cgBlue};
  margin-bottom: 5px;
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

const SettingsWrapper = styled.div`
  display: flex;
  justify-content: end;
  flex-basis: 200px;
`;

export default function PrivateAccount() {
  const { data: account, isLoading, isFetching, isError } = useAccount();
  const address = account?.address || "";
  const { data: ensName } = useEnsName({
    address: address
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  if (isError) {
    return <div>There has been an error...</div>;
  }

  if (!address) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <>
      <AddressWrapper>
        <AddressImageContainer>
          <AccountImage size={200} address={address} />
        </AddressImageContainer>
      </AddressWrapper>
      <BasicInfo>
        <EnsAndAddress>
          <EnsName>{ensName}</EnsName>

          <AddressContainer>
            <CurrencyIcon currencySymbol="ETH" />
            <AddressText address={address || ""} />
          </AddressContainer>
        </EnsAndAddress>
        <div></div>
        <div></div>
        <SettingsWrapper>
          <Settings />
        </SettingsWrapper>
      </BasicInfo>
      <Tabs isPrivateProfile={true} address={address} />
    </>
  );
}

import { useState } from "react";
import styled from "styled-components";
import { useEnsName } from "wagmi";

import Avatar from "../../../components/avatar";
import AddressText from "../../../components/offer/AddressText";
import CurrencyIcon from "../../../components/price/CurrencyIcon";
import Settings from "../../../components/settings";
import Tabs from "../Tabs";
import { SellerToggleContext } from "./Toogle/SellerToggleContext";
import Toggle from "./Toogle/Toogle";

const BasicInfo = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const EnsName = styled.div`
  font-size: 1.5rem;
`;

const AddressAndSettings = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 1rem;
  flex-basis: 50%;
  img {
    width: 15px;
    margin-right: 5px;
  }
`;

const SettingsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 25%;
`;

export default function PrivateAccount({ account }: { account: string }) {
  const { data: ensName } = useEnsName({
    address: account
  });
  const [isTabSellerSelected, setTabSellerSelected] = useState<boolean>(false);

  return (
    <>
      <BasicInfo>
        <Avatar address={account} size={200} />

        <EnsName>{ensName}</EnsName>
        <AddressAndSettings>
          <div style={{ flexBasis: "25%" }}></div>
          <AddressContainer>
            <CurrencyIcon currencySymbol="ETH" />
            <AddressText address={account} />
          </AddressContainer>
          <SettingsWrapper>
            <Settings />
          </SettingsWrapper>
        </AddressAndSettings>
      </BasicInfo>
      <SellerToggleContext.Provider value={{ isTabSellerSelected }}>
        <Tabs isPrivateProfile={true} address={account}>
          <Toggle
            isTabSellerSelected={isTabSellerSelected}
            setTabSellerSelected={setTabSellerSelected}
            $containerStyles={{
              paddingTop: 0,
              paddingBottom: "2rem"
            }}
            $toggleTabStyles={{
              width: "5.8125rem"
            }}
          />
        </Tabs>
      </SellerToggleContext.Provider>
    </>
  );
}

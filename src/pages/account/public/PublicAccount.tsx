import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEnsName } from "wagmi";

import Avatar from "../../../components/avatar";
// import { useAccount } from "wagmi";
import AddressText from "../../../components/offer/AddressText";
import CurrencyIcon from "../../../components/price/CurrencyIcon";
import { UrlParameters } from "../../../lib/routing/query-parameters";
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
  font-size: 1rem;

  img {
    width: 15px;
    margin-right: 5px;
  }
`;

export default function PublicAccount() {
  const { [UrlParameters.accountId]: accountParameter } = useParams();
  const address = accountParameter || "";
  const { data: ensName } = useEnsName({
    address: address
  });

  if (!address) {
    return <div>There has been an error</div>;
  }

  return (
    <>
      <BasicInfo>
        <Avatar address={address} size={200} />

        <EnsName>{ensName}</EnsName>

        <AddressContainer>
          <CurrencyIcon currencySymbol="ETH" />
          <AddressText address={address} />
        </AddressContainer>
      </BasicInfo>
      <Tabs isPrivateProfile={false} address={address} />
    </>
  );
}

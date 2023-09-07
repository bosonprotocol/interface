import { useConfigContext } from "components/config/ConfigContext";
import useENSName from "lib/utils/hooks/useENSName";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Avatar from "../../../components/avatar";
import AddressText from "../../../components/offer/AddressText";
import CurrencyIcon from "../../../components/price/CurrencyIcon";
import { UrlParameters } from "../../../lib/routing/parameters";
import Tabs from "../Tabs";

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

const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 1rem;

  img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`;

export default function PublicAccount() {
  const { [UrlParameters.accountId]: accountParameter } = useParams();
  const { config } = useConfigContext();
  const address = accountParameter || "";
  const { ENSName } = useENSName(address);

  if (!address) {
    return <div>There has been an error</div>;
  }

  return (
    <>
      <BasicInfo>
        <Avatar address={address} size={200} />

        <EnsName>{ENSName}</EnsName>

        <AddressContainer>
          <CurrencyIcon
            currencySymbol={config.envConfig.nativeCoin?.symbol || ""}
          />
          <AddressText address={address} />
        </AddressContainer>
      </BasicInfo>
      <Tabs isPrivateProfile={false} address={address} />
    </>
  );
}

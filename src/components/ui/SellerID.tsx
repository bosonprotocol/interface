import { OfferFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { Image as AccountImage } from "@davatar/react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import Grid, { IGrid } from "../../components/ui/Grid";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

const AddressContainer = styled(Grid)`
  gap: 10px;
  cursor: pointer;
  margin: 0;
`;

const SellerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  color: var(--secondary);
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;

const SellerID: React.FC<
  {
    children?: React.ReactNode;
    seller: OfferFieldsFragment["seller"];
  } & IGrid &
    React.HTMLAttributes<HTMLDivElement>
> = ({ seller, children, ...rest }) => {
  const navigate = useKeepQueryParamsNavigate();

  const sellerId = seller?.id;
  const sellerAddress = seller?.operator;

  return (
    <AddressContainer
      onClick={(e) => {
        e.stopPropagation();
        navigate({
          pathname: generatePath(BosonRoutes.Account, {
            [UrlParameters.accountId]: sellerAddress
          })
        });
      }}
      {...rest}
    >
      <SellerContainer>
        <div>
          <AccountImage size={17} address={sellerAddress} />
        </div>
        <SellerInfo data-testid="seller-id">Seller ID: {sellerId}</SellerInfo>
      </SellerContainer>
      {children || ""}
    </AddressContainer>
  );
};

export default SellerID;

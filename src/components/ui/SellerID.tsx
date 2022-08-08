// import image from '../../pages/offers/mock/bosonprotocol.png'
import { subgraph } from "@bosonprotocol/react-kit";
import { Image as AccountImage } from "@davatar/react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import Grid, { IGrid } from "../../components/ui/Grid";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { getOfferArtist } from "../../lib/utils/hooks/offers/placeholders";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import bosonProtocolImage from "../../pages/offers/mock/bosonprotocol.jpeg";

const AddressContainer = styled(Grid)`
  gap: 10px;
  margin: 0;
`;

const SellerContainer = styled.div`
  cursor: pointer;
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

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoundedImage = styled.img`
  height: 16px;
  width: 16px;
  border-radius: 50%;
`;

const SellerID: React.FC<
  {
    children?: React.ReactNode;
    seller: subgraph.OfferFieldsFragment["seller"];
    offerName: string;
    withProfileImage: boolean;
    customImage?: boolean;
  } & IGrid &
    React.HTMLAttributes<HTMLDivElement>
> = ({
  seller,
  children,
  offerName,
  withProfileImage,
  customImage,
  ...rest
}) => {
  const navigate = useKeepQueryParamsNavigate();

  const sellerId = seller?.id;
  const sellerAddress = seller?.operator;
  const artist = getOfferArtist(offerName);
  return (
    <AddressContainer {...rest}>
      <SellerContainer
        onClick={(e) => {
          e.stopPropagation();
          navigate({
            pathname: generatePath(BosonRoutes.Account, {
              [UrlParameters.accountId]: sellerAddress
            })
          });
        }}
      >
        {withProfileImage && (
          <ImageContainer>
            {artist.toLocaleLowerCase() === "boson protocol" || customImage ? (
              <RoundedImage src={sellerAddress || bosonProtocolImage} />
            ) : (
              <AccountImage size={17} address={sellerAddress} />
            )}
          </ImageContainer>
        )}
        <SellerInfo data-testid="seller-info">
          {artist ? artist : `Seller ID: ${sellerId}`}
        </SellerInfo>
      </SellerContainer>
      {children || ""}
    </AddressContainer>
  );
};

export default SellerID;

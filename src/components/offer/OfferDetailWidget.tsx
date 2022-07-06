import { AiOutlineCheck } from "react-icons/ai";
import styled from "styled-components";

import portalLogo from "../../assets/portal.svg";
import { ExternalRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import Price from "../price/index";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import OfferDetailTable from "./OfferDetailTable";

interface IOfferDetailWidget {
  offer: Offer;
}

const PortalLogoImg = styled.img`
  height: 16px;
`;
const Widget = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background: ${colors.white};
  > div {
    padding: 2rem;
    &:not(:first-of-type) {
      padding-top: 0;
    }
    &:not(:last-of-type) {
      padding-bottom: 0;
    }
  }
  > span + div {
    padding-top: 2rem !important;
  }

  box-shadow: 0px 4.318px 107.946px rgba(21, 30, 52, 0.1);
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.05), 0px 0px 16px rgba(0, 0, 0, 0.05),
    0px 0px 32px rgba(0, 0, 0, 0.05), 0px 0px 64px rgba(0, 0, 0, 0.05),
    0px 0px 128px rgba(0, 0, 0, 0.05);

  > div {
    width: 100%;
  }
`;

const Break = styled.span`
  width: 100%;
  height: 2px;
  background: ${colors.border};
`;

const OfferDetailWidget: React.FC<IOfferDetailWidget> = ({ offer }) => {
  console.log(offer);

  return (
    <Widget>
      <div>
        <Grid>
          <Price
            currencySymbol={offer.exchangeToken.symbol}
            value={offer.price}
            decimals={offer.exchangeToken.decimals}
            tag="h3"
            convert
          />
          <Typography tag="p" style={{ color: colors.orange }}>
            Only {offer.quantityAvailable} items left!
          </Typography>
        </Grid>
      </div>
      <div>
        <Grid flexGrow="1" gap="1rem">
          <Button fill theme="secondary" size="large" step={1}>
            Commit
          </Button>
          <Button fill theme="outline" size="large" step={2} disabled>
            Redeem
          </Button>
        </Grid>
      </div>
      <div>
        <Grid justifyContent="center">
          <LinkWithQuery to={ExternalRoutes.WhatIsRedeem}>
            <Typography
              tag="p"
              style={{ fontWeight: "600", color: colors.darkGrey }}
            >
              What is commit and redeem?
            </Typography>
          </LinkWithQuery>
        </Grid>
      </div>
      <Break />
      <div>
        <OfferDetailTable
          align
          data={[
            {
              name: "Redeemable",
              info: "test",
              value: (
                <Typography tag="p">
                  30<small>days</small>
                </Typography>
              )
            },
            {
              name: "Seller deposit",
              info: "test",
              value: (
                <Typography tag="p">
                  5%<small>($126.4)</small>
                </Typography>
              )
            },
            {
              name: "Buyer cancel. pen.",
              info: "test",
              value: (
                <Typography tag="p">
                  20%<small>($503.6)</small>
                </Typography>
              )
            },
            {
              name: "Fair exchange policy",
              info: "test",
              value: <AiOutlineCheck size={16} />
            },
            {
              name: "Dispute resolver",
              info: "test",
              value: <PortalLogoImg src={portalLogo} alt="Portal logo" />
            }
          ]}
        />
      </div>
    </Widget>
  );
};

export default OfferDetailWidget;

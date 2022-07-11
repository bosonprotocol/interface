import { CommitButton } from "@bosonprotocol/react-kit";
import { useMemo, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import styled from "styled-components";

import portalLogo from "../../assets/portal.svg";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { isOfferHot } from "../../lib/utils/getOfferLabel";
import Price from "../price/index";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import OfferDetailTable from "./OfferDetailTable";

interface IOfferDetailWidget {
  offer: Offer;
  handleModal: () => void;
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

const CommitAndRedeemButton = styled(Typography)`
  font-weight: 600;
  color: ${colors.darkGrey};
  cursor: pointer;
  transition: color 150ms ease-in-out;
  &:hover {
    color: ${colors.secondary};
  }
`;

const Break = styled.span`
  width: 100%;
  height: 2px;
  background: ${colors.border};
`;

const OfferDetailWidget: React.FC<IOfferDetailWidget> = ({
  offer,
  handleModal
}) => {
  const [quantity] = useState<number>(Number(offer?.quantityAvailable));
  const isHotOffer = useMemo(
    () => isOfferHot(offer?.quantityAvailable, offer?.quantityInitial),
    [offer?.quantityAvailable, offer?.quantityInitial]
  );

  return (
    <Widget>
      <div>
        <Grid style={{ paddingBottom: "1rem" }}>
          <Price
            address={offer.exchangeToken.address}
            currencySymbol={offer.exchangeToken.symbol}
            value={offer.price}
            decimals={offer.exchangeToken.decimals}
            tag="h3"
            convert
          />
          {isHotOffer && (
            <Typography tag="p" style={{ color: colors.orange, margin: 0 }}>
              {quantity === 0 && "No items available!"}
              {quantity > 0 &&
                `Only ${quantity} ${quantity === 1 ? "item" : "items"} left!`}
            </Typography>
          )}
        </Grid>
      </div>
      <div>
        <Grid flexGrow="1" gap="1rem">
          <CommitButton
            offerId={offer.id}
            chainId={CONFIG.chainId}
            onPendingTransactionConfirmation={() => null}
            onError={(args) => console.error("onError", args)}
            onPendingUserConfirmation={(args) =>
              console.log("onPendingUserConfirmation", args)
            }
            onSuccess={(args) => {
              //TODO: remove all these callbacks if they are not used
              console.log("onSuccess", args);
            }}
            extraInfo="Step 1"
          />
          <Button theme="outline" size="large" step={2} disabled>
            Redeem
          </Button>
        </Grid>
      </div>
      <div>
        <Grid justifyContent="center">
          <CommitAndRedeemButton tag="p" onClick={handleModal}>
            What is commit and redeem?
          </CommitAndRedeemButton>
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

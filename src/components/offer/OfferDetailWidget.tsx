import { Provider } from "@bosonprotocol/ethers-sdk";
import { CommitButton } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import styled from "styled-components";
import { useSigner } from "wagmi";

import portalLogo from "../../assets/portal.svg";
import { CONFIG } from "../../lib/config";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { isOfferHot } from "../../lib/utils/getOfferLabel";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Price from "../price/index";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
import OfferDetailCtaModal from "./OfferDetailCtaModal";
import OfferDetailTable from "./OfferDetailTable";

interface IOfferDetailWidget {
  offer: Offer;
  handleModal: () => void;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
}

const ImageWrapper = styled.div`
  > div {
    height: 100%;
    padding-top: 0;
  }
`;
const ModalGrid = styled.div`
  display: grid;

  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.s} {
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  margin-bottom: 2rem;
`;
const PortalLogoImg = styled.img`
  height: 16px;
`;
const ButtonWrapper = styled(Grid)`
  gap: 1rem;
  flex-direction: column;
  ${breakpoint.s} {
    flex-direction: row;
    align-content: flex-end;
    max-width: calc(50% - 2rem);
    margin-left: calc(50% + 2rem);
  }
  > * {
    flex: 1 0 auto;
    min-width: 100%;
    ${breakpoint.s} {
      min-width: initial;
    }
    > div {
      justify-content: center;
    }
  }
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

interface IModalData {
  isOpen: boolean;
  title?: string;
  type?: "SUCCESS" | "ERROR" | null;
  [x: string]: any;
}

const OFFER_DETAIL_DATA = [
  {
    name: "Redeemable",
    info: (
      <>
        <Typography tag="h6">
          <b>Redeemable</b>
        </Typography>
        <Typography tag="p" style={{ margin: "1rem 0" }}>
          Redeemable until 30 days after committing.
        </Typography>
        <Typography tag="p">
          If you don’t redeem your NFT during the redemption period, it will
          expire and you will receive back the price minus the Buyer cancel
          penalty
        </Typography>
      </>
    ),
    value: (
      <Typography tag="p">
        30<small>days</small>
      </Typography>
    )
  },
  {
    name: "Seller deposit",
    info: (
      <>
        <Typography tag="h6">
          <b>Seller deposit</b>
        </Typography>
        <Typography tag="p">
          The seller deposit is charged from the seller at “Commit” and is used
          to hold the seller accountable to follow through with their commitment
          to deliver the physical item. If the seller breaks their commitment,
          then their deposit will be transferred to the buyer
        </Typography>
      </>
    ),
    value: (
      <Typography tag="p">
        5%<small>($126.4)</small>
      </Typography>
    )
  },
  {
    name: "Buyer cancel. pen.",
    info: (
      <>
        <Typography tag="h6">
          <b>Buyer Cancelation penalty</b>
        </Typography>
        <Typography tag="p">
          If you fail to redeem your rNFT in time, you will receive back the
          price minus the buyer cancellation penalty.
        </Typography>
      </>
    ),
    value: (
      <Typography tag="p">
        20%<small>($503.6)</small>
      </Typography>
    )
  },
  {
    name: "Fair exchange policy",
    info: (
      <>
        <Typography tag="h6">
          <b>Exchange policy</b>
        </Typography>
        <Typography tag="p">
          30 days to raise a dispute Fair buyer and seller obligations Standard
          evidence requirements 15 days to resolve a raised dispute
        </Typography>
      </>
    ),
    value: <AiOutlineCheck size={16} />
  },
  {
    name: "Dispute resolver",
    info: (
      <>
        <Typography tag="h6">
          <b>Dispute resolver</b>
        </Typography>
        <Typography tag="p" style={{ margin: "1rem 0" }}>
          PORTAL (A company) is the Dispute Resolver for this exchange.
        </Typography>
        <Typography tag="p">
          The Dispute resolver will resolve disputes between buyer and seller
          that may arise.
        </Typography>
      </>
    ),
    value: <PortalLogoImg src={portalLogo} alt="Portal logo" />
  }
];

const OfferDetailWidget: React.FC<IOfferDetailWidget> = ({
  offer,
  handleModal,
  name = "",
  image = "",
  hasSellerEnoughFunds
}) => {
  const { data: signer } = useSigner();
  const navigate = useKeepQueryParamsNavigate();
  const [modalData, setModalData] = useState<IModalData>({ isOpen: false });

  const handleClose = () => {
    setModalData({ isOpen: false });
  };

  const quantity = useMemo<number>(
    () => Number(offer?.quantityAvailable),
    [offer?.quantityAvailable]
  );
  const isExpiredOffer = useMemo<boolean>(
    () => dayjs(Number(offer?.validUntilDate) * 1000).isBefore(dayjs()),
    [offer?.validUntilDate]
  );
  const isHotOffer = useMemo(
    () => isOfferHot(offer?.quantityAvailable, offer?.quantityInitial),
    [offer?.quantityAvailable, offer?.quantityInitial]
  );

  return (
    <>
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
              disabled={!hasSellerEnoughFunds || isExpiredOffer}
              offerId={offer.id}
              chainId={CONFIG.chainId}
              // TODO: handle loading on react-kit
              // loading={isLoading}
              onPendingTransaction={() => null}
              onError={(args) => {
                console.error("onError", args);
                setModalData({
                  isOpen: true,
                  title: "An error occurred",
                  type: "ERROR"
                });
              }}
              onPendingSignature={() => {
                console.log("onPendingSignature");
              }}
              onSuccess={(args) => {
                console.log("onSuccess", args);
                setModalData({
                  isOpen: true,
                  title: "You have successfully committed!",
                  type: "SUCCESS"
                });
              }}
              extraInfo="Step 1"
              web3Provider={signer?.provider as Provider}
            />
            <Button
              theme="outline"
              step={2}
              disabled
              style={{
                padding: "0.975rem 2rem",
                fontSize: "1rem"
              }}
            >
              Redeem
            </Button>
          </Grid>
        </div>
        <div>
          <Grid justifyContent="center">
            <CommitAndRedeemButton
              tag="p"
              onClick={handleModal}
              style={{ fontSize: "0.875rem" }}
            >
              What is commit and redeem?
            </CommitAndRedeemButton>
          </Grid>
        </div>
        <Break />
        <div>
          <OfferDetailTable align noBorder data={OFFER_DETAIL_DATA} />
        </div>
      </Widget>
      <OfferDetailCtaModal onClose={handleClose} {...modalData}>
        <ModalGrid>
          <ImageWrapper>
            <Image src={image} dataTestId="offerImage" />
          </ImageWrapper>
          <div>
            <Widget>
              <Grid flexDirection="column">
                {modalData.type === "SUCCESS" && (
                  <Typography tag="p" style={{ margin: 0 }}>
                    <b>You now own the rNFT</b>
                  </Typography>
                )}
                {modalData.type === "ERROR" && (
                  <Typography tag="p" style={{ margin: 0, color: colors.red }}>
                    <b>An error occurred when trying to commit to an item</b>
                  </Typography>
                )}
                <Typography
                  tag="h2"
                  style={{ margin: "1rem 0", color: colors.secondary }}
                >
                  {name}
                </Typography>
              </Grid>
              <Break />
              <div>
                <OfferDetailTable align noBorder data={OFFER_DETAIL_DATA} />
              </div>
            </Widget>
          </div>
        </ModalGrid>
        <ButtonWrapper>
          <Button
            theme="secondary"
            onClick={() => {
              navigate({ pathname: BosonRoutes.YourAccount });
            }}
          >
            View my items
          </Button>
          <Button
            theme="primary"
            onClick={() => {
              navigate({ pathname: BosonRoutes.Explore });
            }}
          >
            Discover more
          </Button>
        </ButtonWrapper>
      </OfferDetailCtaModal>
    </>
  );
};

export default OfferDetailWidget;

import { Provider } from "@bosonprotocol/ethers-sdk";
import { CommitButton, RedeemButton } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { HiOutlineExternalLink } from "react-icons/hi";
import styled from "styled-components";
import { useSigner } from "wagmi";

import portalLogo from "../../assets/portal.svg";
import { CONFIG } from "../../lib/config";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { IPrice } from "../../lib/utils/convertPrice";
import { isOfferHot } from "../../lib/utils/getOfferLabel";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { Modal } from "../modal/Modal";
import Price from "../price/index";
import { useConvertedPrice } from "../price/useConvertedPrice";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
import OfferDetailTable from "./OfferDetailTable";

interface IOfferDetailWidget {
  offer: Offer;
  handleModal: () => void;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
}

const CtaButtonsWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;
    letter-spacing: 0.5px;
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 1rem;
    font-weight: 500;
    line-height: 24px;
    white-space: pre;
    span > span {
      font-size: 65%;
      font-weight: 400;
      margin: 0 0.5rem;
      opacity: 0.75;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  display: block;

  > div {
    all: unset;
  }
  img {
    all: unset;
    width: 100%;
  }

  ${breakpoint.xs} {
    width: 60%;
    margin: 0 auto;
    display: block;
  }
  ${breakpoint.s} {
    width: unset;
    margin: 0;
    display: initial;
  }

  > div {
    ${breakpoint.s} {
      height: 100%;
      padding-top: 0;
    }
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
  margin-top: 2.5rem;
  flex-direction: column;
  ${breakpoint.s} {
    flex-direction: row;
    align-content: space-between;
  }
  > * {
    width: 100%;
    ${breakpoint.s} {
      width: unset;
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

const OpenSeaButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.OfferStatus};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  border: 2px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.blue};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  &:hover {
    color: ${colors.black};
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
}

const oneSecondToDays = 86400;
const getDayOrDays = (value: number) => (value === 1 ? "day" : "days");

const getOfferDetailData = (offer: Offer, priceInDollars: IPrice | null) => {
  const redeemableDays = Math.round(
    Number(offer.voucherValidDuration) / oneSecondToDays
  );

  const resolutionPeriodDurationDays = Math.round(
    Number(offer.resolutionPeriodDuration) / oneSecondToDays
  );
  const fulfillmentPeriodDurationDays = Math.round(
    Number(offer.fulfillmentPeriodDuration) / oneSecondToDays
  );

  const priceInDollarsNumber = Number(priceInDollars?.converted);

  const sellerDepositPercentage =
    Number(offer.sellerDeposit) / Number(offer.price);
  const sellerDeposit = sellerDepositPercentage * 100;
  const sellerDepositDollars = (
    sellerDepositPercentage * priceInDollarsNumber
  ).toFixed(2);

  const buyerCancelationPenaltyPercentage =
    Number(offer.buyerCancelPenalty) / Number(offer.price);
  const buyerCancelationPenalty = buyerCancelationPenaltyPercentage * 100;
  const buyerCancelationPenaltyDollars = (
    buyerCancelationPenaltyPercentage * priceInDollarsNumber
  ).toFixed(2);
  return [
    {
      name: "Redeemable",
      info: (
        <>
          <Typography tag="h6">
            <b>Redeemable</b>
          </Typography>
          <Typography tag="p" style={{ margin: "1rem 0" }}>
            Redeemable until {redeemableDays} {getDayOrDays(redeemableDays)}{" "}
            after committing.
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
          {redeemableDays}
          <small>{getDayOrDays(redeemableDays)}</small>
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
            The seller deposit is charged from the seller at “Commit” and is
            used to hold the seller accountable to follow through with their
            commitment to deliver the physical item. If the seller breaks their
            commitment, then their deposit will be transferred to the buyer
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {sellerDeposit}%<small>(${sellerDepositDollars})</small>
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
          {buyerCancelationPenalty}%
          <small>(${buyerCancelationPenaltyDollars})</small>
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
            {fulfillmentPeriodDurationDays}{" "}
            {getDayOrDays(fulfillmentPeriodDurationDays)} to raise a dispute
          </Typography>
          <Typography tag="p">Fair buyer and seller obligations</Typography>
          <Typography tag="p">Standard evidence requirements</Typography>
          <Typography tag="p">
            {resolutionPeriodDurationDays}{" "}
            {getDayOrDays(resolutionPeriodDurationDays)} to resolve a raised
            dispute
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
};

const OfferDetailWidget: React.FC<IOfferDetailWidget> = ({
  offer,
  handleModal,
  name = "",
  image = "",
  hasSellerEnoughFunds
}) => {
  const { data: signer } = useSigner();
  const navigate = useKeepQueryParamsNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IModalData>({ isOpen: false });

  const handleClose = () => {
    setModalData({ isOpen: false });
  };
  const priceInDollars = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals
  });
  const OFFER_DETAIL_DATA = useMemo(
    () => getOfferDetailData(offer, priceInDollars),
    [offer, priceInDollars]
  );
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
        <CtaButtonsWrapper>
          <Grid
            flex="1 1 0"
            rowGap="1rem"
            columnGap="0.5rem"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <CommitButton
              disabled={
                !hasSellerEnoughFunds ||
                isExpiredOffer ||
                isLoading ||
                !quantity
              }
              offerId={offer.id}
              chainId={CONFIG.chainId}
              onError={(args) => {
                console.error("onError", args);
                setIsLoading(false);
                setModalData({
                  isOpen: true,
                  title: "An error occurred",
                  type: "ERROR"
                });
              }}
              onPendingSignature={() => {
                console.log("onPendingSignature");
                setIsLoading(true);
              }}
              onSuccess={(receipt, { exchangeId }) => {
                console.log("onSuccess", receipt, { exchangeId });
                setIsLoading(false);
                setModalData({
                  isOpen: true,
                  title: "You have successfully committed!",
                  type: "SUCCESS"
                });
              }}
              extraInfo="Step 1"
              web3Provider={signer?.provider as Provider}
            />
            <RedeemButton
              exchangeId={""}
              chainId={CONFIG.chainId}
              disabled
              extraInfo="Step 2"
            />
          </Grid>
        </CtaButtonsWrapper>
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
      <Modal
        onClose={handleClose}
        {...modalData}
        title={
          <Typography tag="h3">
            <b>{modalData.title}</b>
          </Typography>
        }
      >
        <ModalGrid>
          <ImageWrapper>
            {modalData.type === "SUCCESS" && (
              <OpenSeaButton>
                View on OpenSea
                <HiOutlineExternalLink size={18} />
              </OpenSeaButton>
            )}
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
                    <b>An error occurred when trying to commit to this item</b>
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
          </div>
        </ModalGrid>
      </Modal>
    </>
  );
};

export default OfferDetailWidget;

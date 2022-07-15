import { exchanges } from "@bosonprotocol/core-sdk";
import {
  ExchangeFieldsFragment,
  ExchangeState
} from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { Provider } from "@bosonprotocol/ethers-sdk";
import {
  CancelButton,
  CommitButton,
  RedeemButton
} from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useSigner } from "wagmi";

import portalLogo from "../../assets/portal.svg";
import { CONFIG } from "../../lib/config";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { IPrice } from "../../lib/utils/convertPrice";
import { titleCase } from "../../lib/utils/formatText";
import { isOfferHot } from "../../lib/utils/getOfferLabel";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { Modal } from "../modal/Modal";
import Price from "../price/index";
import { useConvertedPrice } from "../price/useConvertedPrice";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Image from "../ui/Image";
import Typography from "../ui/Typography";
import {
  Break,
  CommitAndRedeemButton,
  ModalGrid,
  OpenSeaButton,
  PortalLogoImg,
  RaiseProblemButton,
  RedeemLeftButton,
  Widget,
  WidgetButtonWrapper,
  WidgetImageWrapper,
  WidgetUpperGrid
} from "./Detail.style";
import DetailTable from "./DetailTable";

interface IDetailWidget {
  pageType?: "exchange" | "offer";
  offer: Offer;
  exchange?: NonNullable<Offer["exchanges"]>[number];
  handleModal: () => void;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
}
interface IModalData {
  isOpen: boolean;
  title?: string;
  type?: "SUCCESS" | "ERROR" | null;
  message?: string;
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

const DetailWidget: React.FC<IDetailWidget> = ({
  pageType,
  offer,
  exchange,
  handleModal,
  name = "",
  image = "",
  hasSellerEnoughFunds
}) => {
  const { isLteXS } = useBreakpoints();
  const cancelRef = useRef<HTMLDivElement | null>(null);

  const isOffer = pageType === "offer";
  const isExchange = pageType === "exchange";
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as ExchangeFieldsFragment)
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === ExchangeState.Committed;

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
  const redeemableDays = Math.round(
    Number(offer.voucherValidDuration) / oneSecondToDays
  );

  const handleCancel = () => {
    // TODO: it's just a workaround for now
    const child = cancelRef.current!.children[0];
    if (child) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      child.click();
    }
  };

  return (
    <>
      <Widget>
        {isExchange && (
          <RedeemLeftButton>
            {redeemableDays} days left to Redeem
          </RedeemLeftButton>
        )}
        <div>
          <WidgetUpperGrid style={{ paddingBottom: "0.5rem" }}>
            <Price
              address={offer.exchangeToken.address}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
              tag="h3"
              convert
            />
            {isOffer && (
              <Typography tag="p" style={{ color: colors.orange, margin: 0 }}>
                {isHotOffer && (
                  <>
                    {quantity === 0 && "No items available!"}
                    {quantity > 0 &&
                      `Only ${quantity} ${
                        quantity === 1 ? "item" : "items"
                      } left!`}
                  </>
                )}
              </Typography>
            )}
            {isOffer && (
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
                    message: "An error occurred when trying to commit!",
                    type: "ERROR"
                  });
                }}
                onPendingSignature={() => {
                  console.log("onPendingSignature");
                  setIsLoading(true);
                }}
                onSuccess={(args) => {
                  console.log("onSuccess", args);
                  setIsLoading(false);
                  setModalData({
                    isOpen: true,
                    title: "You have successfully committed!",
                    message: "You now own the rNFT",
                    type: "SUCCESS"
                  });
                }}
                extraInfo="Step 1"
                web3Provider={signer?.provider as Provider}
              />
            )}
            {isToRedeem && (
              <RedeemButton
                disabled={isLoading || isOffer}
                exchangeId={exchange?.id || offer.id}
                chainId={CONFIG.chainId}
                onError={(args) => {
                  console.error("onError", args);
                  setIsLoading(false);
                  setModalData({
                    isOpen: true,
                    title: "An error occurred",
                    message: "An error occurred when trying to redeem!",
                    type: "ERROR"
                  });
                }}
                onPendingSignature={() => {
                  console.log("onPendingSignature");
                  setIsLoading(true);
                }}
                onSuccess={(args) => {
                  console.log("onSuccess", args);
                  setIsLoading(false);
                  setModalData({
                    isOpen: true,
                    title: "You have successfully redeemed!",
                    message: "You have successfully redeemed!",
                    type: "SUCCESS"
                  });
                }}
                extraInfo="Step 2"
                web3Provider={signer?.provider as Provider}
              />
            )}
            {!isToRedeem && (
              <Button theme="outline" disabled>
                {titleCase(exchangeStatus)}
                <BiCheck size={24} />
              </Button>
            )}
          </WidgetUpperGrid>
        </div>
        <Grid
          justifyContent="center"
          style={
            !isOffer && !isLteXS
              ? {
                  maxWidth: "50%",
                  marginLeft: "calc(50% - 0.5rem)"
                }
              : {}
          }
        >
          <CommitAndRedeemButton
            tag="p"
            onClick={handleModal}
            style={{ fontSize: "0.875rem", marginTop: 0 }}
          >
            {isOffer ? "What is commit and redeem?" : "What is redeem?"}
          </CommitAndRedeemButton>
        </Grid>
        <Break />
        <div>
          <DetailTable align noBorder data={OFFER_DETAIL_DATA} />
        </div>
        {isExchange && (
          <>
            <Break />
            <RaiseProblemButton
              tag="p"
              onClick={handleCancel}
              style={{ fontSize: "0.875rem" }}
            >
              Raise a problem
              <BsQuestionCircle size={18} />
            </RaiseProblemButton>
          </>
        )}
      </Widget>

      {isExchange && (
        <div
          style={{ opacity: 0 }}
          ref={(ref) => {
            cancelRef.current = ref;
          }}
        >
          <CancelButton
            disabled={isLoading}
            exchangeId={exchange?.id || offer.id}
            chainId={CONFIG.chainId}
            onError={(args) => {
              console.error("onError", args);
              setIsLoading(false);
              setModalData({
                isOpen: true,
                title: "An error occurred",
                message: "An error occurred when trying to cancel!",
                type: "ERROR"
              });
            }}
            onPendingSignature={() => {
              console.log("onPendingSignature");
              setIsLoading(true);
            }}
            onSuccess={(args) => {
              console.log("onSuccess", args);
              setIsLoading(false);
              setModalData({
                isOpen: true,
                title: "You have successfully cancelled!",
                message: "You have successfully cancelled!",
                type: "SUCCESS"
              });
            }}
            web3Provider={signer?.provider as Provider}
          />
        </div>
      )}
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
          <WidgetImageWrapper>
            {modalData.type === "SUCCESS" && (
              <OpenSeaButton>
                View on OpenSea
                <HiOutlineExternalLink size={18} />
              </OpenSeaButton>
            )}
            <Image src={image} dataTestId="offerImage" />
          </WidgetImageWrapper>
          <div>
            <Widget>
              <Grid flexDirection="column">
                <Typography
                  tag="p"
                  style={{
                    margin: 0,
                    color:
                      modalData.type === "ERROR" ? colors.red : colors.black
                  }}
                >
                  <b>{modalData.message}</b>
                </Typography>
                <Typography
                  tag="h2"
                  style={{ margin: "1rem 0", color: colors.secondary }}
                >
                  {name}
                </Typography>
              </Grid>
              <Break />
              <div>
                <DetailTable align noBorder data={OFFER_DETAIL_DATA} />
              </div>
            </Widget>
            <WidgetButtonWrapper>
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
            </WidgetButtonWrapper>
          </div>
        </ModalGrid>
      </Modal>
    </>
  );
};

export default DetailWidget;

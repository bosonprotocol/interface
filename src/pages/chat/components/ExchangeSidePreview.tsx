import {
  MessageData,
  ThreadId
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { offers, subgraph } from "@bosonprotocol/react-kit";
import { includingBuyerSellerAgreement } from "lib/constants/policies";
import { getExchangePolicyName } from "lib/utils/policy/getExchangePolicyName";
import { ArrowSquareOut } from "phosphor-react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo
} from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";

import DetailTable from "../../../components/detail/DetailTable";
import { DetailDisputeResolver } from "../../../components/detail/DetailWidget/DetailDisputeResolver";
import {
  ModalTypes,
  ShowModalFn,
  useModal
} from "../../../components/modal/useModal";
import Price from "../../../components/price";
import MultiSteps from "../../../components/step/MultiSteps";
import Button from "../../../components/ui/Button";
import Image from "../../../components/ui/Image";
import Typography from "../../../components/ui/Typography";
import Video from "../../../components/ui/Video";
import { ViewModeLink } from "../../../components/viewMode/ViewMode";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { Offer } from "../../../lib/types/offer";
import { calcPercentage } from "../../../lib/utils/calcPrice";
import {
  getExchangeDisputeDates,
  getHasExchangeDisputeResolutionElapsed,
  isExchangeCompletableByBuyer,
  isExchangeCompletableBySeller
} from "../../../lib/utils/exchange";
import { useDisputes } from "../../../lib/utils/hooks/useDisputes";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useSellerRoles } from "../../../lib/utils/hooks/useSellerRoles";
import { ViewMode } from "../../../lib/viewMode";
import { MessageDataWithInfo } from "../types";
import ExchangeTimeline from "./ExchangeTimeline";
import ProgressBar from "./ProgressBar";

const Container = styled.div<{ $disputeOpen: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  min-width: max-content;
  position: absolute;
  margin-top: 6rem;
  z-index: ${zIndex.ExchangeSidePreview};
  right: ${({ $disputeOpen }) => ($disputeOpen ? "0" : "-160vw")};
  transition: 400ms;
  width: ${({ $disputeOpen }) => $disputeOpen && "100vw"};
  background: ${colors.lightGrey};
  ${breakpoint.m} {
    padding-top: 0;
    width: 100%;
    min-width: 60%;
  }
  ${breakpoint.l} {
    position: relative;
    background: transparent;
    right: unset;
    margin-top: 0;
    flex-basis: 39rem;
    min-width: unset;
  }
`;

const StyledImage = styled(Image)`
  cursor: pointer;
  padding-top: 50%;

  [data-image-placeholder] {
    position: initial;
  }

  img[data-testid="exchange-image"] {
    max-height: 400px;
    max-width: 400px;
    object-fit: contain;

    ${breakpoint.l} {
      max-height: unset;
      max-width: unset;
      object-fit: cover;
    }
  }

  ${breakpoint.l} {
    padding-top: 120%;
  }
`;

const sectionStyles = css`
  border: 2px solid ${colors.border};
  border-top: none;
  padding: 1.625rem;
  ${breakpoint.l} {
    background: ${colors.white};
  }
  background: ${colors.lightGrey};
`;
const Section = styled.div`
  ${sectionStyles};
`;

const ExchangeInfo = styled(Section)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 0.875rem;
  small {
    font-size: 1rem;
    font-weight: 400;
  }
`;

const StyledPrice = styled(Price)`
  h3 {
    display: flex;
    align-items: center;

    svg {
      all: unset;
    }
  }
  small {
    position: relative;
    bottom: 0.3125rem;
  }
`;

const Name = styled(Typography)`
  all: unset;
  font-size: 1.5rem;
  font-weight: 600;
`;

const StyledMultiSteps = styled(MultiSteps)`
  align-items: flex-start;
  gap: 0;
  p {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }
  ${breakpoint.m} {
    padding-left: 6.25rem;
    padding-right: 6.25rem;
  }
  ${breakpoint.l} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const CTASection = styled(Section)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  > * {
    flex: 1;
  }
`;

const HistorySection = styled(Section)`
  height: 100%;
  border-bottom: none;

  && {
    padding-bottom: 5rem;
  }
`;
const fontSizeExchangePolicy = "0.625rem";
const getOfferDetailData = (
  offer: Offer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalTypes: ModalTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showModal: ShowModalFn,
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult
) => {
  const { deposit, formatted } = calcPercentage(offer, "sellerDeposit");

  const exchangePolicyLabel = getExchangePolicyName(
    (offer.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy?.label
  );

  const handleShowExchangePolicy = () => {
    showModal(modalTypes.EXCHANGE_POLICY_DETAILS, {
      title: "Exchange Policy Details",
      offerId: offer.id,
      offerData: offer,
      exchangePolicyCheckResult
    });
  };

  return [
    {
      name: "Seller deposit",
      info: (
        <>
          <Typography tag="h6">
            <b>Seller deposit</b>
          </Typography>
          <Typography tag="p">
            The Seller deposit is used to hold the seller accountable to follow
            through with their commitment to deliver the physical item. If the
            seller breaks their commitment, the deposit will be transferred to
            the buyer.
          </Typography>
        </>
      ),
      value: (
        <Typography
          tag="p"
          style={{
            wordBreak: "break-word",
            whiteSpace: "break-spaces"
          }}
        >
          {formatted} {offer.exchangeToken.symbol}
          <small>({deposit}%)</small>
        </Typography>
      )
    },
    {
      name: "Exchange policy",
      info: (
        <>
          <Typography tag="h6">
            <b>Exchange policy</b>
          </Typography>
          <Typography tag="p">
            The Exchange policy ensures that the terms of sale are set in a fair
            way to protect both buyers and sellers.
          </Typography>
        </>
      ),
      value: exchangePolicyCheckResult ? (
        exchangePolicyCheckResult.isValid ? (
          <Typography tag="p">
            <span style={{ fontSize: fontSizeExchangePolicy }}>
              {exchangePolicyLabel + " " + includingBuyerSellerAgreement}
            </span>
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer", minWidth: "20px" }}
            />
          </Typography>
        ) : (
          <Typography
            tag="p"
            color={colors.orange}
            $fontSize={fontSizeExchangePolicy}
          >
            Non-standard
            {` ${includingBuyerSellerAgreement}`}
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer", minWidth: "20px" }}
            />
          </Typography>
        )
      ) : (
        <Typography tag="p" color="purple" $fontSize={fontSizeExchangePolicy}>
          Unknown
          {` ${includingBuyerSellerAgreement}`}
          <ArrowSquareOut
            size={20}
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer", minWidth: "20px" }}
          />
        </Typography>
      )
    },
    {
      name: DetailDisputeResolver.name,
      info: DetailDisputeResolver.info,
      value: <DetailDisputeResolver.value />
    }
  ];
};
const ExchangeMedia = ({
  exchange,
  children
}: {
  exchange: Exchange | undefined;
  children: ReactNode;
}) => (
  <>
    {exchange ? (
      <ViewModeLink
        destinationViewMode={ViewMode.DAPP}
        href={
          generatePath(BosonRoutes.Exchange, {
            [UrlParameters.exchangeId]: exchange.id
          }) as `/${string}`
        }
      >
        {children}
      </ViewModeLink>
    ) : (
      <></>
    )}
  </>
);
const ExchangeImage = ({ exchange }: { exchange: Exchange | undefined }) => (
  <ExchangeMedia exchange={exchange}>
    <StyledImage
      src={exchange?.offer.metadata.imageUrl ?? ""}
      alt="exchange image"
      dataTestId="exchange-image"
    />
  </ExchangeMedia>
);
interface Props {
  exchange: Exchange | undefined;
  disputeOpen: boolean;
  iAmTheBuyer: boolean;
  iAmTheSeller: boolean;
  refetchExchanges: () => void;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
  setHasError: Dispatch<SetStateAction<boolean>>;
  addMessage: (
    newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
  ) => Promise<void>;
  onSentMessage: (messageData: MessageData, uuid: string) => Promise<void>;
  destinationAddress: string;
  threadId: ThreadId | null;
  lastReceivedProposal: MessageData | null;
  lastSentProposal: MessageData | null;
}
export default function ExchangeSidePreview({
  exchange,
  disputeOpen,
  iAmTheBuyer,
  exchangePolicyCheckResult,
  iAmTheSeller,
  refetchExchanges,
  addMessage,
  setHasError,
  threadId,
  onSentMessage,
  destinationAddress,
  lastReceivedProposal,
  lastSentProposal
}: Props) {
  const { data: disputes, refetch: refetchDisputes } = useDisputes(
    {
      disputesFilter: {
        exchange: exchange?.id
      }
    },
    { enabled: !!exchange }
  );
  const dispute = disputes?.[0];
  const offer = exchange?.offer;
  const { showModal, modalTypes } = useModal();
  const OFFER_DETAIL_DATA = useMemo(
    () =>
      offer &&
      getOfferDetailData(
        offer,
        modalTypes,
        showModal,
        exchangePolicyCheckResult
      ),
    [offer, modalTypes, showModal, exchangePolicyCheckResult]
  );

  const refetchItAll = useCallback(() => {
    refetchExchanges();
    refetchDisputes();
  }, [refetchExchanges, refetchDisputes]);

  const sellerRoles = useSellerRoles(iAmTheBuyer ? "" : offer?.seller.id || "");
  const isVisible = exchange
    ? iAmTheBuyer
      ? isExchangeCompletableByBuyer(exchange)
      : isExchangeCompletableBySeller(exchange)
    : false;
  const CompleteExchangeButton = useCallback(() => {
    if (!isVisible) {
      return null;
    }
    const isDisabled = iAmTheBuyer ? false : sellerRoles.isAssistant;
    return (
      <Button
        theme="secondary"
        disabled={isDisabled}
        onClick={() =>
          showModal(
            "COMPLETE_EXCHANGE",
            {
              title: "Complete Confirmation",
              exchange: exchange,
              refetch: refetchItAll
            },
            "xs"
          )
        }
      >
        Complete exchange
      </Button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange, iAmTheBuyer, sellerRoles.isAssistant, isVisible]);
  if (!exchange || !offer) {
    return null;
  }
  const isInRedeemed = subgraph.ExchangeState.Redeemed === exchange.state;
  const isInDispute = exchange.disputed && !dispute?.finalizedDate;
  const isResolved = !!dispute?.resolvedDate;
  const isEscalated = !!dispute?.escalatedDate;
  const isRetracted = !!dispute?.retractedDate;
  const isFinalized = !!dispute?.finalizedDate;

  const { totalDaysToResolveDispute, daysLeftToResolveDispute } =
    getExchangeDisputeDates(exchange);

  const hasDisputePeriodElapsed: boolean =
    getHasExchangeDisputeResolutionElapsed(exchange, offer);
  const animationUrl = exchange?.offer.metadata.animationUrl || "";
  return (
    <Container $disputeOpen={disputeOpen}>
      {animationUrl ? (
        <ExchangeMedia exchange={exchange}>
          <Video
            src={animationUrl}
            dataTestId="exchangeAnimationUrl"
            videoProps={{
              muted: true,
              loop: true,
              autoPlay: true
            }}
            componentWhileLoading={() => <ExchangeImage exchange={exchange} />}
          />
        </ExchangeMedia>
      ) : (
        <ExchangeImage exchange={exchange} />
      )}

      <ExchangeInfo>
        <Name tag="h3">{exchange.offer.metadata.name}</Name>
        <StyledPrice
          isExchange={false}
          currencySymbol={offer.exchangeToken.symbol}
          value={offer.price}
          decimals={offer.exchangeToken.decimals}
          tag="h3"
          convert
        />
      </ExchangeInfo>

      {(isInDispute || isResolved || isEscalated) && (
        <Section>
          {isInDispute &&
            !isResolved &&
            !isEscalated &&
            !!totalDaysToResolveDispute && (
              <div style={{ marginBottom: "1rem" }}>
                <ProgressBar
                  threshold={50}
                  progress={
                    (100 * daysLeftToResolveDispute) / totalDaysToResolveDispute
                  }
                  text={`${daysLeftToResolveDispute} out of ${totalDaysToResolveDispute} days left to mutually resolve the dispute or for the buyer to escalate`}
                />
              </div>
            )}
          {
            // if both buyer and seller, then show seller
          }
          {!iAmTheBuyer ? (
            <StyledMultiSteps
              data={[
                { name: "Review proposal", steps: 1 },
                { name: "Accept or counterpropose", steps: 1 },
                { name: "Resolve the dispute", steps: 1 }
              ]}
              active={isInDispute && !isEscalated ? 1 : 3}
              hideArrows
            />
          ) : (
            <StyledMultiSteps
              data={[
                { name: "Submit dispute", steps: 1 },
                { name: "Discuss details (optional)", steps: 1 },
                { name: "Resolve or escalate", steps: 1 }
              ]}
              active={isInDispute && !isEscalated ? 2 : 3}
              hideArrows
            />
          )}
        </Section>
      )}
      <Section>
        <DetailTable align noBorder data={OFFER_DETAIL_DATA ?? ({} as never)} />
      </Section>
      {isInDispute && iAmTheBuyer && !isEscalated && !isRetracted ? (
        <CTASection>
          <Button
            theme="secondary"
            onClick={() =>
              showModal(
                "RETRACT_DISPUTE",
                {
                  title: "Retract",
                  exchangeId: exchange.id,
                  offerName: offer.metadata.name,
                  refetch: refetchItAll,
                  disputeId: exchange.dispute?.id ?? "",
                  addMessage,
                  setHasError,
                  threadId,
                  onSentMessage,
                  destinationAddress,
                  exchange
                },
                "auto",
                undefined,
                { m: "700px" }
              )
            }
          >
            Retract
          </Button>
          <Button
            theme="secondary"
            onClick={() =>
              showModal(
                "ESCALATE_MODAL",
                {
                  title: "Escalate",
                  exchange: exchange,
                  refetch: refetchItAll,
                  addMessage,
                  setHasError,
                  onSentMessage,
                  destinationAddress
                },
                "l"
              )
            }
          >
            Escalate
          </Button>
          <CompleteExchangeButton />
        </CTASection>
      ) : isInRedeemed && iAmTheBuyer ? (
        <CTASection>
          <Button
            theme="secondary"
            disabled={hasDisputePeriodElapsed}
            onClick={() =>
              showModal(
                "RAISE_DISPUTE",
                {
                  title: "Raise a dispute",
                  exchangeId: exchange.id
                },
                "auto",
                undefined,
                {
                  xs: "80%",
                  s: "50%",
                  m: "1000px"
                }
              )
            }
          >
            Raise a dispute
          </Button>
          <CompleteExchangeButton />
        </CTASection>
      ) : isVisible ? (
        <CTASection>
          <CompleteExchangeButton />
        </CTASection>
      ) : isFinalized && threadId ? (
        <CTASection>
          {iAmTheBuyer && (
            <Button
              theme="secondary"
              onClick={() => {
                showModal(
                  "MANAGE_FUNDS_MODAL",
                  {
                    title: "Manage Funds",
                    id: threadId?.buyerId
                  },
                  "auto",
                  "dark"
                );
              }}
            >
              Withdraw {iAmTheSeller ? "buyer" : ""} funds
            </Button>
          )}
          {iAmTheSeller && (
            <Button
              theme="secondary"
              onClick={() => {
                showModal(
                  "MANAGE_FUNDS_MODAL",
                  {
                    title: "Manage Funds",
                    id: threadId?.sellerId
                  },
                  "auto",
                  "dark"
                );
              }}
            >
              Withdraw {iAmTheBuyer ? "seller" : ""} funds
            </Button>
          )}
        </CTASection>
      ) : null}
      <HistorySection>
        <ExchangeTimeline
          exchange={exchange}
          showDispute={true}
          lastReceivedProposal={lastReceivedProposal}
          lastSentProposal={lastSentProposal}
        >
          <h4>History</h4>
        </ExchangeTimeline>
      </HistorySection>
    </Container>
  );
}

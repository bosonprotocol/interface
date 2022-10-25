import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { ArrowSquareOut } from "phosphor-react";
import { useCallback, useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import DetailTable from "../../../components/detail/DetailTable";
import { DetailDisputeResolver } from "../../../components/detail/DetailWidget/DetailDisputeResolver";
import { DetailSellerDeposit } from "../../../components/detail/DetailWidget/DetailSellerDeposit";
import {
  ModalTypes,
  ShowModalFn,
  useModal
} from "../../../components/modal/useModal";
import Price from "../../../components/price";
import MultiSteps from "../../../components/step/MultiSteps";
import BosonButton from "../../../components/ui/BosonButton";
import Image from "../../../components/ui/Image";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { Offer } from "../../../lib/types/offer";
import {
  isExchangeCompletableByBuyer,
  isExchangeCompletableBySeller
} from "../../../lib/utils/exchange";
import { useDisputes } from "../../../lib/utils/hooks/useDisputes";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellerRoles } from "../../../lib/utils/hooks/useSellerRoles";
import ExchangeTimeline from "./ExchangeTimeline";

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

const sectionStyles = `
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

const InfoMessage = styled.div`
  border: 2px solid ${colors.border};
  color: ${colors.darkGrey};

  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  ${breakpoint.l} {
    text-align: left;
    background: ${colors.lightGrey};
  }
  && {
    padding: 0.6875rem 1.5rem;
  }
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
  gap: 0;
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

const getOfferDetailData = (
  offer: Offer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalTypes: ModalTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showModal: ShowModalFn
) => {
  const handleShowExchangePolicy = () => {
    if (modalTypes && showModal) {
      showModal(modalTypes.EXCHANGE_POLICY_DETAILS, {
        title: "Exchange Policy Details",
        offerId: offer.id
      });
    } else {
      console.error("modalTypes and/or showModal undefined");
    }
  };

  return [
    {
      name: DetailSellerDeposit.name,
      info: DetailSellerDeposit.info,
      value: <DetailSellerDeposit.value offer={offer} />
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
      value: (
        <Typography tag="p">
          Fair Exchange Policy{" "}
          <ArrowSquareOut
            size={20}
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer" }}
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

interface Props {
  exchange: Exchange | undefined;
  disputeOpen: boolean;
  iAmTheBuyer: boolean;
  refetchExchanges: () => void;
}
export default function ExchangeSidePreview({
  exchange,
  disputeOpen,
  iAmTheBuyer,
  refetchExchanges
}: Props) {
  const {
    data: disputes = [{} as subgraph.DisputeFieldsFragment],
    refetch: refetchDisputes
  } = useDisputes(
    {
      disputesFilter: {
        exchange: exchange?.id
      }
    },
    { enabled: !!exchange }
  );
  const [dispute] = disputes.length
    ? disputes
    : [{} as subgraph.DisputeFieldsFragment];
  const offer = exchange?.offer;
  const { showModal, modalTypes } = useModal();
  const OFFER_DETAIL_DATA = useMemo(
    () => offer && getOfferDetailData(offer, modalTypes, showModal),
    [offer, modalTypes, showModal]
  );
  const navigate = useKeepQueryParamsNavigate();

  const refetchItAll = useCallback(() => {
    refetchExchanges();
    refetchDisputes();
  }, [refetchExchanges, refetchDisputes]);

  const handleExchangeImageOnClick = useCallback(() => {
    if (!exchange) {
      return;
    }
    navigate({
      pathname: generatePath(BosonRoutes.Exchange, {
        [UrlParameters.exchangeId]: exchange.id
      })
    });
  }, [exchange, navigate]);
  const sellerRoles = useSellerRoles(iAmTheBuyer ? "" : offer?.seller.id || "");
  const CompleteExchangeButton = useCallback(() => {
    if (!exchange) {
      return null;
    }
    const isVisible = iAmTheBuyer
      ? isExchangeCompletableByBuyer(exchange)
      : isExchangeCompletableBySeller(exchange);
    if (!isVisible) {
      return null;
    }
    const isDisabled = iAmTheBuyer ? false : sellerRoles.isOperator;
    return (
      <BosonButton
        variant="primaryFill"
        disabled={isDisabled}
        onClick={() =>
          showModal(
            modalTypes.COMPLETE_EXCHANGE,
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
      </BosonButton>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange, iAmTheBuyer, sellerRoles.isOperator]);
  if (!exchange || !offer) {
    return null;
  }
  const isInRedeemed = subgraph.ExchangeState.Redeemed === exchange.state;
  const isInDispute = exchange.disputed && !dispute.finalizedDate;
  const isResolved = !!dispute.resolvedDate;
  const isEscalated = !!dispute.escalatedDate;
  const isRetracted = !!dispute.retractedDate;
  const raisedDisputeAt = new Date(Number(dispute.disputedDate) * 1000);
  const lastDayToResolveDispute = new Date(
    raisedDisputeAt.getTime() +
      Number(exchange.offer.resolutionPeriodDuration) * 1000
  );
  const totalDaysToResolveDispute = dayjs(lastDayToResolveDispute).diff(
    raisedDisputeAt,
    "day"
  );
  const daysLeftToResolveDispute = dayjs(lastDayToResolveDispute).diff(
    new Date().getTime(),
    "day"
  );
  return (
    <Container $disputeOpen={disputeOpen}>
      <StyledImage
        src={exchange?.offer.metadata.imageUrl}
        alt="exchange image"
        dataTestId="exchange-image"
        onClick={handleExchangeImageOnClick}
      />
      {isInDispute && (
        <InfoMessage>{`${daysLeftToResolveDispute} / ${totalDaysToResolveDispute} days left to resolve dispute`}</InfoMessage>
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
          <StyledMultiSteps
            data={[
              { name: "Describe Problem", steps: 1 },
              { name: "Raise dispute", steps: 1 },
              { name: "Resolve or Escalate", steps: 1 }
            ]}
            active={isInDispute && !isEscalated ? 2 : 3}
            hideArrows
          />
        </Section>
      )}
      <Section>
        <DetailTable align noBorder data={OFFER_DETAIL_DATA ?? ({} as never)} />
      </Section>
      {isInDispute && iAmTheBuyer && !isEscalated && !isRetracted ? (
        <CTASection>
          <BosonButton
            variant="accentInverted"
            onClick={() =>
              showModal(
                "RETRACT_DISPUTE",
                {
                  title: "Retract",
                  exchangeId: exchange.id,
                  offerName: offer.metadata.name,
                  refetch: refetchItAll,
                  disputeId: exchange.dispute?.id ?? ""
                },
                "s"
              )
            }
          >
            Retract
          </BosonButton>
          <BosonButton
            variant="secondaryInverted"
            showBorder={false}
            onClick={() =>
              showModal(
                "ESCALATE_MODAL",
                {
                  title: "Escalate",
                  exchange: exchange,
                  refetch: refetchItAll
                },
                "l"
              )
            }
          >
            Escalate
          </BosonButton>
          <CompleteExchangeButton />
        </CTASection>
      ) : isInRedeemed && iAmTheBuyer ? (
        <CTASection>
          <BosonButton
            variant="primaryFill"
            onClick={() =>
              showModal(
                "RAISE_DISPUTE",
                {
                  title: "Raise a problem",
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
            Raise a Problem
          </BosonButton>
          <CompleteExchangeButton />
        </CTASection>
      ) : (
        <CTASection>
          <CompleteExchangeButton />
        </CTASection>
      )}
      <HistorySection>
        <ExchangeTimeline exchange={exchange} showDispute={true}>
          <h4>History</h4>
        </ExchangeTimeline>
      </HistorySection>
    </Container>
  );
}

import { subgraph } from "@bosonprotocol/core-sdk";
import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import DetailTable from "../../../components/detail/DetailTable";
import { DetailDisputeResolver } from "../../../components/detail/DetailWidget/DetailDisputeResolver";
import { DetailSellerDeposit } from "../../../components/detail/DetailWidget/DetailSellerDeposit";
import { useModal } from "../../../components/modal/useModal";
import Price from "../../../components/price";
import MultiSteps from "../../../components/step/MultiSteps";
import Timeline from "../../../components/timeline/Timeline";
import Button from "../../../components/ui/Button";
import Typography from "../../../components/ui/Typography";
import { CONFIG } from "../../../lib/config";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";

const Container = styled.div<{ $disputeOpen: boolean }>`
  display: flex;
  flex-direction: column;
  height: 91vh;
  overflow-y: auto;
  min-width: max-content;
  position: absolute;
  margin-top: 4.375rem;
  right: ${({ $disputeOpen }) => ($disputeOpen ? "0" : "-160vw")};
  transition: 400ms;
  width: ${({ $disputeOpen }) => $disputeOpen && "100vw"};
  background: ${colors.lightGrey};
  padding-top: 1.875rem;
  ${breakpoint.m} {
    width: 75%;
    min-width: 60%;
  }
  ${breakpoint.l} {
    position: relative;
    background: transparent;
    right: unset;
    margin-top: 0;
    width: unset;
    padding-top: none;
    min-width: max-content;
  }
  > img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    width: 23.25rem;
    display: block;
    margin: 0 auto;
    ${breakpoint.l} {
      max-width: 23.25rem;
      max-height: unset;
      object-fit: cover;
    }
  }
  > div {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    ${breakpoint.xs} {
      padding-left: 4.375rem;
      padding-right: 4.375rem;
    }
    ${breakpoint.s} {
      padding-left: 7.5rem;
      padding-right: 7.5rem;
    }
    ${breakpoint.m} {
      padding-left: 6.875rem;
      padding-right: 6.875rem;
    }
    ${breakpoint.l} {
      padding: 1.625rem;
    }
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
  border-left: 2px solid ${colors.border};
  color: ${colors.darkGrey};
  padding: 0.5rem 1.25rem 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  ${breakpoint.l} {
    text-align: left;
    background: ${colors.lightGrey};
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
`;

const HistorySection = styled(Section)`
  padding-bottom: 3rem;
  height: 100%;
`;

const formatShortDate = (date: string) => {
  return date
    ? dayjs(new Date(Number(date) * 1000)).format(CONFIG.shortDateFormat)
    : "";
};

const getOfferDetailData = (offer: Offer) => {
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
      value: "Fair exchange policy"
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
}
export default function ExchangeSidePreview({ exchange, disputeOpen }: Props) {
  const offer = exchange?.offer;
  const { showModal } = useModal();
  const OFFER_DETAIL_DATA = useMemo(
    () => offer && getOfferDetailData(offer),
    [offer]
  );
  const timesteps = useMemo(() => {
    if (!exchange) {
      return [];
    }
    const { committedDate, redeemedDate } = exchange;
    const timesteps = [];
    if (committedDate) {
      timesteps.push({
        text: "Committed",
        date: formatShortDate(committedDate)
      });
    }
    if (redeemedDate) {
      timesteps.push({ text: "Redeemed", date: formatShortDate(redeemedDate) });
    }
    return timesteps;
  }, [exchange]);
  if (!exchange || !offer) {
    return null;
  }
  const isInRedeemed = subgraph.ExchangeState.Redeemed === exchange.state;
  const isInDispute = exchange.disputed;
  const isResolved = false; // TODO: change
  const isEscalated = false; // TODO: change
  // TODO: change these values
  const deadlineToResolveDispute = new Date(
    new Date().getTime() + 1000000000
  ).getTime();
  const raisedDisputeAt = new Date(new Date().getTime() - 100000000).getTime(); // yesterday
  const totalDaysToResolveDispute = dayjs(deadlineToResolveDispute).diff(
    raisedDisputeAt,
    "day"
  );
  const daysLeftToResolveDispute = dayjs(deadlineToResolveDispute).diff(
    new Date().getTime(),
    "day"
  );
  return (
    <Container $disputeOpen={disputeOpen}>
      <img src={exchange.offer.metadata.imageUrl} width="372px" />
      {isInRedeemed && (
        <InfoMessage>{`${daysLeftToResolveDispute} / ${totalDaysToResolveDispute} days left to resolve dispute`}</InfoMessage>
      )}
      <ExchangeInfo>
        <Name tag="h3">{exchange.offer.metadata.name}</Name>
        <StyledPrice
          isExchange={false}
          address={offer.exchangeToken.address}
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
            active={isInDispute ? 1 : 2}
          />
        </Section>
      )}
      <Section>
        <DetailTable align noBorder data={OFFER_DETAIL_DATA ?? ({} as never)} />
      </Section>
      {isInDispute && (
        <CTASection>
          <Button
            theme="primary"
            onClick={() =>
              showModal(
                "CANCEL_EXCHANGE",
                {
                  title: "Cancel exchange",
                  exchange
                },
                "s"
              )
            }
          >
            Retract
          </Button>
          <Button
            theme="orange"
            onClick={() => {
              // TODO: implement
              console.log("escalate");
            }}
          >
            Escalate
          </Button>
        </CTASection>
      )}
      <HistorySection>
        <h4>History</h4>
        <Timeline timesteps={timesteps} />
      </HistorySection>
    </Container>
  );
}

import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import DetailTable from "../../../components/detail/DetailTable";
import { DetailDisputeResolver } from "../../../components/detail/DetailWidget/DetailDisputeResolver";
import { DetailSellerDeposit } from "../../../components/detail/DetailWidget/DetailSellerDeposit";
import { useModal } from "../../../components/modal/useModal";
import Price from "../../../components/price";
import Step from "../../../components/stepper/step/Step";
import Stepper from "../../../components/stepper/Stepper";
import Timeline from "../../../components/timeline/Timeline";
import Button from "../../../components/ui/Button";
import Typography from "../../../components/ui/Typography";
import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { Thread } from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 91vh;
  overflow-y: auto;
  min-width: max-content;
`;

const sectionStyles = `
border: 2px solid ${colors.border};
border-top: none;
padding: 1.625rem;
`;
const Section = styled.div`
  ${sectionStyles};
`;

const DaysLeftToDispute = styled.div`
  background: ${colors.border};
  color: ${colors.darkGrey};
  padding: 0.5rem 1.25rem 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
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

const StyledStepper = styled(Stepper)`
  ${sectionStyles};
`;

const StepText = styled.span`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: ${colors.darkGrey};
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
  thread: Thread | undefined;
}
export default function Dispute({ thread }: Props) {
  const exchange = thread?.exchange;
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

  return (
    <Container>
      <img src={exchange.offer.metadata.imageUrl} width="372px" />
      <DaysLeftToDispute>Just a few days left to dispute</DaysLeftToDispute>
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
      <StyledStepper>
        <Step status="done">
          <StepText>Describe Problem</StepText>
        </Step>
        <Step status="inprogress">
          <StepText>Raise dispute</StepText>
        </Step>
        <Step status="todo">
          <StepText>Resolve or Escalate</StepText>
        </Step>
      </StyledStepper>
      <Section>
        <DetailTable align noBorder data={OFFER_DETAIL_DATA ?? ({} as never)} />
      </Section>
      <CTASection>
        <Button
          theme="primary"
          onClick={() =>
            showModal("CANCEL_EXCHANGE", {
              title: "Cancel exchange",
              exchange
            })
          }
        >
          Retract
        </Button>
        <Button
          theme="orange"
          onClick={() =>
            showModal("RESOLVE_DISPUTE", {
              title: "Resolve dispute",
              exchange,
              proposal: {
                type: "Refund Request",
                percentageAmount: "10",
                signature: "0x"
              }
            })
          }
        >
          Escalate
        </Button>
      </CTASection>
      <HistorySection>
        <h4>History</h4>
        <Timeline timesteps={timesteps} />
      </HistorySection>
    </Container>
  );
}

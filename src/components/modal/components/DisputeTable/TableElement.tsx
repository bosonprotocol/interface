import { ClockClockwise } from "phosphor-react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { DrCenterRoutes } from "../../../../lib/routing/drCenterRoutes";
import { UrlParameters } from "../../../../lib/routing/parameters";
import { colors } from "../../../../lib/styles/colors";
import { getExchangeDisputeDates } from "../../../../lib/utils/exchange";
import { useDisputeSubStatusInfo } from "../../../../lib/utils/hooks/useDisputeSubStatusInfo";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Image from "../../../ui/Image";
import SellerID from "../../../ui/SellerID";
import ProposalTypeSummary from "../Chat/components/ProposalTypeSummary";

const OfferImage = styled.div`
  width: 3.75rem;
  height: 3.75rem;
  margin-right: 1rem;
  img {
    margin-top: -5px;
    object-fit: contain;
  }
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
`;

const ExchangeName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const DisputeRaised = styled.td`
  text-transform: lowercase;
  font-weight: 400;
  color: ${colors.black};
  &:first-letter {
    text-transform: capitalize;
  }
`;

const DisputeEndDate = styled(ClockClockwise)`
  margin-right: 0.625rem;
  font-weight: 400;
`;

function TableElement({ exchange }: { exchange: Exchange }) {
  const { status } = useDisputeSubStatusInfo(exchange);
  const navigate = useKeepQueryParamsNavigate();

  if (!exchange) {
    return null;
  }

  const { totalDaysToResolveDispute, daysLeftToResolveDispute } =
    getExchangeDisputeDates(exchange);

  const deadlineTimeLeft = `${daysLeftToResolveDispute}/${totalDaysToResolveDispute}`;
  const isResolved =
    exchange.dispute?.buyerPercent && exchange.dispute?.buyerPercent !== "0";
  return (
    <>
      <td>{exchange.id}</td>
      <td>
        <Grid
          alignItems="center"
          justifyContent="flex-start"
          $width="max-content"
        >
          <OfferImage>
            <Image src={exchange.offer.metadata.image} />
          </OfferImage>
          <MessageInfo>
            <ExchangeName>{exchange.offer.metadata.name}</ExchangeName>
            <SellerID
              offer={exchange.offer}
              buyerOrSeller={exchange.offer.seller}
              withProfileImage
              onClick={() => null}
            />
          </MessageInfo>
        </Grid>
      </td>
      <DisputeRaised>{status}</DisputeRaised>
      <td>
        {isResolved ? (
          "-"
        ) : (
          <Grid alignItems="center" $width="max-content">
            <DisputeEndDate size={17} fontWeight="light" color={colors.black} />
            {deadlineTimeLeft}
          </Grid>
        )}
      </td>
      <td>
        {isResolved && (
          <ProposalTypeSummary
            exchange={exchange}
            proposal={{
              type: "Refund",
              percentageAmount: exchange.dispute?.buyerPercent ?? ""
            }}
          />
        )}
      </td>
      <td>
        <Grid justifyContent="flex-end" gap="1rem">
          <Button
            type="button"
            theme="secondary"
            onClick={() => {
              navigate({
                pathname: generatePath(DrCenterRoutes.ChatMessage, {
                  [UrlParameters.exchangeId]: exchange?.id
                })
              });
            }}
          >
            Open chat
          </Button>
        </Grid>
      </td>
    </>
  );
}

export default TableElement;

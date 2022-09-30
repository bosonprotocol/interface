import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { ClockClockwise } from "phosphor-react";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../lib/routing/routes";
import { colors } from "../../../../lib/styles/colors";
import { getDateTimestamp } from "../../../../lib/utils/getDateTimestamp";
import { useDisputes } from "../../../../lib/utils/hooks/useDisputes";
import { useDisputeSubStatusInfo } from "../../../../lib/utils/hooks/useDisputeSubStatusInfo";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Image from "../../../ui/Image";
import SellerID from "../../../ui/SellerID";

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
  const currentDate = dayjs();

  const parseDisputeDate = dayjs(getDateTimestamp(exchange.validUntilDate));

  const deadlineTimeLeft = useMemo(() => {
    if (parseDisputeDate.diff(currentDate, "days") === 0) {
      return "Dispute period ended today";
    }
    if (parseDisputeDate.diff(currentDate, "days") > 0) {
      return `${parseDisputeDate.diff(
        currentDate,
        "days"
      )} days until dispute end`;
    }
    return `Dispute period ended ${
      parseDisputeDate.diff(currentDate, "days") * -1
    } days ago`;
  }, [currentDate, parseDisputeDate]);

  const { data: disputes = [{} as subgraph.DisputeFieldsFragment] } =
    useDisputes(
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

  const isNotEscalatedYet = dispute ? dispute?.escalatedDate === null : false;

  if (exchange) {
    return (
      <>
        <td>
          <Grid
            alignItems="center"
            justifyContent="flex-start"
            $width="max-content"
          >
            <OfferImage>
              <Image src={exchange?.offer.metadata.image} />
            </OfferImage>
            <MessageInfo>
              <ExchangeName>{exchange?.offer.metadata.name}</ExchangeName>
              <SellerID
                offer={exchange?.offer}
                buyerOrSeller={exchange?.offer.seller}
                withProfileImage
                onClick={() => null}
              />
            </MessageInfo>
          </Grid>
        </td>
        <DisputeRaised>{status}</DisputeRaised>
        <td>
          <Grid alignItems="center" $width="max-content">
            <DisputeEndDate size={17} fontWeight="light" color={colors.black} />
            {deadlineTimeLeft}
          </Grid>
        </td>
        <td>
          <Grid justifyContent="flex-end" gap="1rem">
            {isNotEscalatedYet && (
              <Button
                theme="orange"
                size="small"
                onClick={() => {
                  navigate({
                    pathname: generatePath(BosonRoutes.ChatMessage, {
                      [UrlParameters.exchangeId]: exchange?.id
                    })
                  });
                }}
              >
                Escalate dispute
              </Button>
            )}
            <Button
              type="button"
              theme="primary"
              size="small"
              onClick={() => {
                navigate({
                  pathname: generatePath(BosonRoutes.ChatMessage, {
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
  return null;
}

export default TableElement;

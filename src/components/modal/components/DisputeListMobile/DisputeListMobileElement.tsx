import { ClockClockwise } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { DrCenterRoutes } from "../../../../lib/routing/drCenterRoutes";
import { colors } from "../../../../lib/styles/colors";
import { getExchangeDisputeDates } from "../../../../lib/utils/exchange";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Image from "../../../ui/Image";
import SellerID from "../../../ui/SellerID";
import Typography from "../../../ui/Typography";

const Container = styled.div`
  background: ${colors.white};
  width: 25rem;
  display: block;
  padding: 0 1rem 0.0625rem 1rem;
  border: 1px solid ${colors.lightGrey};
`;

const OfferImage = styled.div`
  display: block;
  margin-bottom: 0.625rem;
  margin-left: -1rem;
  padding-right: 1rem;
  width: calc(100% + 3rem);
`;

const MessageInfo = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
`;

const ExchangeName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  width: max-content;
  margin-right: 0.9375rem;
`;

const StyledSellerID = styled(SellerID)`
  width: 50%;
`;

const StyledImage = styled(Image)`
  border-radius: 0;
  width: 100%;
  padding-top: 210px;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

const DisputeRaised = styled.div`
  text-transform: lowercase;
  font-weight: 400;
  color: ${colors.black};
  width: 50%;
  font-size: 0.875rem;
  &:first-letter {
    text-transform: capitalize;
  }
`;

const StyledGrid = styled(Grid)`
  min-width: 13.6875rem;
  font-weight: 500;
  font-size: 0.75rem;
`;

const DisputeEndDate = styled(ClockClockwise)`
  margin-right: 0.625rem;
  font-weight: 400;
`;

const StyledChatButton = styled(BosonButton)`
  font-size: 0.875rem;
  div {
    font-weight: 600;
  }
`;

function DisputeListMobileElement({ exchange }: { exchange: Exchange }) {
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
    <Container>
      <OfferImage>
        <StyledImage src={exchange?.offer.metadata.image} />
      </OfferImage>
      <MessageInfo>
        <ExchangeName>{exchange?.offer.metadata.name}</ExchangeName>
        <StyledSellerID
          offer={exchange?.offer}
          buyerOrSeller={exchange?.offer.seller}
          withProfileImage
          onClick={() => null}
        />
      </MessageInfo>
      <Typography fontWeight="400" $fontSize="12px" color={colors.darkGrey}>
        State
      </Typography>
      <Grid>
        <Grid $width="initial">
          <DisputeRaised>{exchange?.state}</DisputeRaised>
        </Grid>

        <StyledGrid
          alignItems="flex-start"
          justifyContent="flex-end"
          margin="0 0 0 0"
          color={colors.darkGrey}
        >
          {isResolved ? (
            <>
              <DisputeEndDate
                size={17}
                fontWeight="light"
                color={colors.darkGrey}
              />
              {deadlineTimeLeft}{" "}
            </>
          ) : (
            "-"
          )}
        </StyledGrid>
      </Grid>
      <Grid margin="0.9375rem 0 0.9375rem 0">
        <StyledChatButton
          type="button"
          variant="primaryFill"
          size="small"
          onClick={() => {
            navigate({
              pathname: `${DrCenterRoutes.Chat}/${exchange.id}`
            });
          }}
        >
          Open chat
        </StyledChatButton>
      </Grid>
    </Container>
  );
}

export default DisputeListMobileElement;

import dayjs from "dayjs";
import { ArrowSquareOut } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { getDateTimestamp } from "../../../../../../../lib/utils/getDateTimestamp";
import { useDisputeResolvers } from "../../../../../../../lib/utils/hooks/useDisputeResolvers";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

interface Props {
  exchange: Exchange;
}
const StyledGrid = styled(Grid)`
  background: ${colors.white};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  justify-content: space-between;
  width: 100%;
  grid-gap: 0.625rem;
  margin-top: 1.5625rem;
  padding-bottom: 15px;
  border-bottom: 1px solid ${colors.lightGrey};
`;

const StyledArrowSquare = styled(ArrowSquareOut)`
  margin-left: 5px;
`;

function EscalateStepOne({ exchange }: Props) {
  const currentDate = dayjs();
  const { data } = useDisputeResolvers();

  const feeAmount = data?.disputeResolvers[0]?.fees[0]?.feeAmount;

  const parseDisputePeriod = dayjs(
    getDateTimestamp(exchange.offer.validUntilDate) +
      getDateTimestamp(exchange.offer.fulfillmentPeriodDuration)
  );

  const deadlineTimeLeft = useMemo(() => {
    if (parseDisputePeriod.diff(currentDate, "days") === 0) {
      return "Dispute period ended today";
    }
    if (parseDisputePeriod.diff(currentDate, "days") > 0) {
      return `${parseDisputePeriod.diff(currentDate, "days")} days left`;
    }
    return `Dispute period ended ${
      parseDisputePeriod.diff(currentDate, "days") * -1
    } days ago`;
  }, [currentDate, parseDisputePeriod]);

  return (
    <>
      <StyledGrid
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        padding="2rem"
        margin="1rem 0 0 0"
      >
        <Typography fontWeight="600" $fontSize="2rem" margin="1rem 0 0 0">
          Escalate Dispute
        </Typography>
        <Typography $fontSize="1rem" fontWeight="400" color={colors.darkGrey}>
          Escalating a dispute will enable the dispite resolver to decide on the
          outcome of the dispute. The dispute resolver will decide based on the
          contractual agreement and evidence submitted by both parties.
        </Typography>
        <GridContainer>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Dispute resolver
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            Portal
          </Typography>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Exchange policy
          </Typography>
          <Grid justifyContent="flex-end">
            <Typography
              fontWeight="600"
              $fontSize="1rem"
              color={colors.darkGrey}
              justifyContent="flex-end"
            >
              Fair Exchange Policy
            </Typography>
            <StyledArrowSquare color={colors.secondary} size={22} />
          </Grid>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Escalation deposit
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            {feeAmount}
          </Typography>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Dispute period
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            {deadlineTimeLeft}
          </Typography>
        </GridContainer>
      </StyledGrid>
    </>
  );
}

export default EscalateStepOne;

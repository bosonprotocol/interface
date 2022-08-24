import React from "react";
import styled from "styled-components";

import DisputeTable from "../../components/modal/components/DisputeTable/DisputeTable";
import { useModal } from "../../components/modal/useModal";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

const DisputeListContainer = styled.div`
  background: ${colors.lightGrey};
  min-height: calc(100vh - 489px);
  padding-bottom: 3.125rem;
`;

const DisputeListHeader = styled.div`
  max-width: 65.625rem;
  margin: 0 auto;
  padding-top: 3.125rem;
  padding-bottom: 2rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 1.875rem;
  margin-right: 0.9375rem;
  div {
    font-weight: 600;
  }
`;

const HowItWorksButton = styled(Button)`
  border: 2px solid ${colors.secondary};
  color: ${colors.secondary};
  margin-top: 1.875rem;
  div {
    font-weight: 600;
  }
`;

function DisputeList() {
  const navigate = useKeepQueryParamsNavigate();
  const { showModal, modalTypes } = useModal();

  const { data: exchanges = [] } = useExchanges({
    disputed: false
  });

  console.log(exchanges);

  return (
    <>
      <DisputeListHeader>
        <Typography fontSize="2rem" color={colors.black} fontWeight="600">
          Dispute resolution center
        </Typography>
        <Typography fontSize="1.25rem" color={colors.darkGrey}>
          Raise and resolve problems of your exchanges.
        </Typography>
        <Grid $width="max-content">
          <SubmitButton
            type="submit"
            theme="secondary"
            size="small"
            onClick={() => {
              navigate({
                pathname: `${BosonRoutes.Account}?tab=exchanges`
              });
            }}
          >
            Submit an issue
          </SubmitButton>
          <HowItWorksButton
            type="button"
            theme="outline"
            size="small"
            onClick={() => {
              showModal(modalTypes.DISPUTE_MODAL, {
                title: "Raise a problem"
              });
            }}
          >
            How it works?
          </HowItWorksButton>
        </Grid>
      </DisputeListHeader>
      <DisputeListContainer>
        <DisputeTable exchanges={exchanges} />
      </DisputeListContainer>
    </>
  );
}

export default DisputeList;

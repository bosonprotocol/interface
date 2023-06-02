import { CheckCircle, Plus } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { ModalHeaderTitle } from "../../../../components/modal/header/ModalHeaderTitle";
import { getSellerCenterPath } from "../../../../components/seller/paths";
import BosonButton from "../../../../components/ui/BosonButton";
import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import GridContainer from "../../../../components/ui/GridContainer";
import Typography from "../../../../components/ui/Typography";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";

const Background = styled.div`
  background: ${colors.lightGrey};
  height: 100%;
`;

const Container = styled.div`
  background: ${colors.white};
  width: 43rem;
  max-width: 100%;
  ${breakpoint.xs} {
    margin: 4.8125rem auto;
  }
  ${breakpoint.s} {
    margin: 5.8125rem auto;
  }
  ${breakpoint.m} {
    margin: 6.8125rem auto;
  }
  ${breakpoint.l} {
    margin: 7.8125rem auto;
  }
`;

interface DCLSuccessProps {
  handleOnClose: () => void;
}

export const DCLSuccess: React.FC<DCLSuccessProps> = ({ handleOnClose }) => {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <Background>
      <Container>
        <ModalHeaderTitle
          title="Done!"
          handleOnClose={handleOnClose}
          closable
        />
        <Grid flexDirection="column" padding="2rem">
          <Grid flexDirection="column" margin="2.5rem 4.625rem">
            <CheckCircle
              size={105}
              color={colors.green}
              style={{ marginBottom: "2rem" }}
            />
            <Typography fontWeight="600" $fontSize="1.5rem" textAlign="center">
              You have updated this product, you can view it and see all
              products on the product Dashboard.{" "}
            </Typography>
          </Grid>
          <GridContainer
            columnGap="1.25rem"
            rowGap="1.25rem"
            itemsPerRow={{
              xs: 1,
              s: 2,
              m: 2,
              l: 2,
              xl: 2
            }}
          >
            <BosonButton
              onClick={() =>
                navigate({ pathname: getSellerCenterPath("Products") })
              }
              style={{ height: "56px", whiteSpace: "pre" }}
            >
              See Products
            </BosonButton>
            <Button
              theme="secondary"
              onClick={() =>
                navigate({ pathname: getSellerCenterPath("Sales Channels") })
              }
              style={{ height: "56px", whiteSpace: "pre" }}
            >
              Add another channel <Plus size={20} color={colors.secondary} />
            </Button>
          </GridContainer>
        </Grid>
      </Container>
    </Background>
  );
};

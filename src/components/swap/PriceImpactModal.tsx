import { Percent } from "@uniswap/sdk-core";
import { CloseIcon } from "components/icons";
import Modal from "components/modal/Modal";
import Button from "components/ui/Button";
import { ColumnCenter } from "components/ui/column";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { formatPriceImpact } from "lib/utils/formatNumbers";
import { Warning } from "phosphor-react";
import styled from "styled-components";

const Wrapper = styled(ColumnCenter)`
  padding: 16px 24px;
`;

const IconContainer = styled.div`
  padding: 32px 0px;
`;

const WarningIcon = styled(Warning)`
  color: ${({ theme }) => theme.accentCritical};
`;

const ButtonContainer = styled(ColumnCenter)`
  padding: 12px 0px 0px;
`;

const StyledThemeButton = styled(Button)`
  width: 100%;
`;

interface PriceImpactModalProps {
  priceImpact: Percent;
  onDismiss: () => void;
  onContinue: () => void;
}

export default function PriceImpactModal({
  priceImpact,
  onDismiss,
  onContinue
}: PriceImpactModalProps) {
  return (
    <Modal hideModal={onDismiss} modalType={"PRICE_IMPACT"}>
      <Wrapper gap="md">
        <Grid padding="8px 0px 4px">
          <CloseIcon size={24} onClick={onDismiss} />
        </Grid>
        <IconContainer>
          <WarningIcon size={48} />
        </IconContainer>
        <ColumnCenter gap="sm">
          <Typography fontWeight={500}>
            <>Warning</>
          </Typography>
          <Typography lineHeight="24px" textAlign="center">
            <>
              This transaction will result in a{" "}
              <Typography
                lineHeight="24px"
                color="accentFailure"
                // TODO: display="inline"
              >
                {formatPriceImpact(priceImpact)}
              </Typography>{" "}
              price impact on the market price of this pool. Do you wish to
              continue?
            </>
          </Typography>
        </ColumnCenter>
        <ButtonContainer gap="md">
          <StyledThemeButton
            // TODO: size={Button.large}
            // TODO: emphasis={Button.failure}
            onClick={onContinue}
          >
            <>Continue</>
          </StyledThemeButton>
          <StyledThemeButton
            // TODO: size={Button.medium}
            // TODO: emphasis={Button.low}
            onClick={onDismiss}
          >
            <>Cancel</>
          </StyledThemeButton>
        </ButtonContainer>
      </Wrapper>
    </Modal>
  );
}

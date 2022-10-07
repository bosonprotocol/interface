import { ArrowCircleUp } from "phosphor-react";
import { useEffect } from "react";
import styled from "styled-components";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { ModalProps } from "../../../ModalContext";
import { useModal } from "../../../useModal";

const StyledArrowCircleUp = styled(ArrowCircleUp)`
  * {
    stroke-width: 2px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

interface Props {
  action: string;
  txHash: string;
  hideModal: NonNullable<ModalProps["hideModal"]>;
}
export default function TransactionSubmittedModal({
  action,
  txHash,
  hideModal
}: Props) {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"TRANSACTION_SUBMITTED">({
      ...store,
      modalProps: {
        ...store.modalProps
      },
      modalSize: "auto",
      modalMaxWidth: {
        xs: "550px"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      <StyledArrowCircleUp size={128} color={colors.green} />

      <Typography fontWeight="600" $fontSize="1.5rem" lineHeight="150%">
        {action} transaction submitted
      </Typography>
      <a href={CONFIG.getTxExplorerUrl?.(txHash)} target="_blank">
        <Typography
          fontWeight="600"
          $fontSize="1rem"
          lineHeight="150%"
          margin="0.5rem 0 1.5rem 0"
          color={colors.secondary}
        >
          View on Explorer
        </Typography>
      </a>

      <StyledButton onClick={hideModal} withBosonStyle>
        Close
      </StyledButton>
    </Grid>
  );
}

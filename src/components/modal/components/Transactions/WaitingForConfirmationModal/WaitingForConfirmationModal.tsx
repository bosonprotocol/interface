import { useEffect } from "react";

import { colors } from "../../../../../lib/styles/colors";
import { Grid } from "../../../../ui/Grid";
import Loading from "../../../../ui/Loading";
import { Typography } from "../../../../ui/Typography";
import { useModal } from "../../../useModal";

interface Props {
  action: string;
}

export default function WaitingForConfirmationModal({ action }: Props) {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"WAITING_FOR_CONFIRMATION">({
      ...store,
      modalProps: {
        ...store.modalProps
      },
      modalSize: "auto",
      modalMaxWidth: {
        xs: "400px"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid flexDirection="column" alignItems="center">
      <Loading
        wrapperStyle={{
          padding: "0 0 2rem 0"
        }}
        style={{
          borderWidth: "0.125rem",
          borderColor: `${colors.green} ${colors.green} ${colors.green} transparent`,
          width: "6rem",
          height: "6rem"
        }}
      />
      <Typography fontWeight="600" fontSize="1.5rem" lineHeight="150%">
        Waiting For Confirmation
      </Typography>
      <Typography
        fontWeight="600"
        fontSize="1rem"
        lineHeight="150%"
        color={colors.darkGrey}
        margin="0.5rem 0 1.5rem 0"
      >
        {action}
      </Typography>
      <Typography
        fontWeight="400"
        fontSize="0.75rem"
        lineHeight="150%"
        color={colors.darkGrey}
      >
        Confirm this transaction into your wallet
      </Typography>
    </Grid>
  );
}

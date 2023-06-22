import React, { useEffect } from "react";

import { colors } from "../../../../../lib/styles/colors";
import Grid from "../../../../ui/Grid";
import Loading from "../../../../ui/Loading";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";

export const PreparingTransactionModal: React.FC = () => {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"PREPARING_TRANSACTION">({
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
      <Typography fontWeight="600" $fontSize="1.5rem" lineHeight="150%">
        Preparing transaction
      </Typography>
    </Grid>
  );
};

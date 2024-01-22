import { ArrowRight } from "phosphor-react";
import React from "react";

import BosonButton from "../../../ui/BosonButton";
import { Grid } from "../../../ui/Grid";
import { Typography } from "../../../ui/Typography";
import { useModal } from "../../useModal";
import personWatchImg from "./assets/personWatch.webp";

type AccountCreationModalProps = {
  onClickCreateAccount?: () => void;
  onCloseCreateProfile?: () => void;
  waitUntilIndexed?: boolean;
};

export const AccountCreationModal: React.FC<AccountCreationModalProps> = ({
  onClickCreateAccount,
  onCloseCreateProfile,
  waitUntilIndexed
}) => {
  const { showModal } = useModal();
  return (
    <Grid justifyContent="center" flexDirection="column">
      <img
        src={personWatchImg}
        style={{ margin: "1rem 2.5rem 2.5rem 2.5rem" }}
        width="250"
        height="250"
      />
      <Grid justifyContent="center" flexDirection="column">
        <Typography fontWeight="600" fontSize="2rem">
          Create an account in 2 Minutes
        </Typography>
        <Typography fontWeight="400" fontSize="1.25rem">
          There was no account found connected to you wallet. Create an account
          in minutes to start selling on Boson.
        </Typography>
        <BosonButton
          style={{ marginTop: "2.5rem" }}
          onClick={() => {
            if (onClickCreateAccount) {
              onClickCreateAccount();
            } else {
              showModal("CREATE_PROFILE", {
                waitUntilIndexed: !!waitUntilIndexed,
                onClose: (isCreated: boolean) => {
                  if (isCreated) {
                    onCloseCreateProfile?.();
                  }
                }
              });
            }
          }}
        >
          Create an account <ArrowRight size={15} />
        </BosonButton>
      </Grid>
    </Grid>
  );
};

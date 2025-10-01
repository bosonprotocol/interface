import { Dispatch, SetStateAction } from "react";

import LensLogo from "../../../../assets/lens.svg?react";
import Button from "../../../ui/Button";
import { Grid } from "../../../ui/Grid";
import { Typography } from "../../../ui/Typography";
import { ProfileType } from "./const";

type Props = {
  setProfileType: Dispatch<SetStateAction<ProfileType | undefined>>;
};
export function ChooseProfileType({ setProfileType }: Props) {
  return (
    <>
      <Typography>
        Choose the type of profile you would like to use to set your seller
        account
      </Typography>
      <Grid flexDirection="column" gap="1rem" margin="1.5rem 0 0 0">
        <Button onClick={() => setProfileType(ProfileType.LENS)}>
          Sign up with <LensLogo />
        </Button>
        <Typography>
          <small>or</small>
        </Typography>
        <Button
          onClick={() => setProfileType(ProfileType.REGULAR)}
          themeVal="blankOutline"
        >
          Sign up without Lens
        </Button>
      </Grid>
    </>
  );
}

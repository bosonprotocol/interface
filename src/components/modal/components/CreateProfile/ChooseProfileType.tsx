import { Dispatch, SetStateAction } from "react";

import { ReactComponent as LensLogo } from "../../../../assets/lens.svg";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";

type Props = {
  setProfileType: Dispatch<SetStateAction<"lens" | "regular" | undefined>>;
};
export function ChooseProfileType({ setProfileType }: Props) {
  return (
    <>
      <Typography>
        Choose the type of profile you would like to use to set your seller
        account
      </Typography>
      <Grid flexDirection="column" gap="1rem" margin="1.5rem 0 0 0">
        <Button onClick={() => setProfileType("lens")}>
          Sign up with <LensLogo />
        </Button>
        <Typography>
          <small>or</small>
        </Typography>
        <Button onClick={() => setProfileType("regular")} theme="blankOutline">
          Sign up without Lens
        </Button>
      </Grid>
    </>
  );
}

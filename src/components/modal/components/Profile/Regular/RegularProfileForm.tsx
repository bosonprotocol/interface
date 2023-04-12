import { ReactNode } from "react";

import { useCreateForm } from "../../../../product/utils/useCreateForm";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import { ProfileFormFields } from "../ProfileFormFields";

type Props = {
  children: ReactNode;
  isEdit: boolean;
};
export default function RegularProfileForm({ children, isEdit }: Props) {
  const { nextIsDisabled } = useCreateForm();
  return (
    <>
      <ProfileFormFields />
      {children}
      <Grid margin="2rem 0 0 0">
        {isEdit ? (
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={nextIsDisabled}
          >
            Save & close
          </BosonButton>
        ) : (
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={nextIsDisabled}
          >
            Next
          </BosonButton>
        )}
      </Grid>
    </>
  );
}

import { ReactNode } from "react";

import { Spinner } from "../../../../loading/Spinner";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import { ProfileFormFields } from "../ProfileFormFields";

type Props = {
  children: ReactNode;
  isEdit: boolean;
  forceDirty?: boolean;
};
export default function RegularProfileForm({
  children,
  isEdit,
  forceDirty
}: Props) {
  const { nextIsDisabled, dirty, isSubmitting } = useCreateForm();
  return (
    <>
      <ProfileFormFields />
      {children}
      <Grid margin="2rem 0 0 0">
        {isEdit ? (
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={nextIsDisabled || isSubmitting}
          >
            {dirty || forceDirty ? "Save & continue" : "Next"}
            {isSubmitting && <Spinner size="20" />}
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

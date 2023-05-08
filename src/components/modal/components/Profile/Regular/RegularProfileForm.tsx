import { ReactNode } from "react";

import { BosonRoutes } from "../../../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
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
  const navigate = useKeepQueryParamsNavigate();

  return (
    <>
      <ProfileFormFields />
      {children}
      <Grid margin="2rem 0 0 0" justifyContent="flex-start" gap="2rem">
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
          <>
            <BosonButton
              variant="secondaryInverted"
              type="button"
              onClick={() => navigate({ pathname: BosonRoutes.Root })}
            >
              Back to home page
            </BosonButton>
            <BosonButton
              variant="primaryFill"
              type="submit"
              disabled={nextIsDisabled}
            >
              Next
            </BosonButton>
          </>
        )}
      </Grid>
    </>
  );
}

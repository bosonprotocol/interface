import { ReactElement, ReactNode } from "react";

import { BosonRoutes } from "../../../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { Spinner } from "../../../../loading/Spinner";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { ProfileFormFields } from "../ProfileFormFields";

type Props = {
  children: ReactNode;
  isEdit: boolean;
  forceDirty?: boolean;
  switchButton: () => ReactElement;
};
export default function RegularProfileForm({
  children,
  isEdit,
  forceDirty,
  switchButton: SwitchButton
}: Props) {
  const { nextIsDisabled, dirty, isSubmitting } = useCreateForm();
  const navigate = useKeepQueryParamsNavigate();

  return (
    <>
      <Grid
        justifyContent="space-between"
        alignItems="center"
        margin="0 0 2rem 0"
        flex="1"
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography $fontSize="2rem" fontWeight="600">
            {isEdit ? "Regular profile" : "Create your profile"}
          </Typography>
          {!isEdit && (
            <Typography>
              To begin selling on the BosonApp, start by creating a profile and
              seller account
            </Typography>
          )}
        </Grid>
        <div>
          <SwitchButton />
        </div>
      </Grid>
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

import { ReactElement, ReactNode } from "react";

import { BosonRoutes } from "../../../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { Spinner } from "../../../../loading/Spinner";
import { CreateProfile } from "../../../../product/utils";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { LensProfileType } from "../Lens/validationSchema";
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
  const { nextIsDisabled, dirty, isSubmitting, touched } = useCreateForm<
    CreateProfile | LensProfileType
  >();
  const navigate = useKeepQueryParamsNavigate();

  return (
    <>
      <Grid
        flexDirection="column"
        alignItems="flex-start"
        flexGrow="1"
        flexShrink="1"
        flexBasis="0"
        margin="0 0 2rem 0"
      >
        <Grid justifyContent="space-between" alignItems="center" flex="1">
          <Typography $fontSize="2rem" fontWeight="600">
            {isEdit ? "Regular profile" : "Create your profile"}
          </Typography>

          <div>
            <SwitchButton />
          </div>
        </Grid>
        {!isEdit && (
          <>
            <div>
              To begin selling on Boson, create a profile and a seller account
              in the steps below. The information you provide here is public and
              accessible on IPFS. Please provide business information only.
            </div>
            <div>Do not include personal information.</div>
          </>
        )}
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
            {dirty || forceDirty || touched.coverPicture
              ? "Save & continue"
              : "Next"}
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

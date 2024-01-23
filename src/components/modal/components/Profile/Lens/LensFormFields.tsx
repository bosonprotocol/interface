import { ReactNode } from "react";

import { FormField, Input } from "../../../../form";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { ProfileFormFields } from "../ProfileFormFields";

interface Props {
  onBlurName?: () => void;
  logoSubtitle?: string;
  coverSubtitle?: string;
  disableHandle?: boolean;
  disableLogo?: boolean;
  disableCover?: boolean;
  disableName?: boolean;
  disableDescription?: boolean;
  children?: ReactNode;
}

export default function LensFormFields({
  onBlurName,
  logoSubtitle,
  coverSubtitle,
  disableHandle,
  disableLogo,
  disableCover,
  disableName,
  disableDescription,
  children
}: Props) {
  return (
    <>
      <Grid
        justifyContent="space-between"
        alignItems="center"
        margin="0 0 2rem 0"
        flex="1"
      >
        <Typography fontSize="2rem" fontWeight="600">
          Lens profile
        </Typography>
        <div>{children}</div>
      </Grid>
      <ProfileFormFields
        onBlurName={onBlurName}
        logoSubtitle={logoSubtitle}
        coverSubtitle={coverSubtitle}
        handleComponent={
          <FormField title="Lens Handle" required>
            <Input
              name="handle"
              placeholder="Handle"
              disabled={disableHandle}
            />
          </FormField>
        }
        disableCover={disableCover}
        disableLogo={disableLogo}
        disableDescription={disableDescription}
        disableName={disableName}
      />
    </>
  );
}

import { FormField, Input } from "../../../../form";
import { ProfileFormFields } from "../ProfileFormFields";

interface Props {
  onBlurName?: () => void;
  logoSubtitle?: string;
  coverSubtitle?: string;
  disableHandle?: boolean;
  disableLogo?: boolean;
  disableCover?: boolean;
}

export default function LensFormFields({
  onBlurName,
  logoSubtitle,
  coverSubtitle,
  disableHandle,
  disableLogo,
  disableCover
}: Props) {
  return (
    <ProfileFormFields
      onBlurName={onBlurName}
      logoSubtitle={logoSubtitle}
      coverSubtitle={coverSubtitle}
      handleComponent={
        <FormField title="Lens Handle" required>
          <Input name="handle" placeholder="Handle" disabled={disableHandle} />
        </FormField>
      }
      disableCover={disableCover}
      disableLogo={disableLogo}
    />
  );
}

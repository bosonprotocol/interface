import { websitePattern } from "../../../../../lib/validation/regex/url";
import { FormField, Input, Textarea, Upload } from "../../../../form";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";

export default function CreateYourProfileForm() {
  const { nextIsDisabled } = useCreateForm();
  return (
    <>
      <FormField
        title="Logo / profile picture"
        subTitle="Upload a profile image with a max. size of 600Kb"
        required
      >
        <Upload name="createYourProfile.logo" withUpload />
      </FormField>
      <FormField title="Your brand / name" required>
        <Input name="createYourProfile.name" placeholder="Name" />
      </FormField>
      <FormField title="Contact e-Mail" required>
        <Input
          name="createYourProfile.email"
          placeholder="e-Mail"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
      </FormField>
      <FormField title="Description" required>
        <Textarea name="createYourProfile.description" placeholder="Describe" />
      </FormField>
      <FormField
        title="Website / Social media link"
        subTitle="Put your most frequently used online channel in here. Use the URL for Social media."
        style={{
          marginBottom: 0
        }}
        required
      >
        <Input
          name="createYourProfile.website"
          placeholder="www.example.com OR www.instagram.com/example"
          pattern={websitePattern}
        />
      </FormField>
      <Grid margin="2rem 0 0 0">
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={nextIsDisabled}
        >
          Next
        </BosonButton>
      </Grid>
    </>
  );
}

import { Formik } from "formik";

import { websitePattern } from "../../../../../lib/validation/regex/url";
import { FormField, Input, Textarea, Upload } from "../../../../form";
import { CreateYourProfile as CreateYourProfileType } from "../../../../product/utils";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import Button from "../../../../ui/Button";
import { createYourProfileValidationSchema } from "./validationSchema";

interface Props {
  initial: CreateYourProfileType;
  onSubmit: (createValues: CreateYourProfileType) => void;
}

export default function CreateYourProfile({ initial, onSubmit }: Props) {
  const { nextIsDisabled } = useCreateForm();

  return (
    <Formik<CreateYourProfileType>
      validationSchema={createYourProfileValidationSchema}
      initialValues={initial}
      onSubmit={onSubmit}
    >
      <FormField
        title="Logo / profile picture"
        subTitle="Upload a profile image with a max. size of 600Kb"
        required
      >
        <Upload name="createYourProfile.logo" />
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
      >
        <Input
          name="createYourProfile.website"
          placeholder="www.example.com OR www.instagram.com/example"
          pattern={websitePattern}
        />
      </FormField>

      <Button theme="primary" type="submit" disabled={nextIsDisabled}>
        Next
      </Button>
    </Formik>
  );
}

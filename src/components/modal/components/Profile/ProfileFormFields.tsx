import { ReactNode } from "react";

import { websitePattern } from "../../../../lib/validation/regex/url";
import { FormField, Input, Textarea, Upload } from "../../../form";

interface Props {
  onBlurName?: () => void;
  logoSubtitle?: string;
  coverSubtitle?: string;
  handleComponent?: ReactNode;
  disableLogo?: boolean;
  disableCover?: boolean;
}

export function ProfileFormFields({
  onBlurName,
  logoSubtitle,
  coverSubtitle,
  handleComponent: HandleComponent,
  disableLogo,
  disableCover
}: Props) {
  return (
    <>
      <FormField
        title="Logo / profile picture"
        subTitle={logoSubtitle}
        required
      >
        <Upload
          name="logo"
          multiple={false}
          disabled={disableLogo}
          withUpload
        />
      </FormField>
      <FormField title="Cover picture" subTitle={coverSubtitle} required>
        <Upload
          name="coverPicture"
          multiple={false}
          disabled={disableCover}
          withUpload
        />
      </FormField>
      <FormField title="Your brand / name" required>
        <Input name="name" placeholder="Name" onBlur={onBlurName} />
      </FormField>
      {HandleComponent}
      <FormField title="Contact E-Mail" required>
        <Input
          name="email"
          placeholder="e-Mail"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
      </FormField>
      <FormField title="Description" required>
        <Textarea name="description" placeholder="Describe" />
      </FormField>
      <FormField
        title="Website / Social media link"
        subTitle="Put your most frequently used online channel in here. Use the URL for Social media."
        required
      >
        <Input
          name="website"
          placeholder="www.example.com OR www.instagram.com/example"
          pattern={websitePattern}
        />
      </FormField>
      <FormField
        title="Legal trading name"
        subTitle="Input your legal trading name under which you will be selling items. This information is used for the contractual agreement underlying your exchanges."
      >
        <Input name="legalTradingName" placeholder="Polly Seller UK ltd." />
      </FormField>
    </>
  );
}

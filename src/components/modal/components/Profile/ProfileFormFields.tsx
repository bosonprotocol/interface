import { ReactNode } from "react";

import { websitePattern } from "../../../../lib/validation/regex/url";
import { FormField, Input, Select, Textarea, Upload } from "../../../form";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../product/utils";

interface Props {
  onBlurName?: () => void;
  logoSubtitle?: string;
  coverSubtitle?: string;
  handleComponent?: ReactNode;
  disableLogo?: boolean;
  disableCover?: boolean;
  disableName?: boolean;
  disableDescription?: boolean;
}

export function ProfileFormFields({
  onBlurName,
  logoSubtitle,
  coverSubtitle,
  handleComponent: HandleComponent,
  disableLogo,
  disableCover,
  disableName,
  disableDescription
}: Props) {
  return (
    <>
      <FormField
        title="Logo / Profile picture"
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
        <Input
          name="name"
          placeholder="Name"
          onBlur={onBlurName}
          disabled={disableName}
        />
      </FormField>
      {HandleComponent}
      <FormField title="Description" required>
        <Textarea
          name="description"
          placeholder="Describe"
          disabled={disableDescription}
        />
      </FormField>
      <FormField title="Contact email" required>
        <Input
          name="email"
          placeholder="email"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        />
      </FormField>
      <FormField
        title="Website / Social media link"
        subTitle="Add a website or the link to your most frequently used social media here."
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
      <FormField
        title="Communication method"
        required
        subTitle="The buyer's delivery address will be sent to you via the dApp's chat function (XMTP). For further communication, like sending tracking IDs or receiving inquiries from buyers about their order status, specify your preference: continuing on XMTP (chat) or switching to email."
      >
        <Select
          placeholder="Choose a communication channel..."
          name="contactPreference"
          options={OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE}
        />
      </FormField>
    </>
  );
}
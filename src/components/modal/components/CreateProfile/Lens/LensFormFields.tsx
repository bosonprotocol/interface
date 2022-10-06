import { websitePattern } from "../../../../../lib/validation/regex/url";
import { FormField, Input, Textarea, Upload } from "../../../../form";

interface Props {
  disable: boolean;
  onBlurName?: () => void;
}

export default function LensFormFields({ disable, onBlurName }: Props) {
  return (
    <>
      <FormField
        title="Logo / profile picture"
        subTitle="Upload a profile image with a max. size of 300Kb"
        required
      >
        <Upload name="logo" multiple={false} disabled={disable} />
      </FormField>
      <FormField
        title="Cover picture"
        subTitle="Upload a profile image with a max. size of 300Kb"
        required
      >
        <Upload name="coverPicture" multiple={false} disabled={disable} />
      </FormField>
      <FormField title="Your brand / name" required>
        <Input
          name="name"
          placeholder="Name"
          disabled={disable}
          onBlur={onBlurName}
        />
      </FormField>
      <FormField title="Lens Handle" required>
        <Input name="handle" placeholder="Handle" disabled={disable} />
      </FormField>
      <FormField title="Contact E-Mail" required>
        <Input
          name="email"
          placeholder="e-Mail"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          disabled={disable}
        />
      </FormField>
      <FormField title="Description" required>
        <Textarea
          name="description"
          placeholder="Describe"
          disabled={disable}
        />
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
          disabled={disable}
        />
      </FormField>
      <FormField
        title="Legal trading name"
        subTitle="Input your legal trading name under which you will be selling items. This information is used for the contractual agreement underlying your exchanges."
        required
      >
        <Input
          name="legalTradingName"
          placeholder="Polly Seller UK ltd."
          disabled={disable}
        />
      </FormField>
    </>
  );
}

import { useFormikContext } from "formik";
import { ReactNode } from "react";
import { useAccount } from "wagmi";

import { getIpfsGatewayUrl } from "../../../../lib/utils/ipfs";
import { websitePattern } from "../../../../lib/validation/regex/url";
import { FormField, Input, Select, Textarea, Upload } from "../../../form";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../product/utils";
import GridContainer from "../../../ui/GridContainer";
import { ProfilePreview } from "./ProfilePreview";

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
  const { address = "" } = useAccount();
  const { values } = useFormikContext<CreateProfile>();
  const profileImage = getIpfsGatewayUrl(values.logo?.[0]?.src ?? "");
  const coverPicture = values.coverPicture?.[0];
  const defaultPositionArray = coverPicture?.position
    ?.replaceAll("px", "")
    .split(" ")
    .map((n) => Number.parseFloat(n));
  const defaultPosition = defaultPositionArray
    ? { x: defaultPositionArray?.[0] ?? 0, y: defaultPositionArray?.[1] ?? 0 }
    : undefined;
  return (
    <>
      <GridContainer
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
      >
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
            withEditor
            borderRadius={100}
            width={200}
            height={200}
          />
        </FormField>
        <FormField
          title="Cover picture"
          titleIcon={
            <ProfilePreview
              address={address}
              profileImage={profileImage}
              metadataCoverImage={coverPicture}
              defaultIsObjectFitContain={coverPicture?.fit === "contain"}
              defaultPosition={defaultPosition}
              draggable
            />
          }
          subTitle={coverSubtitle}
          required
        >
          <Upload
            name="coverPicture"
            multiple={false}
            disabled={disableCover}
            withUpload
            withEditor
            imgPreviewStyle={{ objectFit: "contain" }}
            wrapperProps={{ style: { width: "100%" } }}
          />
        </FormField>
      </GridContainer>
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
          placeholder="Tell people more about your brand"
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
        title="Ongoing communication method"
        subTitle={
          <>
            First-time Communication: Initially, the buyer's delivery address
            will always be sent to you via the dApp's chat function (XMTP).
            <br></br>
            Ongoing communication: Please choose between - continuing on chat
            (XMTP) or switching to email. (Used for sending tracking IDs or
            receiving inquiries from buyers about their order status.)
          </>
        }
        required
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

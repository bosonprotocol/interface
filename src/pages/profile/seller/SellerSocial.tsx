import { Globe } from "phosphor-react";

import DetailShare from "../../../components/detail/DetailShare";
import { getLensWebsite } from "../../../components/modal/components/CreateProfile/Lens/utils";
import {
  Profile,
  ProfileFieldsFragment
} from "../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../lib/validation/regex/url";
import {
  DetailShareWrapper,
  SocialIcon,
  SocialIconContainer
} from "../ProfilePage.styles";

interface RenderSocialProps {
  href: string;
  icon: React.ReactNode | JSX.Element;
  disabled?: boolean;
}
function RenderSocial({
  href,
  disabled = false,
  icon: Icon
}: RenderSocialProps) {
  return (
    <SocialIcon href={href} $isDisabled={disabled} target="_blank">
      {Icon ? Icon : <Globe size={24} />}
    </SocialIcon>
  );
}

interface Props {
  sellerLens: ProfileFieldsFragment;
}
export default function SellerSocial({ sellerLens }: Props) {
  const website = getLensWebsite(sellerLens as Profile);
  const lensUrl = website ? preAppendHttps(website) || false : false;
  return (
    <SocialIconContainer>
      {/* TODO: Removed as we don't have discord in lens profile */}
      {/* <RenderSocial icon={DiscordLogo} href={""} /> */}
      {lensUrl !== false && (
        <RenderSocial icon={<Globe size={24} />} href={lensUrl} />
      )}
      <DetailShareWrapper>
        <DetailShare />
      </DetailShareWrapper>
    </SocialIconContainer>
  );
}

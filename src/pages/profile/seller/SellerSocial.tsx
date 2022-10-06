import { Globe } from "phosphor-react";

import DetailShare from "../../../components/detail/DetailShare";
import { AttributeData } from "../../../lib/utils/hooks/lens/types/profile-metadata";
import {
  DetailShareWrapper,
  SocialIcon,
  SocialIconContainer
} from "../ProfilePage.styles";

interface RenderSocialProps {
  href: string;
  icon: any;
  disabled?: boolean;
}
function RenderSocial({
  href,
  disabled = false,
  icon: Icon
}: RenderSocialProps) {
  return (
    <SocialIcon href={href} $isDisabled={disabled}>
      {Icon ? <Icon size={24} /> : <Globe size={24} />}
    </SocialIcon>
  );
}

interface Props {
  sellerLens: any;
}
export default function SellerSocial({ sellerLens }: Props) {
  const lensUrl =
    sellerLens?.attributes?.find((a: AttributeData) => a?.key === "website") ||
    false;
  return (
    <SocialIconContainer>
      {/* TODO: Removed as we don't have discord in lens profile */}
      {/* <RenderSocial icon={DiscordLogo} href={""} /> */}
      {lensUrl !== false && <RenderSocial icon={Globe} href={lensUrl?.value} />}
      <DetailShareWrapper>
        <DetailShare />
      </DetailShareWrapper>
    </SocialIconContainer>
  );
}

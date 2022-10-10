import { Globe } from "phosphor-react";

import DetailShare from "../../../components/detail/DetailShare";
import { ProfileFieldsFragment } from "../../../lib/utils/hooks/lens/graphql/generated";
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
    <SocialIcon href={href} $isDisabled={disabled}>
      {Icon ? Icon : <Globe size={24} />}
    </SocialIcon>
  );
}

interface Props {
  sellerLens: ProfileFieldsFragment;
}
export default function SellerSocial({ sellerLens }: Props) {
  const lensUrl =
    sellerLens?.attributes?.find((a) => a?.key === "website") || false;
  return (
    <SocialIconContainer>
      {/* TODO: Removed as we don't have discord in lens profile */}
      {/* <RenderSocial icon={DiscordLogo} href={""} /> */}
      {lensUrl !== false && (
        <RenderSocial icon={<Globe size={24} />} href={lensUrl?.value} />
      )}
      <DetailShareWrapper>
        <DetailShare />
      </DetailShareWrapper>
    </SocialIconContainer>
  );
}

import { Globe } from "phosphor-react";
import { useEffect, useState } from "react";

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
import OpenSeaLogo, { getOpenSeaUrl } from "./OpenSeaLogo";

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
  const [openSeaUrl, setOpenSeaUrl] = useState<string | null>(null);
  const website = getLensWebsite(sellerLens as Profile);
  const lensUrl = website ? preAppendHttps(website) || false : false;

  useEffect(() => {
    if (openSeaUrl === null) {
      getOpenSeaUrl(sellerLens).then((value) => {
        if (value) {
          setOpenSeaUrl(value as string);
        }
      });
    }
  }, [openSeaUrl, sellerLens]);

  return (
    <SocialIconContainer>
      {openSeaUrl && <RenderSocial icon={<OpenSeaLogo />} href={openSeaUrl} />}
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

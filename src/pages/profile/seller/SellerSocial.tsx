import { AuthTokenType, subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { Globe } from "phosphor-react";
import { useEffect, useState } from "react";

import DetailShare from "../../../components/detail/DetailShare";
import { getLensWebsite } from "../../../components/modal/components/Profile/Lens/utils";
import { ProfileFieldsFragment } from "../../../lib/utils/hooks/lens/graphql/generated";
import { sanitizeUrl } from "../../../lib/utils/url";
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
    <SocialIcon
      href={href}
      $isDisabled={disabled}
      target="_blank"
      rel="noopener noreferrer"
    >
      {Icon ? Icon : <Globe size={24} />}
    </SocialIcon>
  );
}

interface Props {
  sellerLens?: ProfileFieldsFragment | undefined;
  seller: subgraph.SellerFieldsFragment | undefined;
  voucherCloneAddress?: string;
}
export default function SellerSocial({
  sellerLens,
  seller,
  voucherCloneAddress
}: Props) {
  const { config } = useConfigContext();
  const [openSeaUrl, setOpenSeaUrl] = useState<string | null>(null);
  const useLens = seller?.authTokenType === AuthTokenType.LENS;

  const website = useLens
    ? sellerLens
      ? getLensWebsite(sellerLens)
      : null
    : seller?.metadata?.website;
  const websiteToShow = website ? preAppendHttps(website) || false : false;
  const { envName } = config;
  useEffect(() => {
    if (openSeaUrl === null && voucherCloneAddress) {
      getOpenSeaUrl(voucherCloneAddress, envName).then((value) => {
        if (value) {
          setOpenSeaUrl(value as string);
        }
      });
    }
  }, [openSeaUrl, voucherCloneAddress, envName]);

  return (
    <SocialIconContainer>
      {openSeaUrl && <RenderSocial icon={<OpenSeaLogo />} href={openSeaUrl} />}
      {/* TODO: Removed as we don't have discord in lens profile */}
      {/* <RenderSocial icon={DiscordLogo} href={""} /> */}
      {websiteToShow !== false && (
        <RenderSocial
          icon={<Globe size={24} />}
          href={sanitizeUrl(websiteToShow)}
        />
      )}
      <DetailShareWrapper>
        <DetailShare />
      </DetailShareWrapper>
    </SocialIconContainer>
  );
}

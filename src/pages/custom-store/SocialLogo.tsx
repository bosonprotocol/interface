import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MediumLogo,
  PinterestLogo,
  RedditLogo,
  SnapchatLogo,
  TiktokLogo,
  TwitchLogo,
  TwitterLogo,
  YoutubeLogo
} from "phosphor-react";

export type SocialLogoValues =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "medium"
  | "pinterest"
  | "reddit"
  | "snapchat"
  | "tiktok"
  | "twitch"
  | "twitter"
  | "youtube";

interface Props {
  logo: SocialLogoValues | undefined | null;
}

export default function SocialLogo({ logo }: Props) {
  switch (logo) {
    case "facebook":
      return <FacebookLogo />;
    case "instagram":
      return <InstagramLogo />;
    case "linkedin":
      return <LinkedinLogo />;
    case "medium":
      return <MediumLogo />;
    case "pinterest":
      return <PinterestLogo />;
    case "reddit":
      return <RedditLogo />;
    case "snapchat":
      return <SnapchatLogo />;
    case "tiktok":
      return <TiktokLogo />;
    case "twitch":
      return <TwitchLogo />;
    case "twitter":
      return <TwitterLogo />;
    case "youtube":
      return <YoutubeLogo />;
    default:
      return null;
  }
}

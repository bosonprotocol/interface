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
  size?: number;
}

export default function SocialLogo({ logo, size }: Props) {
  switch (logo) {
    case "facebook":
      return <FacebookLogo size={size} />;
    case "instagram":
      return <InstagramLogo size={size} />;
    case "linkedin":
      return <LinkedinLogo size={size} />;
    case "medium":
      return <MediumLogo size={size} />;
    case "pinterest":
      return <PinterestLogo size={size} />;
    case "reddit":
      return <RedditLogo size={size} />;
    case "snapchat":
      return <SnapchatLogo size={size} />;
    case "tiktok":
      return <TiktokLogo size={size} />;
    case "twitch":
      return <TwitchLogo size={size} />;
    case "twitter":
      return <TwitterLogo size={size} />;
    case "youtube":
      return <YoutubeLogo size={size} />;
    default:
      return null;
  }
}

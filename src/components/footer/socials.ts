import {
  TbBrandDiscord,
  TbBrandGithub,
  TbBrandTelegram,
  TbBrandTwitter,
  TbBrandYoutube
} from "react-icons/tb";

import { SocialRoutes } from "../../lib/routing/routes";

export const SOCIALS = [
  {
    name: "twitter",
    logo: TbBrandTwitter,
    url: SocialRoutes.Twitter
  },
  {
    name: "discord",
    logo: TbBrandDiscord,
    url: SocialRoutes.Discord
  },
  {
    name: "telegram",
    logo: TbBrandTelegram,
    url: SocialRoutes.Telegram
  },
  {
    name: "youtube",
    logo: TbBrandYoutube,
    url: SocialRoutes.Youtube
  },
  {
    name: "github",
    logo: TbBrandGithub,
    url: SocialRoutes.Github
  }
];

import {
  TbBrandDiscord,
  TbBrandGithub,
  TbBrandTelegram,
  TbBrandTwitter,
  TbBrandYoutube
} from "react-icons/tb";

import { BosonRoutes, SocialRoutes } from "../../lib/routing/routes";

export const SOCIAL_ROUTES = [
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

export const PRODUCT_ROUTES = [
  {
    name: "Explore",
    url: BosonRoutes.Explore
  },
  {
    name: "Create",
    url: BosonRoutes.CreateOffer
  }
];

export const NAVIGATION_ROUTES = [
  {
    name: "Explore",
    url: BosonRoutes.Explore
  },
  {
    name: "Create",
    url: BosonRoutes.CreateOffer
  },
  {
    name: "Profile",
    url: BosonRoutes.YourAccount
  },
  {
    name: "Custom Storefront",
    url: BosonRoutes.CreateStorefront
  }
];

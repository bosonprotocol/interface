import {
  TbBrandDiscord,
  TbBrandGithub,
  TbBrandMedium,
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
    name: "medium",
    logo: TbBrandMedium,
    url: SocialRoutes.Medium
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
    name: "Sell",
    url: BosonRoutes.Sell
  }
];

export const NAVIGATION_ROUTES = [
  {
    name: "Profile",
    url: BosonRoutes.YourAccount
  },
  {
    name: "Custom Storefront",
    url: BosonRoutes.CreateStorefront
  }
];

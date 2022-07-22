import {
  DiscordLogo,
  GithubLogo,
  MediumLogo,
  TwitterLogo,
  YoutubeLogo
} from "phosphor-react";

import { BosonRoutes, SocialRoutes } from "../../lib/routing/routes";

export const SOCIAL_ROUTES = [
  {
    name: "twitter",
    logo: TwitterLogo,
    url: SocialRoutes.Twitter
  },
  {
    name: "discord",
    logo: DiscordLogo,
    url: SocialRoutes.Discord
  },
  {
    name: "medium",
    logo: MediumLogo,
    url: SocialRoutes.Medium
  },
  {
    name: "youtube",
    logo: YoutubeLogo,
    url: SocialRoutes.Youtube
  },
  {
    name: "github",
    logo: GithubLogo,
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
  },
  {
    name: "Chat",
    url: BosonRoutes.Chat
  }
];

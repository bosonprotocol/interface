import {
  DiscordLogo,
  GithubLogo,
  MediumLogo,
  TwitterLogo,
  YoutubeLogo
} from "phosphor-react";
import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
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
    url: generatePath(BosonRoutes.SellerCenter, {
      [UrlParameters.sellerPage]: "dashboard"
    })
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

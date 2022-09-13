import {
  DiscordLogo,
  GithubLogo,
  MediumLogo,
  TwitterLogo,
  YoutubeLogo
} from "phosphor-react";
import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
import {
  BosonRoutes,
  SellerCenterRoutes,
  SocialRoutes
} from "../../lib/routing/routes";
import { DEFAULT_SELLER_PAGE } from "./../seller/SellerPages";

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

export const getProductRoutes = ({
  isSupportFunctionalityDefined,
  onlyBuyer,
  onlySeller
}: {
  isSupportFunctionalityDefined: boolean;
  onlyBuyer: boolean;
  onlySeller: boolean;
}) => {
  const productRoutes: { name: string; url: string }[] = [];
  if (
    !isSupportFunctionalityDefined ||
    (isSupportFunctionalityDefined && !onlySeller)
  ) {
    productRoutes.push({
      name: "Explore",
      url: BosonRoutes.Explore
    });
  }

  if (
    !isSupportFunctionalityDefined ||
    (isSupportFunctionalityDefined && (!onlyBuyer || onlySeller))
  ) {
    productRoutes.push({
      name: "Sell",
      url: generatePath(SellerCenterRoutes.SellerCenter, {
        [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
      })
    });
  }
  return productRoutes;
};

export const getNavigationRoutes = ({
  isSupportFunctionalityDefined,
  onlySeller
}: {
  isSupportFunctionalityDefined: boolean;
  onlySeller: boolean;
}) => {
  if (isSupportFunctionalityDefined && onlySeller) {
    return [
      {
        name: "Custom Storefront",
        url: BosonRoutes.CreateStorefront
      },
      {
        name: "Chat",
        url: BosonRoutes.Chat
      }
    ];
  }

  return [
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
    },
    {
      name: "Dispute Center",
      url: BosonRoutes.DisputeCenter
    }
  ];
};

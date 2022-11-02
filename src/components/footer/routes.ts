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
import { UserRoles } from "../../router/routes";
import { checkIfUserHaveRole } from "../../router/useUserRoles";
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

export const ADDITIONAL_LINKS: Array<{ label: string; value: string }> = [
  {
    label: "Privacy Policy",
    value: BosonRoutes.PrivacyPolicy
  },
  {
    label: "Terms & Conditions",
    value: BosonRoutes.TermsAndConditions
  }
];

export const getProductRoutes = ({
  roles,
  isSellerInCurationList,
  isSupportFunctionalityDefined,
  onlyBuyer,
  onlySeller
}: {
  roles: string[];
  isSellerInCurationList: boolean;
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
    if (checkIfUserHaveRole(roles, [UserRoles.Seller], false)) {
      if (isSellerInCurationList) {
        productRoutes.push({
          name: "Sell",
          url: generatePath(SellerCenterRoutes.SellerCenter, {
            [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
          })
        });
      } else {
        productRoutes.push({
          name: "Sell",
          url: BosonRoutes.ClosedBeta
        });
      }
    } else if (checkIfUserHaveRole(roles, [UserRoles.Guest], false)) {
      productRoutes.push({
        name: "Sell",
        url: SellerCenterRoutes.CreateProduct
      });
    }
  }
  return productRoutes;
};
export const getNavigationRoutes = ({
  roles,
  isSupportFunctionalityDefined,
  onlySeller
}: {
  roles: string[];
  isSupportFunctionalityDefined: boolean;
  onlySeller: boolean;
}) => {
  if (isSupportFunctionalityDefined && onlySeller) {
    return [
      {
        name: "Custom Storefront",
        url: BosonRoutes.CreateStorefront
      },
      checkIfUserHaveRole(
        roles,
        [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver],
        false
      ) && {
        name: "Chat",
        url: BosonRoutes.Chat
      }
    ].filter((n) => n);
  }

  return [
    checkIfUserHaveRole(roles, [UserRoles.Buyer, UserRoles.Seller], false) && {
      name: "Profile",
      url: BosonRoutes.YourAccount
    },
    {
      name: "Custom Storefront",
      url: BosonRoutes.CreateStorefront
    },
    checkIfUserHaveRole(
      roles,
      [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver],
      false
    ) && {
      name: "Chat",
      url: BosonRoutes.Chat
    },
    checkIfUserHaveRole(
      roles,
      [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver],
      false
    ) && {
      name: "Dispute Center",
      url: BosonRoutes.DisputeCenter
    }
  ].filter((n) => n);
};

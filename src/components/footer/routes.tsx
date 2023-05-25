import {
  DiscordLogo,
  GithubLogo,
  MediumLogo,
  TwitterLogo,
  YoutubeLogo
} from "phosphor-react";
import { ReactElement } from "react";
import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
import {
  BosonRoutes,
  SellerCenterRoutes,
  SocialRoutes
} from "../../lib/routing/routes";
import { isTruthy } from "../../lib/types/helpers";
import { UserRoles } from "../../router/routes";
import { checkIfUserHaveRole } from "../../router/useUserRoles";
import { DEFAULT_SELLER_PAGE } from "../seller/SellerPages";
import ViewTxButton from "../transactions/ViewTxButton";

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

export const getShopRoutes = ({
  roles,
  isSupportFunctionalityDefined,
  hasExchangesAsABuyer,
  onlySeller
}: {
  roles: (keyof typeof UserRoles)[];
  isSupportFunctionalityDefined: boolean;
  hasExchangesAsABuyer: boolean;
  onlySeller: boolean;
}) => {
  const isAccountBuyer = roles.some((role) => role === UserRoles.Buyer);
  const productRoutes: (
    | {
        name: string;
        url: string;
      }
    | { component: (props?: Record<string, unknown>) => ReactElement }
  )[] = [];
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
    (!isSupportFunctionalityDefined ||
      (isSupportFunctionalityDefined && !onlySeller)) &&
    isAccountBuyer &&
    hasExchangesAsABuyer
  ) {
    productRoutes.push({
      name: "View Exchanges",
      url: BosonRoutes.YourAccount
    });
  }
  if (
    !isSupportFunctionalityDefined ||
    (isSupportFunctionalityDefined && !onlySeller)
  ) {
    productRoutes.push({
      component: (props) => (
        <ViewTxButton {...props}>View Transactions</ViewTxButton>
      )
    });
  }
  return productRoutes;
};

export const getSellRoutes = ({
  roles,
  isSupportFunctionalityDefined,
  sellerId,
  onlyBuyer,
  onlySeller
}: {
  roles: (keyof typeof UserRoles)[];
  sellerId: string;
  isSupportFunctionalityDefined: boolean;
  onlyBuyer: boolean;
  onlySeller: boolean;
}) => {
  const isAccountSeller = roles.some((role) => role === UserRoles.Seller);
  const productRoutes: { name: string; url: string }[] = [];

  productRoutes.push({
    name: "Create Products",
    url: SellerCenterRoutes.CreateProduct
  });
  if (
    (!isSupportFunctionalityDefined ||
      (isSupportFunctionalityDefined && (!onlyBuyer || onlySeller))) &&
    isAccountSeller
  ) {
    productRoutes.push({
      name: "Seller Center",
      url: generatePath(SellerCenterRoutes.SellerCenter, {
        [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
      })
    });
  }
  if (
    (!isSupportFunctionalityDefined ||
      (isSupportFunctionalityDefined && (!onlyBuyer || onlySeller))) &&
    isAccountSeller &&
    sellerId
  ) {
    productRoutes.push({
      name: "Seller Profile",
      url: generatePath(BosonRoutes.SellerPage, {
        [UrlParameters.sellerId]: sellerId
      })
    });
  }
  return productRoutes;
};
export const getHelpLinks = ({
  roles,
  hasExchangesAsBuyerOrSeller
}: {
  roles: string[];
  hasExchangesAsBuyerOrSeller: boolean;
}) => {
  return [
    checkIfUserHaveRole(roles, [UserRoles.Buyer, UserRoles.Seller], false) &&
      hasExchangesAsBuyerOrSeller && {
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
  ].filter(isTruthy);
};

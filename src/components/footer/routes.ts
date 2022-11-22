import {
  DiscordLogo,
  GithubLogo,
  MediumLogo,
  TwitterLogo,
  YoutubeLogo
} from "phosphor-react";

import { BosonRoutes, SocialRoutes } from "../../lib/routing/routes";
import { getSellLink } from "../../lib/utils/link";
import { UserRoles } from "../../router/routes";
import { checkIfUserHaveRole } from "../../router/useUserRoles";

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
  address,
  isSupportFunctionalityDefined,
  onlyBuyer,
  onlySeller
}: {
  roles: (keyof typeof UserRoles)[];
  address: string | undefined;
  isSupportFunctionalityDefined: boolean;
  onlyBuyer: boolean;
  onlySeller: boolean;
}) => {
  const isAccountSeller = roles.some((role) => role === UserRoles.Seller);
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
    const sellLink = getSellLink({
      isAccountSeller,
      address
    });
    productRoutes.push({
      name: "Sell",
      url: sellLink
    });
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

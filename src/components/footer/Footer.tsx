import { CSSProperties, useMemo, useState } from "react";
import styled from "styled-components";

import logo from "../../../src/assets/logo-white.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { isTruthy } from "../../lib/types/helpers";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { sanitizeUrl } from "../../lib/utils/url";
import { AdditionalFooterLink } from "../../pages/custom-store/AdditionalFooterLinksTypes";
import {
  ContactInfoLinkIcon,
  ContactInfoLinkIconValues
} from "../../pages/custom-store/ContactInfoLinkIcon";
import SocialLogo, {
  SocialLogoValues
} from "../../pages/custom-store/SocialLogo";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import useUserRoles from "../../router/useUserRoles";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Layout from "../Layout";
import Grid from "../ui/Grid";
import GridContainer from "../ui/GridContainer";
import Typography from "../ui/Typography";
import {
  ADDITIONAL_LINKS,
  getHelpLinks,
  getSellRoutes,
  getShopRoutes,
  SOCIAL_ROUTES
} from "./routes";

const Footer = styled.footer<{ padding?: CSSProperties["padding"] }>`
  width: 100%;
  background-color: var(--footerBgColor);
  color: var(--footerTextColor);

  padding: ${({ padding }) => padding || "4rem 1rem 2rem 1rem"};
  margin-top: auto;
`;

const LogoGrid = styled(Grid)`
  flex-direction: column;
  > a {
    margin-bottom: 4rem;
  }
  margin-top: 4rem;
  ${breakpoint.xs} {
    margin-top: 0;
    > a {
      margin-bottom: 0rem;
    }
    flex-direction: row;
  }
`;
const CustomGridContainer = styled.div`
  display: grid;
  white-space: pre;

  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.xs} {
    margin-left: auto;
    grid-template-columns: repeat(2, max-content);
    grid-column-gap: 4rem;
  }
  ${breakpoint.s} {
    grid-template-columns: repeat(3, max-content);
    grid-column-gap: 4rem;
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(3, max-content);
    grid-column-gap: 4rem;
  }
  ${breakpoint.l} {
    grid-template-columns: repeat(3, max-content);
    grid-column-gap: 4rem;
  }
  ${breakpoint.xl} {
    grid-template-columns: repeat(3, max-content);
    grid-column-gap: 4rem;
  }
`;

const StyledGridContainer = styled(GridContainer)`
  ${breakpoint.xxs} {
    width: 100%;
    margin: 0 !important;
  }

  ${breakpoint.xs} {
    margin-left: auto !important;
    width: auto;
  }
  ${breakpoint.s} {
    margin-left: auto !important;
    width: 80%;
  }
  ${breakpoint.l} {
    width: 68%;
  }
  ${breakpoint.xl} {
    width: 62%;
  }
`;

interface INavigationLinks {
  flexDirection?: "row" | "column";
  gap?: string;
}

const NavigationLinks = styled.nav<INavigationLinks>`
  display: flex;
  gap: ${({ gap }) => gap || "16px"};
  flex-wrap: wrap;
  align-items: self-start;
  max-width: 100%;
  justify-content: center;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};

  a {
    cursor: pointer;
    text-decoration: none;
    color: var(--footerTextColor);
  }
  a:hover {
    color: var(--accent);
  }

  ${breakpoint.xs} {
    max-width: 125px;
  }
  ${breakpoint.s} {
    max-width: 300px;
  }
`;
const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

function Socials() {
  const { isXXS, isLteS } = useBreakpoints();
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const socialMediaLinks = useCustomStoreQueryParameter<
    { value: SocialLogoValues; url: string }[]
  >("socialMediaLinks", { parseJson: true });
  const renderSocialLinks = useMemo(() => {
    if (isCustomStoreFront && typeof socialMediaLinks !== "string") {
      return socialMediaLinks.map(({ url, value }) => {
        return (
          <a
            href={sanitizeUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            key={`social_nav_${value}_${url}`}
          >
            <SocialLogo logo={value} size={15} />
          </a>
        );
      });
    } else if (!isCustomStoreFront) {
      return SOCIAL_ROUTES.map(({ name, url, logo: Logo }) => (
        <a href={url} target="_blank" rel="noopener" key={`social_nav_${name}`}>
          <Logo size={isLteS && !isXXS ? 20 : 32} weight="regular" />
        </a>
      ));
    }
    return null;
  }, [isCustomStoreFront, isLteS, isXXS, socialMediaLinks]);
  return renderSocialLinks?.length ? (
    <div>
      <Typography $fontSize="1rem" fontWeight="600" tag="p">
        FOLLOW US
      </Typography>
      <NavigationLinks
        gap={isLteS && !isXXS ? "16px" : "32px"}
        style={{ justifyContent: "flex-start" }}
      >
        {renderSocialLinks}
      </NavigationLinks>
    </div>
  ) : null;
}

function ContactInfoLinks() {
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const contactInfoLinks = useCustomStoreQueryParameter<
    { value: ContactInfoLinkIconValues; text: string }[]
  >("contactInfoLinks", { parseJson: true });
  const renderContactInfoLinks = useMemo(() => {
    if (isCustomStoreFront && typeof contactInfoLinks !== "string") {
      return contactInfoLinks.map(({ text, value }) => {
        if (value === "address") {
          return (
            <Grid justifyContent="flex-start" gap="1rem" key={value}>
              <ContactInfoLinkIcon icon={value} size={15} /> {text}
            </Grid>
          );
        }
        if (value === "email") {
          return (
            <Grid justifyContent="flex-start" gap="1rem" key={value}>
              <ContactInfoLinkIcon icon={value} size={15} />
              <a
                href={"mailto:" + sanitizeUrl(text)}
                target="_blank"
                rel="noopener noreferrer"
                key={`contact_info_link_${value}_${text}`}
              >
                {text}
              </a>
            </Grid>
          );
        }
        if (value === "phone") {
          return (
            <Grid justifyContent="flex-start" gap="1rem" key={value}>
              <ContactInfoLinkIcon icon={value} size={15} />
              <a
                href={"tel:" + sanitizeUrl(text)}
                target="_blank"
                rel="noopener noreferrer"
                key={`contact_info_link_${value}_${text}`}
              >
                {text}
              </a>
            </Grid>
          );
        }
        return null;
      });
    }
    return null;
  }, [isCustomStoreFront, contactInfoLinks]);
  return renderContactInfoLinks?.length ? (
    <div>
      <Typography $fontSize="1rem" fontWeight="600" tag="p">
        GET IN TOUCH
      </Typography>
      <NavigationLinks
        flexDirection="column"
        gap={"0"}
        style={{ alignItems: "center", justifyContent: "flex-end" }}
      >
        {renderContactInfoLinks}
      </NavigationLinks>
    </div>
  ) : null;
}

function CustomStoreAdditionalLinks() {
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const additionalFooterLinks = useCustomStoreQueryParameter<
    AdditionalFooterLink[]
  >("additionalFooterLinks", { parseJson: true });
  const renderAdditionalLinks = useMemo(() => {
    if (isCustomStoreFront && typeof additionalFooterLinks !== "string") {
      return additionalFooterLinks.map(({ label, value, url }, index) => {
        return (
          <a
            key={`${label}-${value}-${index}`}
            href={sanitizeUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        );
      });
    }
    return null;
  }, [isCustomStoreFront, additionalFooterLinks]);
  return renderAdditionalLinks?.length ? (
    <div>
      <Typography $fontSize="1rem" fontWeight="600" tag="p">
        CLIENT SERVICE
      </Typography>
      <NavigationLinks
        flexDirection="column"
        gap={"0"}
        style={{ alignItems: "flex-start", justifyContent: "flex-end" }}
      >
        {renderAdditionalLinks}
      </NavigationLinks>
    </div>
  ) : null;
}

function ByBoson() {
  return (
    <Grid justifyContent="center">
      <Typography $fontSize="0.8rem">Powered by Boson</Typography>
    </Grid>
  );
}

export default function ({ withFooter }: { withFooter: boolean }) {
  const showFooterValue = useCustomStoreQueryParameter("showFooter");
  const showFooter = ["", "true"].includes(showFooterValue) && withFooter;
  return showFooter ? (
    <FullFooter />
  ) : (
    <Footer padding="2rem 1rem">
      <ByBoson />
    </Footer>
  );
}

function FullFooter() {
  const { roles, sellerId, buyerId } = useUserRoles({ role: [] });
  const { data: sellerExchanges } = useExchanges(
    { sellerId, disputed: null },
    {
      enabled: !!sellerId
    }
  );
  const { data: buyerExchanges } = useExchanges(
    { buyerId, disputed: null },
    {
      enabled: !!buyerId
    }
  );
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const [year] = useState<number>(new Date().getFullYear());
  const logoUrl = useCustomStoreQueryParameter("logoUrl");
  const copyright = useCustomStoreQueryParameter("copyright");
  const supportFunctionality = useCustomStoreQueryParameter<
    ("buyer" | "seller" | "dr")[]
  >("supportFunctionality", { parseJson: true });
  const isSupportFunctionalityDefined = supportFunctionality !== "";
  const onlyBuyer =
    typeof supportFunctionality != "string" &&
    supportFunctionality?.length === 1 &&
    supportFunctionality?.[0] === "buyer";
  const onlySeller =
    typeof supportFunctionality != "string" &&
    supportFunctionality?.length === 1 &&
    supportFunctionality?.[0] === "seller";
  const hasExchangesAsABuyer = !!buyerExchanges?.length;
  const hasExchangesAsASeller = !!sellerExchanges?.length;
  const hasExchangesAsBuyerOrSeller =
    hasExchangesAsABuyer || hasExchangesAsASeller;
  const shopLinks = getShopRoutes({
    roles,
    isSupportFunctionalityDefined,
    onlySeller,
    hasExchangesAsABuyer
  }).reduce<JSX.Element[]>((acc, nav) => {
    if (nav) {
      if ("url" in nav && nav.url && nav.name) {
        acc.push(
          <LinkWithQuery to={nav.url} key={`shop_nav_${nav.name}`}>
            {nav.name}
          </LinkWithQuery>
        );
      } else if ("component" in nav && nav.component) {
        acc.push(
          nav.component({
            key: "view-transactions"
          })
        );
      }
    }
    return acc;
  }, []);
  const sellLinks = getSellRoutes({
    roles,
    sellerId,
    isSupportFunctionalityDefined,
    onlyBuyer,
    onlySeller
  }).reduce<JSX.Element[]>((acc, nav) => {
    if (
      nav &&
      ((isCustomStoreFront && nav.name !== "Sell") || !isCustomStoreFront)
    ) {
      acc.push(
        <LinkWithQuery to={nav.url} key={`sell_nav_${nav.name}`}>
          {nav.name}
        </LinkWithQuery>
      );
    }
    return acc;
  }, []);
  const helpLinks = getHelpLinks({
    roles,
    hasExchangesAsBuyerOrSeller
  })
    .map((nav) => {
      if (nav) {
        if (nav.url) {
          return (
            <LinkWithQuery to={nav.url} key={`navigation_nav_${nav.name}`}>
              {nav.name}
            </LinkWithQuery>
          );
        }
        if (nav.email) {
          return (
            <a
              href={"mailto:" + sanitizeUrl(nav.email)}
              target="_blank"
              rel="noopener noreferrer"
              key={`help_email`}
            >
              {nav.name}
            </a>
          );
        }
      }
    })
    .filter(isTruthy);
  return (
    <Footer>
      <Layout>
        <LogoGrid alignItems="flex-start" padding="0 0 2rem 0">
          <LinkWithQuery to={BosonRoutes.Root}>
            <LogoImg
              src={logoUrl || logo}
              alt="Boson Protocol"
              data-testid="logo"
            />
          </LinkWithQuery>
          {isCustomStoreFront ? (
            <GridContainer
              itemsPerRow={{
                xs: 1,
                s: 2,
                m: 2,
                l: 2,
                xl: 2
              }}
              columnGap="12rem"
              rowGap="2rem"
            >
              <CustomStoreAdditionalLinks />
              <GridContainer
                itemsPerRow={{
                  xs: 1,
                  s: 1,
                  m: 1,
                  l: 1,
                  xl: 1
                }}
              >
                <div>
                  <Grid justifyContent="flex-start">
                    <ContactInfoLinks />
                  </Grid>
                </div>
                <div>
                  <Grid justifyContent="flex-start">
                    <Socials />
                  </Grid>
                </div>
              </GridContainer>
            </GridContainer>
          ) : (
            <GridContainer
              itemsPerRow={{
                xs: 1,
                s: 1,
                m: 1,
                l: 1,
                xl: 1
              }}
              style={{ width: "100%" }}
            >
              <CustomGridContainer>
                {!!shopLinks.length && (
                  <div>
                    <Typography tag="h5">Shop</Typography>
                    <NavigationLinks
                      flexDirection="column"
                      gap={"0"}
                      style={{ width: "fit-content" }}
                    >
                      {shopLinks}
                    </NavigationLinks>
                  </div>
                )}
                {!!sellLinks.length && (
                  <div>
                    <Typography tag="h5">Sell</Typography>
                    <NavigationLinks
                      flexDirection="column"
                      gap={"0"}
                      style={{ width: "fit-content" }}
                    >
                      {sellLinks}
                    </NavigationLinks>
                  </div>
                )}
                {!!helpLinks.length && (
                  <div>
                    <Typography tag="h5">Help</Typography>
                    <NavigationLinks
                      flexDirection="column"
                      gap={"0"}
                      style={{ width: "fit-content" }}
                    >
                      {helpLinks}
                    </NavigationLinks>
                  </div>
                )}
              </CustomGridContainer>
              <Grid justifyContent="flex-end">
                <Socials />
              </Grid>
            </GridContainer>
          )}
        </LogoGrid>

        <Grid padding="2rem 0 0 0" justifyContent="flex-end" gap="1rem">
          <>
            {!isCustomStoreFront && (
              <NavigationLinks>
                {ADDITIONAL_LINKS.map((footerLink, index) => {
                  return (
                    <LinkWithQuery
                      to={footerLink.value}
                      key={`${footerLink.label}-${footerLink.value}-${index}`}
                    >
                      {footerLink.label}
                    </LinkWithQuery>
                  );
                })}
              </NavigationLinks>
            )}
          </>
        </Grid>
        <Grid justifyContent="center">
          <Typography $fontSize="0.8rem">
            {isCustomStoreFront ? copyright : `© ${year} Bosonapp.io`}
          </Typography>
        </Grid>
        {isCustomStoreFront && <ByBoson />}
      </Layout>
    </Footer>
  );
}

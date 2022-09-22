import { useState } from "react";
import styled from "styled-components";

import logo from "../../../src/assets/logo-white.svg";
import { BosonRoutes, ExternalRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import SocialLogo, {
  SocialLogoValues
} from "../../pages/custom-store/SocialLogo";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import useUserRoles from "../../router/useUserRoles";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Layout from "../Layout";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { getNavigationRoutes, getProductRoutes, SOCIAL_ROUTES } from "./routes";

const Footer = styled.footer`
  width: 100%;
  background-color: var(--footerBgColor);
  color: var(--footerTextColor);

  padding: 4rem 1rem 2rem 1rem;
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
const NavigationGrid = styled(Grid)`
  gap: 5rem;
  padding: 0 2rem 2rem 0;

  ${breakpoint.xs} {
    gap: 5rem;
    padding: 0 0rem 2rem 0;
  }
  ${breakpoint.m} {
    gap: 10rem;
    padding: 0 6rem 2rem 0;
  }
  ${breakpoint.l} {
    gap: 15rem;
    padding: 0 8rem 2rem 0;
  }
  ${breakpoint.xl} {
    gap: 15rem;
    padding: 0 10rem 2rem 0;
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
  const socialMediaLinks = useCustomStoreQueryParameter<
    { value: SocialLogoValues; url: string }[]
  >("socialMediaLinks", { parseJson: true });
  return (
    <NavigationLinks gap={isLteS && !isXXS ? "16px" : "32px"}>
      {typeof socialMediaLinks !== "string" ? (
        <>
          {socialMediaLinks.map(({ url, value }) => {
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener"
                key={`social_nav_${value}_${url}`}
              >
                <SocialLogo logo={value} />
              </a>
            );
          })}
        </>
      ) : (
        <>
          {SOCIAL_ROUTES.map(({ name, url, logo: Logo }) => (
            <a
              href={url}
              target="_blank"
              rel="noopener"
              key={`social_nav_${name}`}
            >
              <Logo size={isLteS && !isXXS ? 20 : 32} weight="regular" />
            </a>
          ))}
        </>
      )}
    </NavigationLinks>
  );
}

export default function FooterComponent() {
  const { roles } = useUserRoles({ role: [] });
  const { isXXS } = useBreakpoints();
  const [year] = useState<number>(new Date().getFullYear());
  const logoUrl = useCustomStoreQueryParameter("logoUrl");
  const copyright = useCustomStoreQueryParameter("copyright");
  const additionalFooterLinks = useCustomStoreQueryParameter<
    { label: string; value: string }[]
  >("additionalFooterLinks", { parseJson: true });
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
          <NavigationGrid
            justifyContent={isXXS ? "flex-start" : "flex-end"}
            alignItems="flex-start"
          >
            <div>
              <Typography tag="h5">Product</Typography>
              <NavigationLinks flexDirection="column">
                {getProductRoutes({
                  roles,
                  isSupportFunctionalityDefined,
                  onlyBuyer,
                  onlySeller
                }).map(
                  (nav) =>
                    nav && (
                      <LinkWithQuery
                        to={nav.url}
                        key={`product_nav_${nav.name}`}
                      >
                        {nav.name}
                      </LinkWithQuery>
                    )
                )}
              </NavigationLinks>
            </div>
            <div>
              <Typography tag="h5">Navigation</Typography>
              <NavigationLinks flexDirection="column">
                {getNavigationRoutes({
                  roles,
                  isSupportFunctionalityDefined,
                  onlySeller
                }).map(
                  (nav) =>
                    nav && (
                      <LinkWithQuery
                        to={nav.url}
                        key={`navigation_nav_${nav.name}`}
                      >
                        {nav.name}
                      </LinkWithQuery>
                    )
                )}
              </NavigationLinks>
            </div>
          </NavigationGrid>
        </LogoGrid>
        {isXXS && (
          <Grid justifyContent="center">
            <Socials />
          </Grid>
        )}
        <Grid padding="2rem 0 0 0">
          <Typography tag="p">
            {copyright ? copyright : `© ${year} Boson Protocol`}
          </Typography>
          {!isXXS && <Socials />}
          <>
            {typeof additionalFooterLinks !== "string" ? (
              <NavigationLinks>
                {additionalFooterLinks.map((footerLink, index) => {
                  return (
                    <a
                      key={`${footerLink.label}-${footerLink.value}-${index}`}
                      href={footerLink.value}
                      target="_blank"
                      style={{ textAlign: "center" }}
                    >
                      {footerLink.label}
                    </a>
                  );
                })}
              </NavigationLinks>
            ) : (
              <NavigationLinks>
                {!isSupportFunctionalityDefined ||
                  (isSupportFunctionalityDefined && !onlySeller && (
                    <>
                      <LinkWithQuery to={BosonRoutes.Root}>Home</LinkWithQuery>
                      <LinkWithQuery to={BosonRoutes.Explore}>
                        Explore
                      </LinkWithQuery>
                      <LinkWithQuery to={ExternalRoutes.TermsOfUse}>
                        Terms of use
                      </LinkWithQuery>
                    </>
                  ))}
              </NavigationLinks>
            )}
          </>
        </Grid>
      </Layout>
    </Footer>
  );
}

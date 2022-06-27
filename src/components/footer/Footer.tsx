import { useState } from "react";
import styled from "styled-components";

import logo from "../../../src/assets/logo-white.svg";
import { BosonRoutes, ExternalRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { NAVIGATION_ROUTES, PRODUCT_ROUTES, SOCIAL_ROUTES } from "./routes";

const Footer = styled.footer`
  width: 100%;
  background-color: ${colors.black};
  color: ${colors.white};

  padding: 2rem 1rem;
`;

interface INavigationLinks {
  flexDirection?: "row" | "column";
  gap?: string;
}

const NavigationLinks = styled.nav<INavigationLinks>`
  display: flex;
  gap: ${({ gap }) => gap || "16px"};
  align-items: self-start;
  justify-content: flex-end;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};

  a {
    cursor: pointer;
    text-decoration: none;
    color: ${colors.white};
  }
  a:hover {
    color: ${colors.primary};
  }
`;
const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

export default function FooterComponent() {
  const { isLteS } = useBreakpoints();
  const [year] = useState<number>(new Date().getFullYear());
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  return (
    <Footer>
      <Layout>
        <Grid alignItems="flex-start" padding="0 0 50px 0">
          <LogoImg data-testid="logo" src={logoUrl || logo} />
          <div>
            <Typography tag="h5">Product</Typography>
            <NavigationLinks flexDirection="column">
              {PRODUCT_ROUTES.map(({ name, url }) => (
                <LinkWithQuery to={url} key={`product_nav_${name}`}>
                  {name}
                </LinkWithQuery>
              ))}
            </NavigationLinks>
          </div>
          <div>
            <Typography tag="h5">Navigation</Typography>
            <NavigationLinks flexDirection="column">
              {NAVIGATION_ROUTES.map(({ name, url }) => (
                <LinkWithQuery to={url} key={`navigation_nav_${name}`}>
                  {name}
                </LinkWithQuery>
              ))}
            </NavigationLinks>
          </div>
        </Grid>
        <Grid padding="50px 0 0">
          <Typography tag="p">© {year} Boson Protocol</Typography>
          {!isLteS && (
            <NavigationLinks gap="32px">
              {SOCIAL_ROUTES.map(({ name, url, logo: Logo }) => (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  key={`social_nav_${name}`}
                >
                  <Logo size={32} />
                </a>
              ))}
            </NavigationLinks>
          )}
          <NavigationLinks>
            <LinkWithQuery to={BosonRoutes.Root}>Home</LinkWithQuery>
            <LinkWithQuery to={BosonRoutes.Explore}>Explore</LinkWithQuery>
            <LinkWithQuery to={ExternalRoutes.TermsOfUse}>
              Terms of use
            </LinkWithQuery>
          </NavigationLinks>
        </Grid>
      </Layout>
    </Footer>
  );
}

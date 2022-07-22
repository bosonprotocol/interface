import { useState } from "react";
import styled from "styled-components";

import logo from "../../../src/assets/logo-white.svg";
import { BosonRoutes, ExternalRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
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
  align-items: self-start;
  justify-content: flex-end;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};

  a {
    cursor: pointer;
    text-decoration: none;
    color: ${colors.white};
  }
  a:hover {
    color: var(--primary);
  }
`;
const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

function Socials() {
  const { isXXS, isLteS } = useBreakpoints();
  return (
    <NavigationLinks gap={isLteS && !isXXS ? "16px" : "32px"}>
      {SOCIAL_ROUTES.map(({ name, url, logo: Logo }) => (
        <a href={url} target="_blank" rel="noopener" key={`social_nav_${name}`}>
          <Logo size={isLteS && !isXXS ? 20 : 32} weight="regular" />
        </a>
      ))}
    </NavigationLinks>
  );
}

export default function FooterComponent() {
  const { isXXS } = useBreakpoints();
  const [year] = useState<number>(new Date().getFullYear());
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  return (
    <Footer>
      <Layout>
        {isXXS && (
          <Grid justifyContent="center">
            <Socials />
          </Grid>
        )}
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
          </NavigationGrid>
        </LogoGrid>
        <Grid padding="2rem 0 0 0">
          <Typography tag="p">© {year} Boson Protocol</Typography>
          {!isXXS && <Socials />}
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

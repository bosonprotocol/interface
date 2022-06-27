import { useState } from "react";
import styled from "styled-components";

import logo from "../../../src/assets/logo-white.svg";
import { BosonRoutes, ExternalRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import Button from "../ui/Button";
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

const TitleWrapper = styled(Grid)`
  flex: 1;
`;
const InputWrapper = styled(Grid)`
  flex: 1;
  background: white;
  padding: 1rem;
  gap: 1rem;
`;
const Input = styled.input`
  width: 100%;
  font-size: 16px;
  border: 0px solid ${colors.border};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  // transition: all 300ms ease-in-out;
  &:focus {
    outline: none;
    // box-shadow: inset 0px 0px 0px 2px ${colors.secondary};
  }
`;

export default function FooterComponent() {
  const { isPhone, isTablet } = useBreakpoints();
  const [year] = useState<number>(new Date().getFullYear());
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  return (
    <Footer>
      <Layout>
        <Grid
          padding="0 0 50px 0"
          flexDirection={isPhone || isTablet ? "column" : "row"}
        >
          <TitleWrapper alignItems="flex-start" flexDirection="column">
            <Typography tag="h2" style={{ margin: "10px 0" }}>
              Sign up for updates
            </Typography>
            <Typography tag="p">
              We'll send you fresh news about our platform, including
              <br />
              new features and opportunities for the community.
            </Typography>
          </TitleWrapper>
          <InputWrapper>
            <Input
              data-testid="sign-up-to-newsletter"
              placeholder="Input your email address"
            />
            <Button
              onClick={() => {
                console.log("test");
              }}
              size="small"
            >
              Sign up
            </Button>
          </InputWrapper>
        </Grid>
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
          {!isPhone && (
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

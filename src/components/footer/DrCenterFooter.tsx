import { CSSProperties, useMemo } from "react";
import styled from "styled-components";

import logo from "../../../src/assets/logo-white.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { ViewMode } from "../../lib/viewMode";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Layout from "../layout/Layout";
import { getSellerCenterPath } from "../seller/paths";
import { Grid } from "../ui/Grid";
import { GridContainer } from "../ui/GridContainer";
import { Typography } from "../ui/Typography";
import { ViewModeLink } from "../viewMode/ViewMode";
import { ADDITIONAL_LINKS_DR_CENTER, SOCIAL_ROUTES } from "./routes";

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
    color: ${colors.white};
  }
  a:hover {
    color: ${colors.violet};
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

const anchorProps = {
  target: "_blank",
  rel: "noopener noreferrer"
} as const;
const AbsoluteAnchor = styled.a.attrs(anchorProps)``;

function Socials() {
  const { isXXS, isLteS } = useBreakpoints();
  const renderSocialLinks = useMemo(() => {
    return SOCIAL_ROUTES.map(({ name, url, logo: Logo }) => (
      <a href={url} target="_blank" rel="noopener" key={`social_nav_${name}`}>
        <Logo size={isLteS && !isXXS ? 20 : 32} weight="regular" />
      </a>
    ));
  }, [isLteS, isXXS]);
  return renderSocialLinks?.length ? (
    <div>
      <NavigationLinks
        gap={isLteS && !isXXS ? "16px" : "32px"}
        style={{ justifyContent: "flex-start" }}
      >
        {renderSocialLinks}
      </NavigationLinks>
    </div>
  ) : null;
}

export const DrCenterFooter: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <Footer>
      <Layout>
        <LogoGrid alignItems="flex-start" padding="0 0 2rem 0">
          <LinkWithQuery to={BosonRoutes.Root}>
            <LogoImg src={logo} alt="Boson Protocol" data-testid="logo" />
          </LinkWithQuery>
          <NavigationLinks
            flexDirection="column"
            gap={"0"}
            style={{ width: "fit-content" }}
          >
            <AbsoluteAnchor href="https://www.bosonprotocol.io/">
              Boson Protocol
            </AbsoluteAnchor>
            <ViewModeLink
              {...anchorProps}
              href={BosonRoutes.Root}
              destinationViewMode={ViewMode.DAPP}
            >
              Boson App
            </ViewModeLink>
            <ViewModeLink
              {...anchorProps}
              href={getSellerCenterPath("Dashboard")}
              destinationViewMode={ViewMode.DAPP}
            >
              Seller Hub
            </ViewModeLink>
            <AbsoluteAnchor href="mailto:info@bosonapp.io">Help</AbsoluteAnchor>
          </NavigationLinks>
        </LogoGrid>
        <GridContainer
          style={{ padding: "2rem 0 0 0" }}
          columnGap="1rem"
          rowGap="1rem"
          itemsPerRow={{
            xs: 2,
            s: 3,
            m: 3,
            l: 3,
            xl: 3
          }}
        >
          <Typography fontSize="0.8rem">
            Copyright © {year} Boson Protocol. All rights reserved.
          </Typography>
          <Socials />
          <NavigationLinks style={{ flex: "1" }}>
            {ADDITIONAL_LINKS_DR_CENTER.map((footerLink, index) => {
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
        </GridContainer>
      </Layout>
    </Footer>
  );
};

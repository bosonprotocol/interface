import { useBreakpoints } from "lib/utils/hooks/useBreakpoints";
import { ArrowLineLeft, ArrowLineRight, WarningCircle } from "phosphor-react";
import { ReactNode, useCallback, useState } from "react";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { SellerCenterRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Grid from "../ui/Grid";
import { WithSellerDataProps } from "./common/WithSellerData";
import { SellerInsideProps } from "./SellerInside";
import { sellerPageTypes } from "./SellerPages";

const ArrowContainer = styled.div`
  display: grid;
  align-items: center;
  margin: 0.5rem 0.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  aspect-ratio: 1;
  box-sizing: content-box;
  width: 16px;
  height: 16px;
  :hover {
    background-color: ${colors.lightGrey};
  }
`;

const Aside = styled.aside`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  background: ${colors.white};
  .label {
    transition: all 200ms;
    width: 7.5em;
  }
  &.collapsed .label {
    opacity: 0;
    width: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    min-height: 100vh;
    li {
      height: 4.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      border-top: 1px solid ${colors.border};
      &:last-child {
        border-bottom: 1px solid ${colors.border};
      }
    }
  }
`;

const AsideLink = styled.li<{ $active?: boolean }>`
  background: ${(props) => (props.$active ? colors.border : colors.white)};
  div {
    color: ${colors.black};
  }
  svg:first-child {
    fill: ${(props) => (props.$active ? colors.secondary : colors.black)};
    width: 1.5rem;
    height: 1.5rem;
  }
  a {
    padding-left: 1.5625rem;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 1rem;
  }
`;

export default function SellerAside(
  props: SellerInsideProps & WithSellerDataProps
) {
  const { [UrlParameters.sellerPage]: sellerPage } = useParams();
  const { isLteXS } = useBreakpoints();
  const [collapsed, setCollapsed] = useState(isLteXS);

  const handleUrl = useCallback((path: string, externalPath: string | null) => {
    if (externalPath !== null) {
      return generatePath(externalPath);
    }

    return generatePath(SellerCenterRoutes.SellerCenter, {
      [UrlParameters.sellerPage]: path
    });
  }, []);
  const IconContainer = useCallback(
    ({ children }: { children: ReactNode }) => {
      return collapsed ? (
        <Grid
          flexDirection="column"
          alignItems="center"
          flexGrow="0"
          flexShrink="1"
          flexBasis="0"
        >
          {children}
        </Grid>
      ) : (
        <>{children}</>
      );
    },
    [collapsed]
  );
  return (
    <Aside className={collapsed ? "collapsed" : ""}>
      <ArrowContainer>
        {collapsed ? (
          <ArrowLineRight
            weight="light"
            size={16}
            onClick={() => setCollapsed(false)}
          />
        ) : (
          <ArrowLineLeft
            weight="light"
            size={16}
            onClick={() => setCollapsed(true)}
          />
        )}
      </ArrowContainer>
      <ul>
        {Object.keys(sellerPageTypes).map((key: string) => {
          const {
            label,
            url,
            externalPath,
            icon: Icon
          } = sellerPageTypes[key as keyof typeof sellerPageTypes];
          const isActive = sellerPage === url;
          props.offersBacked.displayWarning = true;
          const showWarning =
            label === "Finances" && props.offersBacked.displayWarning;
          return (
            <AsideLink key={`seller_aside_route_${label}`} $active={isActive}>
              <LinkWithQuery to={handleUrl(url, externalPath)}>
                <Grid
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="1rem"
                >
                  <IconContainer>
                    <Icon
                      size={16}
                      weight={isActive ? "regular" : "thin"}
                      color={isActive ? colors.black : colors.darkGrey}
                    />
                    {collapsed && showWarning && (
                      <WarningCircle size={16} color={colors.orange} />
                    )}
                  </IconContainer>
                  <span className="label">{label}</span>
                  {!collapsed && showWarning && (
                    <WarningCircle
                      size={16}
                      color={colors.orange}
                      style={{ marginRight: "0.5rem" }}
                    />
                  )}
                </Grid>
              </LinkWithQuery>
            </AsideLink>
          );
        })}
      </ul>
    </Aside>
  );
}

import { useCallback } from "react";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { DisputeResolverCenterRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import { Grid } from "../ui/Grid";
import { drPageTypes } from "./DisputeResolver";

const Aside = styled.aside`
  background: ${colors.white};
  ul {
    width: 14.375rem;
    position: fixed;
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
    fill: ${(props) => (props.$active ? colors.violet : colors.black)};
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

export default function DRAside() {
  const { [UrlParameters.disputeResolverPageId]: disputeResolverPage } =
    useParams();

  const handleUrl = useCallback((path: string) => {
    return generatePath(DisputeResolverCenterRoutes.DisputeResolverCenter, {
      [UrlParameters.disputeResolverPageId]: path
    });
  }, []);

  return (
    <Aside>
      <ul>
        {Object.keys(drPageTypes).map((key: string) => {
          const {
            label,
            url,
            icon: Icon
          } = drPageTypes[key as keyof typeof drPageTypes];
          const isActive = disputeResolverPage === url;
          return (
            <AsideLink
              key={`dispute_resolver_aside_route_${label}`}
              $active={isActive}
            >
              <LinkWithQuery to={handleUrl(url)}>
                <Grid
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="1rem"
                >
                  <Icon
                    size={16}
                    weight={isActive ? "regular" : "thin"}
                    color={isActive ? colors.black : colors.greyDark}
                  />
                  {label}
                </Grid>
              </LinkWithQuery>
            </AsideLink>
          );
        })}
      </ul>
    </Aside>
  );
}

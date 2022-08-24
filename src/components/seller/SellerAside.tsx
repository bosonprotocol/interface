import { useCallback } from "react";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import Grid from "../ui/Grid";
import { sellerPageTypes } from "./SellerPages";

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
  svg {
    fill: ${(props) => (props.$active ? colors.secondary : colors.black)};
    // margin-right: 1.1875rem;
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

export default function SellerAside() {
  const { [UrlParameters.sellerPage]: sellerPage } = useParams();

  const handleUrl = useCallback((path: string) => {
    return generatePath(BosonRoutes.SellerCenter, {
      [UrlParameters.sellerPage]: path
    });
  }, []);

  return (
    <Aside>
      <ul>
        {Object.keys(sellerPageTypes).map((key: string) => {
          const {
            label,
            url,
            icon: Icon
          } = sellerPageTypes[key as keyof typeof sellerPageTypes];
          const isActive = sellerPage === url;

          return (
            <AsideLink key={`seller_aside_route_${label}`} $active={isActive}>
              <LinkWithQuery to={handleUrl(url)}>
                <Grid
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="1rem"
                >
                  <Icon
                    size={16}
                    weight={isActive ? "regular" : "thin"}
                    color={isActive ? colors.black : colors.darkGrey}
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

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
  padding: 1rem;
  background: ${colors.white};
  ul {
    position: fixed;
    top: 6.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }
    }
  }
`;

const AsideLink = styled.li<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? colors.secondary : colors.black)};
  div {
    color: ${(props) => (props.$active ? colors.secondary : colors.black)};
  }
  svg {
    fill: ${(props) => (props.$active ? colors.secondary : colors.black)};
  }
  a {
    all: none;
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
          const { label, url, icon } =
            sellerPageTypes[key as keyof typeof sellerPageTypes];
          return (
            <AsideLink
              key={`seller_aside_route_${label}`}
              $active={sellerPage === url}
            >
              <LinkWithQuery to={handleUrl(url)}>
                <Grid
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="0.5rem"
                >
                  {icon}
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

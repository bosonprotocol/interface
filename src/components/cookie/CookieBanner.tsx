import { Button } from "@bosonprotocol/react-kit";
import { useCallback, useState } from "react";
import styled from "styled-components";

import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../lib/utils/hooks/localstorage/useLocalStorage";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";

const StyledCookie = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  > div {
    position: relative;
    z-index: ${zIndex.Cookie};
    background-color: ${colors.white};
    color: ${colors.black};
    padding: 2rem;
  }
  &:before {
    content: "";
    position: absolute;
    top: -100vh;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: ${zIndex.Cookie - 1};
    background-color: ${colors.black}80;
  }

  button {
    color: ${colors.white};
  }
`;

export default function CookieBanner({ isDapp }: { isDapp: boolean }) {
  const cookiesStorageKey = isDapp ? "showCookies" : "showCookiesDrCenter";
  const [show, setShow] = useState<boolean>(
    getItemFromStorage(cookiesStorageKey, true)
  );

  const handleOkey = useCallback(() => {
    setShow(false);
    saveItemInStorage(cookiesStorageKey, false);
  }, [setShow, cookiesStorageKey]);

  if (!show) {
    return null;
  }

  return (
    <StyledCookie>
      <Grid gap="2rem">
        <Typography fontWeight="400" $fontSize="1rem" lineHeight="1.5rem">
          <span>
            This website uses cookies to improve user experience. By using our
            website you consent to all cookies in accordance with our&nbsp;
            <LinkWithQuery
              to={
                isDapp
                  ? BosonRoutes.PrivacyPolicy
                  : DrCenterRoutes.PrivacyPolicy
              }
              style={{ textAlign: "center" }}
            >
              Privacy&nbsp;Policy
            </LinkWithQuery>
            &nbsp;and agree to be bound by our&nbsp;
            <LinkWithQuery
              to={
                isDapp
                  ? BosonRoutes.TermsAndConditions
                  : DrCenterRoutes.TermsAndConditions
              }
              style={{ textAlign: "center" }}
            >
              Terms&nbsp;and&nbsp;Conditions
            </LinkWithQuery>
            .
          </span>
        </Typography>
        <Button variant="accentFill" onClick={handleOkey}>
          Okay
        </Button>
      </Grid>
    </StyledCookie>
  );
}

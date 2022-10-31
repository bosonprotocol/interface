import { Button } from "@bosonprotocol/react-kit";
import { useCallback, useState } from "react";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../lib/utils/hooks/useLocalStorage";
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

export default function CookieBanner() {
  const [show, setShow] = useState<boolean>(
    getItemFromStorage("showCookies", true)
  );

  const handleOkey = useCallback(() => {
    setShow(false);
    saveItemInStorage("showCookies", false);
  }, [setShow]);

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
            <a
              href={BosonRoutes.PrivacyPolicy}
              target="_blank"
              style={{ textAlign: "center" }}
            >
              Privacy&nbsp;Policy
            </a>
            &nbsp;and agree to be bound by our&nbsp;
            <a
              href={BosonRoutes.TermsAndConditions}
              target="_blank"
              style={{ textAlign: "center" }}
            >
              Terms&nbsp;and&nbsp;Conditions
            </a>
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

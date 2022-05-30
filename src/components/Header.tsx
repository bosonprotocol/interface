import logo from "@assets/logo.png";
import { BosonRoutes, routes } from "@lib/routing/routes";
import { colors } from "@lib/styles/colors";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React, { useEffect, useReducer, useState } from "react";
import { usePopper } from "react-popper";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Layout from "./Layout";
import { reactRouterV6Instrumentation } from "./SentryReactRouterV6RouterInstrumentation";
import { ReactComponent as SettingsSvg } from "./settings.svg";

const HeaderContainer = styled(Layout)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto 20px auto;
`;

const NavigationLinks = styled.nav`
  display: flex;
  gap: 16px;
  width: 100%;
  justify-content: flex-end;

  a {
    all: unset;
    cursor: pointer;
  }
  a:hover {
    color: ${colors.green};
  }
`;

const LogoImg = styled.img`
  width: 227px;
  height: 50px;
  padding-top: 24px;
  cursor: pointer;
`;

const SettingsSvgIcon = styled(SettingsSvg)`
  :hover * {
    stroke: ${colors.green};
  }
  :hover {
    cursor: pointer;
  }
`;

const DropdownItem = styled.div`
  background: ${colors.navy};
  margin-top: 10px;
  color: ${colors.white};
  padding: 15px;
  border: 1px solid ${colors.lightgrey};
`;

const Input = styled.input`
  padding: 10px 8px;
  border-radius: 5px;
  font-size: 16px;
  margin: 0 5px;
  min-width: 280px;
  max-width: 100%;
`;

const SaveButton = styled.button`
  width: 50px;
  padding: 10px 2px;
  background: ${colors.green};
  color: ${colors.black};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const Error = styled.span`
  color: ${colors.darkred};
`;

export default function Header() {
  const navigate = useNavigate();
  const [sentryTracingUrl, setSentryTracingUrl] = useState<string>("");
  const [tracingUrl, setTracingUrl] = useState<string>("");
  const [sentryError, setSentryError] = useState<string>("");

  const [referenceElement, setReferenceElement] =
    useState<SVGSVGElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }]
  });
  const [isDropdownVisible, toggleDropdownVisibility] = useReducer(
    (state) => !state,
    false
  );

  useEffect(() => {
    try {
      Sentry.init({
        dsn: sentryTracingUrl,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: reactRouterV6Instrumentation(routes, true)
          })
        ],
        tracesSampleRate: 1.0
      });
      setSentryError("");
    } catch (err) {
      setSentryError((err as { message: string }).message || "Invalid url");
    }
  }, [sentryTracingUrl]);

  return (
    <HeaderContainer>
      <LogoImg
        data-testid="logo"
        src={logo}
        onClick={() => navigate(BosonRoutes.Root)}
      />
      <NavigationLinks>
        <Link to={BosonRoutes.Root}>Home</Link>
        <Link to={BosonRoutes.Explore}>Explore</Link>
        <Link to={BosonRoutes.CreateOffer}>Create Offer</Link>

        <SettingsSvgIcon
          height="22px"
          data-testid="settings"
          ref={setReferenceElement}
          onClick={() => toggleDropdownVisibility()}
        />
        <DropdownItem
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          hidden={!isDropdownVisible}
          data-testid="header-dropdown"
        >
          <div>
            Tracing Endpoint:{" "}
            <Input
              type="text"
              placeholder="https://XXX@YYY.ingest.sentry.io/123"
              value={tracingUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTracingUrl(e.target.value)
              }
            />
            <SaveButton onClick={() => setSentryTracingUrl(tracingUrl)}>
              Save
            </SaveButton>
          </div>
          <Error data-testid="error">{sentryError}</Error>
          <div ref={setArrowElement} style={styles.arrow} />
        </DropdownItem>
      </NavigationLinks>
    </HeaderContainer>
  );
}

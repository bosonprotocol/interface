import logo from "@assets/logo.png";
import { CONFIG } from "@lib/config";
import { BosonRoutes, routes } from "@lib/routing/routes";
import { colors } from "@lib/styles/colors";
import { useLocalStorage } from "@lib/utils/hooks/useLocalStorage";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React, { useEffect, useReducer, useState } from "react";
import { usePopper } from "react-popper";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Layout from "./Layout";
import { ReactComponent as SaveIcon } from "./save.svg";
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
  box-shadow: 1px 3px 5px ${colors.lightgrey};
`;

const TracingInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px 8px;
  border-radius: 5px;
  font-size: 16px;
  margin: 0 5px;
  min-width: 280px;
  max-width: 100%;
`;

const SaveButton = styled(SaveIcon)`
  width: 25px;
  height: 20px;
  padding: 10px;
  background: ${colors.green};
  color: ${colors.black};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  :hover + [data-testid="tooltip"] {
    visibility: initial;
  }
`;

const Error = styled.span`
  color: ${colors.darkred};
`;

const SaveButtonTooltip = styled.div`
  color: ${colors.black};
  background: ${colors.white};
  padding: 10px;
  border-radius: 4px;
  visibility: hidden;
  margin-top: 2px;
  max-width: 200px;
`;

const TooltipArrow = styled.div`
  ::before {
    content: " ";
    width: 10px;
    height: 10px;
    background: white;
    position: relative;
    transform: rotate(45deg);
    top: -10px;
    display: inline-block;
  }
  position: relative;
  top: 0;
  width: 10px;
  height: 10px;
`;

export default function Header() {
  const navigate = useNavigate();
  const [sentryTracingUrl, setSentryTracingUrl] = useLocalStorage<string>(
    "tracing-url",
    ""
  );
  const [tracingUrl, setTracingUrl] = useState<string>(sentryTracingUrl);
  const [sentryError, setSentryError] = useState<string>("");

  const [referenceElement, setReferenceElement] =
    useState<SVGSVGElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start"
  });
  const [saveButtonReference, setSaveButtonReference] =
    useState<SVGSVGElement | null>(null);
  const [saveButtonPopper, setSaveButtonPopper] =
    useState<HTMLDivElement | null>(null);
  const [saveButtonArrow, setSaveButtonArrow] = useState<HTMLDivElement | null>(
    null
  );
  const {
    styles: saveButtonStyles,
    attributes: saveButtonAttributes,
    update: saveButtonUpdate
  } = usePopper(saveButtonReference, saveButtonPopper, {
    placement: "bottom-start",
    modifiers: [{ name: "arrow", options: { element: saveButtonArrow } }]
  });
  const [isDropdownVisible, toggleDropdownVisibility] = useReducer(
    (state) => !state,
    false
  );

  useEffect(() => {
    try {
      Sentry.init({
        dsn: sentryTracingUrl,
        enabled: !!sentryTracingUrl,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: reactRouterV6Instrumentation(routes, true)
          })
        ],
        environment: CONFIG.envName,
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
          onClick={() => {
            toggleDropdownVisibility();
            // tell popper to recalculate the position as the dropdown wasn't rendered
            saveButtonUpdate?.();
          }}
        />
        <DropdownItem
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          hidden={!isDropdownVisible}
          data-testid="header-dropdown"
        >
          <TracingInfo>
            Tracing Endpoint:{" "}
            <Input
              type="text"
              placeholder="https://XXX@YYY.ingest.sentry.io/123"
              value={tracingUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTracingUrl(e.target.value)
              }
            />
            <SaveButton
              ref={setSaveButtonReference}
              onClick={() => setSentryTracingUrl(tracingUrl)}
            ></SaveButton>
            <SaveButtonTooltip
              ref={setSaveButtonPopper}
              style={saveButtonStyles.popper}
              {...saveButtonAttributes.popper}
              data-testid="tooltip"
            >
              <span>
                This will save the updated endpoint to your browser's local
                storage.
              </span>
              <TooltipArrow
                ref={setSaveButtonArrow}
                style={saveButtonStyles.arrow}
              />
            </SaveButtonTooltip>
          </TracingInfo>
          <Error data-testid="error">{sentryError}</Error>
        </DropdownItem>
      </NavigationLinks>
    </HeaderContainer>
  );
}

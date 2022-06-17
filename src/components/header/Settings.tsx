import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React, { useEffect, useRef, useState } from "react";
import { IoIosSave, IoMdSettings } from "react-icons/io";
import { usePopper } from "react-popper";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from "react-router-dom";
import styled from "styled-components";

import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { useLocalStorage } from "../../lib/utils/hooks/useLocalStorage";

const SettingsSvgIcon = styled.button`
  all: unset;
  :hover * {
    fill: ${colors.green};
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
  border: 1px solid ${colors.lightGrey};
  box-shadow: 1px 3px 5px ${colors.lightGrey};
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

const SaveButton = styled.button`
  padding: 8px;
  background: var(--secondary);
  color: ${colors.black};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  :hover + [data-testid="tooltip"] {
    visibility: initial;
  }
`;

const SettingsIcon = styled(IoMdSettings)`
  font-size: 30px;
`;

const SaveIcon = styled(IoIosSave)`
  font-size: 20px;
`;

const Error = styled.span`
  color: ${colors.darkRed};
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
export default function Settings() {
  const [sentryTracingUrl, setSentryTracingUrl] = useLocalStorage<string>(
    "tracing-url",
    ""
  );
  const [tracingUrl, setTracingUrl] = useState<string>(sentryTracingUrl);
  const [sentryError, setSentryError] = useState<string>("");
  const dropRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLButtonElement | null>(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end"
  });
  const [saveButtonReference, setSaveButtonReference] =
    useState<HTMLButtonElement | null>(null);
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
    placement: "bottom",
    modifiers: [{ name: "arrow", options: { element: saveButtonArrow } }]
  });
  const [isDropdownVisible, setDropdownVisibility] = useState<boolean>(false);
  const toggleDropdown = () => {
    setDropdownVisibility(!isDropdownVisible);
    // tell popper to recalculate the position as the dropdown wasn't rendered
    saveButtonUpdate?.();
  };
  useEffect(() => {
    try {
      Sentry.init({
        debug: true,
        dsn: sentryTracingUrl,
        enabled: !!sentryTracingUrl,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
              React.useEffect,
              useLocation,
              useNavigationType,
              createRoutesFromChildren,
              matchRoutes
            )
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isClickingOnDropdown =
        dropRef.current && dropRef?.current.contains(event.target as Node);
      const isClickingOnSettingsButton =
        settingsRef.current &&
        settingsRef?.current.contains(event.target as Node);
      if (
        isDropdownVisible &&
        !isClickingOnDropdown &&
        !isClickingOnSettingsButton
      ) {
        setDropdownVisibility(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropRef, isDropdownVisible]);

  return (
    <>
      <SettingsSvgIcon
        data-testid="settings"
        ref={(ref) => {
          settingsRef.current = ref;
          setReferenceElement(ref);
        }}
        onClick={toggleDropdown}
      >
        <SettingsIcon />
      </SettingsSvgIcon>
      <DropdownItem
        ref={(ref) => {
          dropRef.current = ref;
          setPopperElement(ref);
        }}
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
            data-testid="save"
          >
            <SaveIcon width="20px" height="20px" />
          </SaveButton>
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
    </>
  );
}

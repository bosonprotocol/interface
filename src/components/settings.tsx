import { useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { usePopper } from "react-popper";
import styled from "styled-components";

import { BosonRoutes } from "../lib/routing/routes";
import { colors } from "../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../lib/utils/hooks/useKeepQueryParamsNavigate";

const SettingsSvgIcon = styled.button`
  all: unset;
  :hover * {
    fill: ${colors.green};
  }
  :hover {
    cursor: pointer;
  }
`;

const SettingsIcon = styled(IoMdSettings)`
  font-size: 30px;
`;

const DropdownItem = styled.div`
  background: ${colors.navy};
  margin-top: 10px;
  color: ${colors.white};
  padding: 15px;
  border: 1px solid ${colors.lightGrey};
  box-shadow: 1px 3px 5px ${colors.lightGrey};
  z-index: 1;

  p {
    margin: 0;
    padding: 10px 5px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
  }
  p:hover {
    color: var(--accentDark);
    background-color: var(--secondary);
  }
`;

export default function Settings() {
  const navigate = useKeepQueryParamsNavigate();
  const settingsRef = useRef<HTMLButtonElement | null>(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end"
  });
  const [isDropdownVisible, setDropdownVisibility] = useState<boolean>(false);
  const toggleDropdown = () => {
    setDropdownVisibility(!isDropdownVisible);
  };
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
          setPopperElement(ref);
        }}
        style={styles.popper}
        {...attributes.popper}
        hidden={!isDropdownVisible}
        data-testid="header-dropdown"
      >
        <p onClick={() => navigate({ pathname: BosonRoutes.CreateStorefront })}>
          Custom storefront
        </p>
        <p onClick={() => navigate({ pathname: BosonRoutes.Chat })}>
          Chat overview
        </p>
      </DropdownItem>
    </>
  );
}

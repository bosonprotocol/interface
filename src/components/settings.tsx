import { Gear } from "phosphor-react";
import styled from "styled-components";

import { BosonRoutes } from "../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../lib/utils/hooks/useKeepQueryParamsNavigate";
import { transition } from "./ui/styles";

const SettingsSvgIcon = styled.button`
  all: unset;
  svg > * {
    ${transition}
  }
  :hover {
    cursor: pointer;
    svg > *:not(rect) {
      stroke: var(--primary);
    }
  }
`;

export default function Settings() {
  const navigate = useKeepQueryParamsNavigate();

  return (
    <>
      <SettingsSvgIcon
        data-testid="settings"
        onClick={() => navigate({ pathname: BosonRoutes.CreateStorefront })}
      >
        <Gear size={32} />
      </SettingsSvgIcon>
    </>
  );
}

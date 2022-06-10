import { IoMdSettings } from "react-icons/io";
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

export default function Settings() {
  const navigate = useKeepQueryParamsNavigate();

  return (
    <>
      <SettingsSvgIcon
        data-testid="settings"
        onClick={() => navigate({ pathname: BosonRoutes.CreateStorefront })}
      >
        <SettingsIcon />
      </SettingsSvgIcon>
    </>
  );
}

import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../lib/routing/routes";
import { colors } from "../lib/styles/colors";

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
  const navigate = useNavigate();

  return (
    <>
      <SettingsSvgIcon
        data-testid="settings"
        onClick={() => navigate(BosonRoutes.CreateStorefront)}
      >
        <SettingsIcon />
      </SettingsSvgIcon>
    </>
  );
}

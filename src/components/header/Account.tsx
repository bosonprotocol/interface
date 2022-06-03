import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";

const AccountSvgIcon = styled.button`
  all: unset;
  :hover * {
    fill: ${colors.green};
  }
  :hover {
    cursor: pointer;
  }
`;

const AccountIcon = styled(IoIosContact)`
  font-size: 20px;
`;
export default function Account() {
  const navigate = useNavigate();
  return (
    <AccountSvgIcon
      data-testid="account"
      onClick={() => navigate(BosonRoutes.YourAccount)}
    >
      <AccountIcon />
    </AccountSvgIcon>
  );
}

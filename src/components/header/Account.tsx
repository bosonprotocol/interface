import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";

const AccountSvgIcon = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  :hover * {
    fill: ${colors.green};
  }
  :hover {
    cursor: pointer;
  }
`;

const AccountIcon = styled(IoIosContact)`
  font-size: 30px;
`;

interface Props {
  onClick: () => void;
}
export default function Account({ onClick }: Props) {
  const navigate = useNavigate();
  return (
    <AccountSvgIcon
      data-testid="account"
      onClick={() => {
        onClick();
        navigate(BosonRoutes.YourAccount);
      }}
    >
      <AccountIcon />
    </AccountSvgIcon>
  );
}

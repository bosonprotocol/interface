import { useEffect, useState } from "react";
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
  connect: () => void;
  isConnected: boolean;
}
export default function Account({ connect, isConnected }: Props) {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    if (isConnected && isClicked) {
      navigate(BosonRoutes.YourAccount);
    }
  }, [isConnected, isClicked]);
  return (
    <AccountSvgIcon
      data-testid="account"
      onClick={() => {
        if (isConnected) {
          navigate(BosonRoutes.YourAccount);
        } else {
          connect();
          setIsClicked(true);
        }
      }}
    >
      <AccountIcon />
    </AccountSvgIcon>
  );
}

import { useEffect, useState } from "react";
import { IoIosContact } from "react-icons/io";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

const AccountSvgIcon = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  :hover * {
    fill: var(--secondary);
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
  const navigate = useKeepQueryParamsNavigate();
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    if (isConnected && isClicked) {
      navigate({ pathname: BosonRoutes.YourAccount });
    }
  }, [isConnected, isClicked]);
  return (
    <AccountSvgIcon
      data-testid="account"
      onClick={() => {
        if (isConnected) {
          navigate({ pathname: BosonRoutes.YourAccount });
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

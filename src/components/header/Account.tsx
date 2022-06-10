import { useEffect } from "react";
import { IoIosContact } from "react-icons/io";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

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
  const navigate = useKeepQueryParamsNavigate();
  useEffect(() => {
    if (isConnected) {
      navigate({ pathname: BosonRoutes.YourAccount });
    }
  }, [isConnected]);
  return (
    <AccountSvgIcon
      data-testid="account"
      onClick={() => {
        if (isConnected) {
          navigate({ pathname: BosonRoutes.YourAccount });
        } else {
          connect();
        }
      }}
    >
      <AccountIcon />
    </AccountSvgIcon>
  );
}

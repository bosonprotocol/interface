import { Loading } from "@bosonprotocol/react-kit";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Fragment,
  ReactNode
} from "react";

import Tooltip from "../tooltip/Tooltip";

type UnthemedButtonProps = {
  tooltip?: string;
  isLoading?: boolean;
  children: ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const UnthemedButton: React.FC<UnthemedButtonProps> = ({
  children,
  onClick,
  type = "button",
  isLoading = false,
  tooltip = "",
  ...rest
}) => {
  const Wrapper = tooltip !== "" && rest?.disabled ? Tooltip : Fragment;
  const wrapperParams =
    tooltip !== "" && rest?.disabled ? { wrap: false, content: tooltip } : {};

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Wrapper {...wrapperParams}>
        <button onClick={onClick} type={type} {...rest}>
          {isLoading ? <Loading /> : <>{children}</>}
        </button>
      </Wrapper>
    </>
  );
};

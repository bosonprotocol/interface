import { ArrowsClockwise } from "phosphor-react";
import React, { useState } from "react";
import styled, { css } from "styled-components";

const StyledRefresh = styled(ArrowsClockwise)<{ isLoading: boolean }>`
  ${({ isLoading }) => {
    if (isLoading) {
      return css`
        animation: rotation 0.8s linear infinite;
      `;
    }
    return css``;
  }}
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

type UpdateIconProps = Parameters<typeof ArrowsClockwise>[0] & {
  onClick: () => Promise<unknown>;
};

export const UpdateIcon: React.FC<UpdateIconProps> = ({ onClick, ...rest }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  return (
    <StyledRefresh
      {...rest}
      style={{ ...rest.style, cursor: "pointer" }}
      isLoading={isLoading}
      onClick={async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
    />
  );
};

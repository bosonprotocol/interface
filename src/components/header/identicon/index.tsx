import jazzicon from "@metamask/jazzicon";
import { colors } from "lib/styles/colors";
import useENSAvatar from "lib/utils/hooks/useENSAvatar";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const StyledIdenticon = styled.div<{ $iconSize: number }>`
  height: ${({ $iconSize }) => `${$iconSize}px`};
  width: ${({ $iconSize }) => `${$iconSize}px`};
  border-radius: 50%;
  background-color: ${colors.greyLight};
  font-size: initial;
`;

const StyledAvatar = styled.img`
  height: inherit;
  width: inherit;
  border-radius: inherit;
`;

export default function Identicon({
  account,
  size
}: {
  account: string;
  size?: number;
}) {
  const { avatar } = useENSAvatar(account ?? undefined);
  const [fetchable, setFetchable] = useState(true);
  const iconSize = size ?? 24;

  const icon = useMemo(
    () => account && jazzicon(iconSize, parseInt(account.slice(2, 10), 16)),
    [account, iconSize]
  );
  const iconRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const current = iconRef.current;
    if (icon) {
      current?.appendChild(icon);
      return () => {
        try {
          current?.removeChild(icon);
        } catch (e) {
          console.error("Avatar icon not found");
        }
      };
    }
    return;
  }, [icon, iconRef]);

  const handleError = useCallback(() => setFetchable(false), []);

  return (
    <StyledIdenticon $iconSize={iconSize}>
      {avatar && fetchable ? (
        <StyledAvatar
          alt="avatar"
          src={avatar}
          onError={handleError}
        ></StyledAvatar>
      ) : (
        <span ref={iconRef} />
      )}
    </StyledIdenticon>
  );
}

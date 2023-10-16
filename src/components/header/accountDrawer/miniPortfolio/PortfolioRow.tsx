import styled, { css, keyframes } from "styled-components";

import Column, { AutoColumn } from "../../../ui/column";
import Grid from "../../../ui/Grid";
import { LoadingBubble } from "../../../ui/LoadingBubble";

const PortfolioRowWrapper = styled(Grid)`
  gap: 12px;
  height: 68px;
  padding: 0 16px;

  transition: 250ms ease background-color;
`;

const EndColumn = styled(Column)`
  align-items: flex-end;
`;

export default function PortfolioRow({
  ["data-testid"]: testId,
  left,
  title,
  descriptor,
  right
}: {
  "data-testid"?: string;
  left: React.ReactNode;
  title: React.ReactNode;
  descriptor?: React.ReactNode;
  right?: React.ReactNode;
  setIsHover?: (b: boolean) => void;
}) {
  return (
    <PortfolioRowWrapper data-testid={testId}>
      {left}
      <AutoColumn grow>
        {title}
        {descriptor}
      </AutoColumn>
      {right && <EndColumn>{right}</EndColumn>}
    </PortfolioRowWrapper>
  );
}

function PortfolioSkeletonRow() {
  return (
    <PortfolioRowWrapper>
      <LoadingBubble height="40px" width="40px" round />
      <AutoColumn grow gap="4px">
        <LoadingBubble height="16px" width="60px" delay="300ms" />
        <LoadingBubble height="10px" width="90px" delay="300ms" />
      </AutoColumn>
    </PortfolioRowWrapper>
  );
}

export function PortfolioSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <PortfolioSkeletonRow key={`portfolio loading row${i}`} />
      ))}
    </>
  );
}

const fadeIn = keyframes`
  from { opacity: .25 }
  to { opacity: 1 }
`;

export const portfolioFadeInAnimation = css`
  animation: ${fadeIn} 250ms ease-in;
`;

export const PortfolioTabWrapper = styled.div`
  ${portfolioFadeInAnimation}
`;

import { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const PaginationButton = styled("button").attrs({
  type: "button"
})<{ $isBack: boolean }>`
  all: unset;
  font-weight: 600;
  color: ${colors.green};
  border-radius: 11px;
  text-align: center;
  cursor: pointer;
  border: 1px solid ${colors.green};
  width: 100px;

  transform: ${(props) => {
    return props.$isBack ? "rotate(180deg)" : "initial";
  }};

  :hover:enabled {
    background: ${colors.black};
  }

  :disabled {
    border: 1px solid ${colors.grey};
    color: ${colors.grey};
    cursor: not-allowed;
  }
`;

const Page = styled.p`
  padding: 10px;
  font-weight: 600;
  border: 1px solid ${colors.green};
  color: ${colors.green};
  border-radius: 50%;
  margin: 0 20px;
  min-width: 25px;
  text-align: center;
`;

interface Props {
  defaultPage: number;
  isNextEnabled: boolean;
  isPreviousEnabled: boolean;
  onChangeIndex: (index: number) => void;
}
export default function Pagination({
  defaultPage,
  isNextEnabled,
  isPreviousEnabled,
  onChangeIndex
}: Props) {
  const [pageIndex, setPageIndex] = useState(defaultPage || 0);
  const onClick = (newIndex: number) => () => {
    setPageIndex(newIndex);
    onChangeIndex(newIndex);
  };
  useEffect(() => {
    setPageIndex(defaultPage);
  }, [defaultPage]);

  return (
    <Container>
      <PaginationButton
        data-testid="previous"
        disabled={pageIndex < 1 || !isPreviousEnabled}
        $isBack
        onClick={onClick(pageIndex - 1)}
      >
        &#10140;
      </PaginationButton>

      <Page>{pageIndex + 1}</Page>

      <PaginationButton
        data-testid="next"
        $isBack={false}
        disabled={!isNextEnabled}
        onClick={onClick(pageIndex + 1)}
      >
        &#10140;
      </PaginationButton>
    </Container>
  );
}

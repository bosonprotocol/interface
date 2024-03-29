import { CaretLeft, CaretRight } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";

import Button from "../../components/ui/Button";
import { colors } from "../../lib/styles/colors";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const PaginationButton = styled(Button).attrs({
  type: "button"
})<{ $isBack: boolean }>`
  &:disabled {
    color: ${colors.grey};
    cursor: not-allowed;
  }
`;

const Page = styled.p`
  font-weight: 600;
  color: ${colors.black};
  border: 1px solid var(--secondary);
  border-radius: 50%;
  min-width: 3rem;
  font-size: 2rem;
  text-align: center;
`;

interface Props {
  defaultPage: number;
  isNextEnabled: boolean;
  isPreviousEnabled: boolean;
  onChangeIndex: (index: number) => void;
  pageCount: number;
}
export default function Pagination({
  defaultPage,
  isNextEnabled,
  isPreviousEnabled,
  onChangeIndex,
  pageCount
}: Props) {
  const [pageIndex, setPageIndex] = useState(defaultPage || 0);

  const onClick = (newIndex: number) => () => {
    setPageIndex(newIndex);
    onChangeIndex(newIndex);
  };

  return (
    <Container>
      <PaginationButton
        data-testid="previous"
        disabled={pageIndex < 1 || !isPreviousEnabled}
        $isBack
        onClick={onClick(pageIndex - 1)}
        themeVal="outline"
      >
        <CaretLeft size={24} />
      </PaginationButton>

      <Page>
        {pageIndex + 1} / {pageCount}
      </Page>

      <PaginationButton
        data-testid="next"
        $isBack={false}
        disabled={!isNextEnabled}
        onClick={onClick(pageIndex + 1)}
        themeVal="outline"
      >
        <CaretRight size={24} />
      </PaginationButton>
    </Container>
  );
}

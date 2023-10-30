import styled from "styled-components";

const Button = styled.button`
  all: unset;
  cursor: pointer;

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0.5rem;
  padding: 0.5rem;
  > div {
    width: 1.25rem;
    height: 2px;
    border-radius: 5px;
    background: var(--accent);
  }
`;

type BurgerButtonProps = {
  onClick: () => void;
};

export const BurgerButton: React.FC<BurgerButtonProps> = ({ onClick }) => {
  return (
    <Button theme="blank" onClick={onClick}>
      <div />
      <div />
      <div />
    </Button>
  );
};

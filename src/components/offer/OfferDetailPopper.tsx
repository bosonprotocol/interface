import { useEffect, useRef, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button from "../ui/Button";

interface IOfferDetailPopper {
  children?: string | React.ReactNode;
}
const PopperWrapper = styled.div`
  position: relative;
`;

const Popper = styled.div`
  position: absolute;
  background: ${colors.white};
  color: ${colors.black};
  padding: 1rem;
  z-index: ${zIndex.Popper};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
    0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);

  bottom: -1rem;

  left: 0;
  min-width: 65vw;
  transform: translate(-5rem, 100%);

  ${breakpoint.s} {
    left: 50%;
    min-width: 25rem;
    transform: translate(-50%, 100%);
  }

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.55rem solid ${colors.white};
    top: 0;

    left: 0.75rem;
    transform: translate(5rem, -0.5rem);
    ${breakpoint.s} {
      left: 50%;
      transform: translate(-50%, -0.5rem);
    }
  }
`;

const OfferDetailPopper: React.FC<IOfferDetailPopper> = ({ children }) => {
  const popperRef = useRef<HTMLDivElement | null>(null);
  const [isPopperVisible, setPopperVisibility] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const onPopper =
        popperRef.current && popperRef?.current.contains(event.target as Node);
      if (isPopperVisible && !onPopper) {
        setPopperVisibility(false);
      }
    }
    function handleScroll() {
      if (isPopperVisible) {
        setPopperVisibility(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [popperRef, isPopperVisible]);

  return (
    <PopperWrapper>
      <Button
        type="button"
        theme="blank"
        onClick={() => {
          setPopperVisibility(true);
        }}
        onMouseOver={() => {
          setPopperVisibility(true);
        }}
        onMouseOut={() => {
          setPopperVisibility(false);
        }}
      >
        <AiOutlineQuestionCircle size={18} />
      </Button>
      <Popper
        ref={(ref) => {
          popperRef.current = ref;
        }}
        hidden={!isPopperVisible}
      >
        {children}
      </Popper>
    </PopperWrapper>
  );
};

export default OfferDetailPopper;

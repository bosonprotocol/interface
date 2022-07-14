import { useEffect, useRef, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

import Button from "../ui/Button";
import { Popper, PopperWrapper } from "./Detail.style";

interface Props {
  children?: string | React.ReactNode;
}

export default function DetailPopper({ children }: Props) {
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
}

import React from "react";
import styled from "styled-components";

import { LayoutRoot } from "../../../components/layout/Layout";
import { colors } from "../../../lib/styles/colors";
import { Congratulations, CongratulationsProps } from "./Congratulations";

type CongratulationsPageProps = CongratulationsProps;

const Background = styled.div`
  background: ${colors.lightGrey};
  width: 100vw;
  transform: translate(-50%);
  margin-left: 50%;
  flex: 1;
`;

export const CongratulationsPage: React.FC<CongratulationsPageProps> = ({
  reset,
  sellerId,
  type
}) => {
  // const { setFullWidth } = useLayoutContext();
  // useEffect(() => {
  //   setFullWidth(true);
  //   return () => {
  //     setFullWidth(false);
  //   };
  // }, []);
  return (
    <Background>
      <LayoutRoot fullWidth>
        <Congratulations reset={reset} sellerId={sellerId} type={type} />
      </LayoutRoot>
    </Background>
  );
};

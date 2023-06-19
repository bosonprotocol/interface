import React, { useEffect } from "react";
import styled from "styled-components";

import { useLayoutContext } from "../../../components/layout/Context";
import { LayoutRoot } from "../../../components/layout/Layout";
import { colors } from "../../../lib/styles/colors";
import { CreateProductCongratulations } from "./CreateProductCongratulations";

type CreateProductCongratulationsPageProps = {
  reset: () => void;
  sellerId: string;
};

const Background = styled.div`
  background: ${colors.lightGrey};
  width: 100%;
`;

export const CreateProductCongratulationsPage: React.FC<
  CreateProductCongratulationsPageProps
> = ({ reset, sellerId }) => {
  const { setFullWidth } = useLayoutContext();
  useEffect(() => {
    setFullWidth(true);
    return () => {
      setFullWidth(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Background>
      <LayoutRoot fullWidth={false}>
        <CreateProductCongratulations reset={reset} sellerId={sellerId} />
      </LayoutRoot>
    </Background>
  );
};

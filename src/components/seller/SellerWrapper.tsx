import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Typography } from "../ui/Typography";
const margin = "5.5rem";
const SellerMain = styled.main`
  padding: 1.375rem 2.5rem 2.75rem 2.5rem;
  background: ${colors.lightGrey};
  min-height: calc(100vh - ${margin});
  overflow: hidden;
`;
const SellerTitle = styled(Typography)`
  margin: 0 0 1.25rem 0;
`;
const SellerInner = styled.div`
  background: ${colors.white};
  padding: 1rem;
  box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 2%), 0px 0px 10px 0px rgb(0 0 0 / 2%),
    0px 0px 15px 0px rgb(0 0 0 / 5%);
  overflow: auto;
  height: calc(100% - ${margin});
  margin-bottom: ${margin};
  overflow-y: hidden;
`;

interface Props {
  children: React.ReactNode;
  label: string;
  withoutWrapper?: boolean;
}

export default function SellerWrapper({
  label,
  children,
  withoutWrapper = false
}: Props) {
  return (
    <SellerMain>
      <SellerTitle tag="h3">{label}</SellerTitle>
      {withoutWrapper ? children : <SellerInner>{children}</SellerInner>}
    </SellerMain>
  );
}

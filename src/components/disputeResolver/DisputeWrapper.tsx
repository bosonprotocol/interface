import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Typography } from "../ui/Typography";

const DisputeResolverMain = styled.main`
  padding: 1.375rem 2.5rem 2.75rem 2.5rem;
  background: ${colors.lightGrey};
  min-height: calc(100vh - 5.5rem);
`;
const DisputeResolverTitle = styled(Typography)`
  margin: 0 0 1.25rem 0;
`;
const DisputeResolverInner = styled.div`
  background: ${colors.white};
  padding: 1rem;
  box-shadow:
    0px 0px 5px 0px rgb(0 0 0 / 2%),
    0px 0px 10px 0px rgb(0 0 0 / 2%),
    0px 0px 15px 0px rgb(0 0 0 / 5%);
`;

interface Props {
  children: React.ReactNode;
  label: string;
  withoutWrapper?: boolean;
}

export default function DisputeResolverWrapper({
  label,
  children,
  withoutWrapper = false
}: Props) {
  return (
    <DisputeResolverMain>
      <DisputeResolverTitle tag="h3">{label}</DisputeResolverTitle>
      {withoutWrapper ? (
        children
      ) : (
        <DisputeResolverInner>{children}</DisputeResolverInner>
      )}
    </DisputeResolverMain>
  );
}

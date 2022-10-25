import styled from "styled-components";

import redeemeumLogo from "../../../assets/redeemeum.png";
import Typography from "../../ui/Typography";
const DisputeResolverImg = styled.img`
  height: 18px;
`;
export const DetailDisputeResolver = {
  name: "Dispute resolver",
  info: (
    <>
      <Typography tag="h6">
        <b>Dispute resolver</b>
      </Typography>
      <Typography tag="p">
        The Dispute resolver is trusted to resolve disputes between buyer and
        seller that can't be mutually resolved.
      </Typography>
    </>
  ),
  value: () => {
    return <DisputeResolverImg src={redeemeumLogo} alt="Redeemeum logo" />;
  }
};

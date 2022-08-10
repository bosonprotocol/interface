import portalLogo from "../../../assets/portal.svg";
import Typography from "../../ui/Typography";
import { PortalLogoImg } from "../Detail.style";

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
    return <PortalLogoImg src={portalLogo} alt="Portal logo" />;
  }
};

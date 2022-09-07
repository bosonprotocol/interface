import { colors } from "../../../lib/styles/colors";
import Tooltip from "../../tooltip/Tooltip";
import Typography from "../../ui/Typography";
import { BaseElement, DashboardBaseInfo } from "./SellerDashboard.styles";

interface DefaultValue {
  value: number;
  percent?: number;
}
interface Props {
  offers: DefaultValue;
  liveNfts: DefaultValue;
  redemptions: DefaultValue;
  revenue: DefaultValue;
}

export default function SellerDashboardInfo({
  offers,
  liveNfts,
  redemptions,
  revenue
}: Props) {
  return (
    <DashboardBaseInfo
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 4,
        l: 4,
        xl: 4
      }}
    >
      <BaseElement>
        <Typography margin="0" tag="p">
          Items offered
        </Typography>
        <Typography margin="0" tag="h2">
          {offers?.value}
        </Typography>
      </BaseElement>
      <BaseElement>
        <Typography margin="0" tag="p">
          Live rNFTs
        </Typography>
        <Typography margin="0" tag="h2">
          {liveNfts?.value}
        </Typography>
        {liveNfts?.percent ? (
          <Typography margin="0" tag="p">
            <small>
              <b
                style={{
                  color: liveNfts?.percent > 0 ? "#00a16b" : colors.red
                }}
              >
                {liveNfts?.percent}%
              </b>
              &nbsp;&nbsp;last 7 days
            </small>
          </Typography>
        ) : (
          ""
        )}
      </BaseElement>
      <BaseElement>
        <Typography margin="0" tag="p">
          No. of Redemptions
        </Typography>
        <Typography margin="0" tag="h2">
          {redemptions?.value}
        </Typography>
        {redemptions?.percent ? (
          <Typography margin="0" tag="p">
            <small>
              <b
                style={{
                  color: redemptions?.percent > 0 ? "#00a16b" : colors.red
                }}
              >
                {redemptions?.percent}%
              </b>
              &nbsp;&nbsp;last 7 days
            </small>
          </Typography>
        ) : (
          ""
        )}
      </BaseElement>
      <BaseElement>
        <Typography margin="0" tag="p">
          Revenue
          <Tooltip content="This relates to completed exchanges only. Those currently in the redeemed state are not considered as this may lead to a misleading value." />
        </Typography>
        <Typography margin="0" tag="h2">
          {revenue?.value && revenue?.value !== 0 ? revenue?.value : "-"}
        </Typography>
        {revenue?.percent ? (
          <Typography margin="0" tag="p">
            <small>
              <b
                style={{
                  color: revenue?.percent > 0 ? "#00a16b" : colors.red
                }}
              >
                {revenue?.percent}%
              </b>
              &nbsp;&nbsp;last 7 days
            </small>
          </Typography>
        ) : (
          ""
        )}
      </BaseElement>
    </DashboardBaseInfo>
  );
}

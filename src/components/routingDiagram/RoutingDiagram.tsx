import { Protocol } from "@uniswap/router-sdk";
import { Currency } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { ReactComponent as DotLine } from "assets/svg/dot_line.svg";
import CurrencyLogo from "components/logo/CurrencyLogo";
import DoubleCurrencyLogo from "components/logo/DoubleCurrencyLogo";
import Tooltip from "components/tooltip/Tooltip";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { RoutingDiagramEntry } from "lib/utils/getRoutingDiagramEntries";
import { useTokenInfoFromActiveList } from "lib/utils/hooks/useTokenInfoFromActiveList";
import styled from "styled-components";

const Wrapper = styled(Grid)`
  align-items: center;
  width: 100%;
`;

const RouteContainerRow = styled(Grid)`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
`;

const RouteRow = styled(Grid)`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 0.1rem 0.5rem;
  position: relative;
`;

// TODO: styled(Badge)
const PoolBadge = styled.div`
  display: flex;
  padding: 4px 4px;
`;

const DottedLine = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  width: calc(100%);
  z-index: 1;
  opacity: 0.5;
`;

const DotColor = styled(DotLine)`
  path {
    stroke: ${colors.lightGrey};
  }
`;
// styled(Badge);
const OpaqueBadge = styled.div`
  background-color: ${colors.lightGrey};
  border-radius: 8px;
  display: grid;
  font-size: 12px;
  grid-gap: 4px;
  grid-auto-flow: column;
  justify-content: start;
  padding: 4px 6px 4px 4px;
  /* z-index: {Z_INDEX.sticky}; */
`;

const ProtocolBadge = styled.div`
  border-radius: 4px;
  color: ${colors.lightGrey};
  font-size: 10px;
  padding: 2px 4px;
  /* z-index: {Z_INDEX.sticky + 1}; */
`;

const MixedProtocolBadge = styled(ProtocolBadge)`
  width: 60px;
`;

const BadgeText = styled(Typography)`
  word-break: normal;
`;

export default function RoutingDiagram({
  currencyIn,
  currencyOut,
  routes
}: {
  currencyIn: Currency;
  currencyOut: Currency;
  routes: RoutingDiagramEntry[];
}) {
  const tokenIn = useTokenInfoFromActiveList(currencyIn);
  const tokenOut = useTokenInfoFromActiveList(currencyOut);

  return (
    <Wrapper>
      {routes.map((entry, index) => (
        <RouteContainerRow key={index}>
          <CurrencyLogo currency={tokenIn} size="20px" />
          <Route entry={entry} />
          <CurrencyLogo currency={tokenOut} size="20px" />
        </RouteContainerRow>
      ))}
    </Wrapper>
  );
}

function Route({
  entry: { percent, path, protocol }
}: {
  entry: RoutingDiagramEntry;
}) {
  return (
    <RouteRow>
      <DottedLine>
        <DotColor />
      </DottedLine>
      <OpaqueBadge>
        {protocol === Protocol.MIXED ? (
          <MixedProtocolBadge>
            <BadgeText style={{ fontSize: "12px" }}>V3 + V2</BadgeText>
          </MixedProtocolBadge>
        ) : (
          <ProtocolBadge>
            <BadgeText style={{ fontSize: "12px" }}>
              {protocol.toUpperCase()}
            </BadgeText>
          </ProtocolBadge>
        )}
        <BadgeText style={{ fontSize: "124x", minWidth: "auto" }}>
          {percent.toSignificant(2)}%
        </BadgeText>
      </OpaqueBadge>
      <Grid
        gap="1px"
        $width="100%"
        style={{ justifyContent: "space-evenly", zIndex: 2 }}
      >
        {path.map(([currency0, currency1, feeAmount], index) => (
          <Pool
            key={index}
            currency0={currency0}
            currency1={currency1}
            feeAmount={feeAmount}
          />
        ))}
      </Grid>
    </RouteRow>
  );
}

function Pool({
  currency0,
  currency1,
  feeAmount
}: {
  currency0: Currency;
  currency1: Currency;
  feeAmount: FeeAmount;
}) {
  const tokenInfo0 = useTokenInfoFromActiveList(currency0);
  const tokenInfo1 = useTokenInfoFromActiveList(currency1);

  // TODO - link pool icon to info.uniswap.org via query params
  return (
    <Tooltip
      content={
        <>
          {tokenInfo0?.symbol +
            "/" +
            tokenInfo1?.symbol +
            " " +
            feeAmount / 10000}
          % pool
        </>
      }
    >
      <PoolBadge>
        <Grid margin="0 4px 0 12px">
          <DoubleCurrencyLogo
            currency0={tokenInfo1}
            currency1={tokenInfo0}
            size={20}
          />
        </Grid>
        <Typography $fontSize={14}>{feeAmount / 10000}%</Typography>
      </PoolBadge>
    </Tooltip>
  );
}

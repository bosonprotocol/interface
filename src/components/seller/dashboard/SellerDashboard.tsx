import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../../lib/routing/parameters";
import { SellerCenterRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useOffers } from "../../../lib/utils/hooks/offers/useOffers";
import { Exchange, useExchanges } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import GridContainer from "../../ui/GridContainer";
import Loading from "../../ui/Loading";
import Typography from "../../ui/Typography";
import { SellerInner } from "./SellerDashboard.styles";
import SellerDashboardInfo from "./SellerDashboardInfo";
import SellerDashboardItems from "./SellerDashboardItems";

interface Props {
  sellerId: string;
}

const calcPercentageInLastWeek = (items: Exchange[], type: keyof Exchange) => {
  const t = items.length;
  const v =
    items
      .map((d) => {
        const val = d[type as keyof Exchange];
        if (val) {
          return dayjs().diff(
            dayjs(getDateTimestamp(val?.toString())),
            "days"
          ) < 7
            ? d
            : null;
        }
        return null;
      })
      .filter((n) => n !== null) || [];
  return v.length ? Math.round((100 * v.length) / t) : 0;
};
const filterItems = (exchanges: Exchange[] | undefined, type: string) => {
  if (!exchanges) {
    return [];
  }
  return (
    exchanges?.filter((exchange: Exchange) => {
      const status = ExchangesKit.getExchangeState(exchange);

      if (type === "Commits") {
        return status === subgraph.ExchangeState.Committed ? exchange : null;
      }
      if (type === "Redemptions") {
        return status === subgraph.ExchangeState.Redeemed ? exchange : null;
      }
      if (type === "Disputes") {
        return status === subgraph.ExchangeState.Disputed ? exchange : null;
      }
    }) || []
  );
};
export default function SellerDashboard({ sellerId }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  // TODO: change displayPopup in future
  const [displayPopup] = useState<boolean>(false);
  const { data: offers, isLoading: isLoadingOffers } = useOffers({
    sellerId,
    first: 1000
  });

  const { data: exchanges, isLoading: isLoadingExchanges } = useExchanges({
    sellerId,
    disputed: null
  });

  const commits = useMemo(() => filterItems(exchanges, "Commits"), [exchanges]);
  const redemptions = useMemo(
    () => filterItems(exchanges, "Redemptions"),
    [exchanges]
  );
  const disputes = useMemo(
    () => filterItems(exchanges, "Disputes"),
    [exchanges]
  );
  const sellerDashboardProps = useMemo(
    () => ({
      offers: { value: offers?.length ?? 0 },
      liveNfts: {
        value: commits?.length ?? 0,
        percent: calcPercentageInLastWeek(commits, "committedDate")
      },
      redemptions: {
        value: redemptions?.length ?? 0,
        percent: calcPercentageInLastWeek(redemptions, "redeemedDate")
      },
      revenue: {
        value: 0
      }
    }),
    [offers, commits, redemptions]
  );

  if (isLoadingOffers || isLoadingExchanges) {
    return <Loading />;
  }

  return (
    <Grid gap="2rem" flexDirection="column" alignItems="stretch">
      {displayPopup && (
        <SellerInner
          padding="1.5rem"
          background={colors.black}
          color={colors.white}
        >
          <Grid justifyContent="space-between" alignItems="center">
            <div>
              <Typography tag="h4" padding="0">
                You need to top up your seller deposit pool
              </Typography>
              <Typography tag="p" padding="0">
                Currently, your product can’t be bought becasue the balance in
                your seller deposit pool is not sufficient enough.
              </Typography>
            </div>
            <Grid justifyContent="flex-end" alignItems="center">
              <Button
                theme="blankWhite"
                onClick={() => {
                  const pathname = generatePath(
                    SellerCenterRoutes.SellerCenter,
                    {
                      [UrlParameters.sellerPage]: "finances"
                    }
                  );
                  navigate({ pathname });
                }}
              >
                View finances
              </Button>
              <Button
                theme="secondary"
                onClick={() => {
                  const pathname = generatePath(
                    SellerCenterRoutes.SellerCenter,
                    {
                      [UrlParameters.sellerPage]: "finances"
                    }
                  );
                  navigate({ pathname });
                }}
              >
                Deposit funds
              </Button>
            </Grid>
          </Grid>
        </SellerInner>
      )}
      <SellerInner padding="0">
        <SellerDashboardInfo {...sellerDashboardProps} />
      </SellerInner>
      <GridContainer
        itemsPerRow={{
          xs: 1,
          s: 1,
          m: 3,
          l: 3,
          xl: 3
        }}
        style={{ alignItems: "flex-start" }}
      >
        <SellerInner>
          <SellerDashboardItems
            name="Commits"
            items={commits.slice(0, 3)}
            onClick={() => {
              const pathname = generatePath(SellerCenterRoutes.SellerCenter, {
                [UrlParameters.sellerPage]: "exchanges"
              });
              navigate({ pathname }, { state: { currentTag: "live-rnfts" } });
            }}
          />
        </SellerInner>
        <SellerInner>
          <SellerDashboardItems
            name="Redemptions"
            items={redemptions.slice(0, 3)}
            onClick={() => {
              const pathname = generatePath(SellerCenterRoutes.SellerCenter, {
                [UrlParameters.sellerPage]: "exchanges"
              });
              navigate({ pathname }, { state: { currentTag: "redemptions" } });
            }}
          />
        </SellerInner>
        <SellerInner>
          <SellerDashboardItems
            name="Disputes"
            items={disputes.slice(0, 3)}
            onClick={() => {
              const pathname = generatePath(SellerCenterRoutes.SellerCenter, {
                [UrlParameters.sellerPage]: "exchanges"
              });
              navigate({ pathname }, { state: { currentTag: "disputes" } });
            }}
          />
        </SellerInner>
      </GridContainer>
    </Grid>
  );
}

import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import { LoadingMessage } from "components/loading/LoadingMessage";
import dayjs from "dayjs";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../../lib/routing/parameters";
import { SellerCenterRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPricePassedAsAProp } from "../../../lib/utils/convertPrice";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useLensProfilesPerSellerIds } from "../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useConvertedPriceFunction } from "../../price/useConvertedPriceFunction";
import BosonButton from "../../ui/BosonButton";
import { Grid } from "../../ui/Grid";
import { GridContainer } from "../../ui/GridContainer";
import { Typography } from "../../ui/Typography";
import { WithSellerDataProps } from "../common/WithSellerData";
import { getSellerCenterPath } from "../paths";
import { SellerInsideProps } from "../SellerInside";
import { SellerInner } from "./SellerDashboard.styles";
import SellerDashboardInfo from "./SellerDashboardInfo";
import SellerDashboardItems from "./SellerDashboardItems";

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
const calcRevenue = (
  items: Exchange[] | undefined,
  convertPrice: (offer: Offer) => IPricePassedAsAProp | null
) => {
  const calc =
    (items &&
      items
        ?.map((item: Exchange) => {
          const wasItRedeemed = item?.redeemedDate !== null;
          const wasItDisputed = item?.disputed;
          const disputeUntil = dayjs(
            getDateTimestamp(item?.redeemedDate as string) +
              getDateTimestamp(item?.offer?.disputePeriodDuration)
          );
          const stillCanDispute = disputeUntil.isAfter(dayjs());
          if (wasItRedeemed && !wasItDisputed && !stillCanDispute) {
            const price = convertPrice(item.offer);
            return price;
          }
          return null;
        })
        .filter((n) => n !== null)) ||
    [];

  if (calc.length === 0) {
    return 0;
  }

  const price = calc.reduce(
    (acc, e) => (e && e !== null ? (acc += Number(e.converted)) : acc),
    0
  );

  return price;
};
const filterItems = (exchanges: Exchange[] | undefined, type: string) => {
  if (!exchanges) {
    return [];
  }
  return (
    exchanges?.filter((exchange: Exchange) => {
      const status = ExchangesKit.getExchangeState(exchange);

      if (type === "Commits") {
        return status === subgraph.ExchangeState.COMMITTED ? exchange : null;
      }
      if (type === "Redemptions") {
        return status === subgraph.ExchangeState.REDEEMED ? exchange : null;
      }
      if (type === "Disputes") {
        return status === subgraph.ExchangeState.DISPUTED ? exchange : null;
      }
    }) || []
  );
};
export default function SellerDashboard({
  offers: offersData,
  exchanges: exchangesData,
  offersBacked
}: SellerInsideProps & WithSellerDataProps) {
  const navigate = useKeepQueryParamsNavigate();
  const convertPrice = useConvertedPriceFunction();

  const { data: offers, isLoading: isLoadingOffers } = offersData;
  const { data: exchanges, isLoading: isLoadingExchanges } = exchangesData;

  // fetch lensProfile for current SellerId
  const seller = exchanges?.[0]?.seller;
  const sellerLensProfilePerSellerId = useLensProfilesPerSellerIds(
    { sellers: seller ? [seller] : [] },
    { enabled: !!seller }
  );
  const sellerLensProfile = seller
    ? sellerLensProfilePerSellerId?.get(seller.id)
    : undefined;

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
        value: calcRevenue(exchanges, convertPrice)
      }
    }),
    [offers, commits, redemptions, exchanges, convertPrice]
  );

  if (isLoadingOffers || isLoadingExchanges) {
    return <LoadingMessage />;
  }

  return (
    <>
      <Grid gap="2rem" flexDirection="column" alignItems="stretch">
        {offersBacked?.displayWarning && (
          <SellerInner
            padding="1.5rem"
            background={colors.black}
            color={colors.white}
          >
            <Grid
              justifyContent="space-between"
              alignItems="center"
              gap="1rem"
              flexWrap="wrap"
            >
              <div style={{ flex: "1" }}>
                <Typography tag="h4" padding="0">
                  Top up your seller deposit pool!
                </Typography>
                <Typography tag="p" padding="0">
                  Currently, your product(s) can't be purchased because there
                  are insufficient funds in your seller pool.
                </Typography>
              </div>
              <Grid
                justifyContent="flex-end"
                alignItems="center"
                flexGrow="0"
                flexShrink="1"
                flexBasis="0%"
              >
                <BosonButton
                  variant="primaryFill"
                  style={{ whiteSpace: "pre" }}
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
                </BosonButton>
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
              sellerLensProfile={sellerLensProfile}
              onClick={() => {
                const pathname = getSellerCenterPath("Exchanges");
                navigate({ pathname }, { state: { currentTag: "live-rnfts" } });
              }}
            />
          </SellerInner>
          <SellerInner>
            <SellerDashboardItems
              name="Redemptions"
              items={redemptions.slice(0, 3)}
              sellerLensProfile={sellerLensProfile}
              onClick={() => {
                const pathname = generatePath(SellerCenterRoutes.SellerCenter, {
                  [UrlParameters.sellerPage]: "exchanges"
                });
                navigate(
                  { pathname },
                  { state: { currentTag: "redemptions" } }
                );
              }}
            />
          </SellerInner>
          <SellerInner>
            <SellerDashboardItems
              name="Disputes"
              items={disputes.slice(0, 3)}
              sellerLensProfile={sellerLensProfile}
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
    </>
  );
}

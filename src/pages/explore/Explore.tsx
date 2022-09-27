import { ArrowRight } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";

import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ExploreOffers from "./ExploreOffers";
import ExploreSelect from "./ExploreSelect";
import useSearchParams from "./useSearchParams";
import { WithAllOffers, WithAllOffersProps } from "./WithAllOffers";

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 4rem auto;
  overflow: hidden;
`;

const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  justify-content: center;
  ${breakpoint.m} {
    flex-direction: row;
  }
`;

const ExploreOffersContainer = styled.div`
  background: ${colors.lightGrey};
  padding: 0 3.125rem 3.125rem 3.125rem;
`;

const CreatorsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-gap: 0.5rem;
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.secondary};
  width: 6.875rem;
  font-size: 1rem;
  font-weight: 600;
`;

function Explore(props: WithAllOffersProps) {
  const navigate = useKeepQueryParamsNavigate();
  const { params, handleChange } = useSearchParams();

  const filterOptions = useMemo(() => {
    // const name = params?.[ExploreQueryParameters.name] || false;
    const sortBy = params?.[ExploreQueryParameters.sortBy] || false;
    let payload = {
      orderDirection: "",
      orderBy: "",
      validFromDate: "",
      validUntilDate: "",
      exchangeOrderBy: "",
      validFromDate_lte: ""
    };

    if (sortBy !== false) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [orderBy, orderDirection] = sortBy.split(":");
      if (orderBy === "committedDate" || orderBy === "redeemedDate") {
        payload = {
          ...payload,
          orderDirection: orderDirection,
          orderBy: "createdAt",
          exchangeOrderBy: orderBy
        };
      } else if (orderBy === "validFromDate") {
        payload = {
          ...payload,
          orderDirection: orderDirection,
          orderBy: "createdAt",
          validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
        };
      } else {
        payload = {
          ...payload,
          orderDirection: orderDirection,
          orderBy: orderBy
        };
      }
    }
    return payload;
  }, [params]);

  const { data } = useCollections(
    {
      ...filterOptions
    },
    {
      // TODO: change that if needed
      enabled: true
    }
  );

  const collections = useMemo(() => {
    const filtered = data?.filter((item) => item.offers.length > 0);

    if (filtered && filtered.length > 0) {
      return filtered.slice(0, 4);
    }

    if (data) {
      return data.slice(0, 4);
    }
  }, [data]);

  return (
    <ExploreContainer>
      <TopContainer>
        <Typography tag="h2" $fontSize="2.25rem">
          Explore
        </Typography>
        <Grid justifyContent="flex-end">
          <ExploreSelect params={params} handleChange={handleChange} />
        </Grid>
      </TopContainer>
      <ExploreOffersContainer>
        <ExploreOffers
          hidePagination
          name={params?.[ExploreQueryParameters.name] as string}
          orderBy={filterOptions?.orderBy || ""}
          orderDirection={filterOptions?.orderDirection || ""}
          exchangeOrderBy={filterOptions?.exchangeOrderBy || ""}
          // exchangeTokenAddress={""}
          // sellerId={""}
        />
        <Grid>
          <Typography
            $fontSize="32px"
            fontWeight="600"
            margin="0.67em 0 0.67em 0"
          >
            Sellers
          </Typography>
          <ViewMoreButton
            onClick={() => {
              // if (sortQueryParameter) {
              //   navigate({
              //     pathname: `${BosonRoutes.Sellers}/selectedOption=${sortQueryParameter}`
              //   });
              // } else {
              // }
              navigate({
                pathname: `${BosonRoutes.Sellers}`
              });
            }}
          >
            View more <ArrowRight size={22} />
          </ViewMoreButton>
        </Grid>
        <CreatorsGrid>
          {collections &&
            collections.map((collection) => (
              <CollectionsCard
                key={`CollectionsCard_${collection?.id}`}
                collection={collection}
              />
            ))}
        </CreatorsGrid>
      </ExploreOffersContainer>
    </ExploreContainer>
  );
}

const ExploreWithAllOffers = WithAllOffers(Explore);

function ExploreWrapper() {
  return <ExploreWithAllOffers />;
}
export default ExploreWrapper;

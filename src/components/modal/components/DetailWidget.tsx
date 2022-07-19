/* eslint @typescript-eslint/no-explicit-any: "off" */
import { ExchangeState } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { generatePath } from "react-router-dom";

import {
  Break,
  ModalGrid,
  ModalImageWrapper,
  Widget,
  WidgetButtonWrapper
} from "../../../components/detail/Detail.style";
import DetailOpenSea from "../../../components/detail/DetailOpenSea";
import DetailTable from "../../../components/detail/DetailTable";
import {
  AccountQueryParameters,
  UrlParameters
} from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";

// TODO: work on that
interface Props {
  id: any;
  type: string;
  state: string;
  message: string;
  data: any;
  name: any;
  image: any;
  exchange: any;
}
export default function DetailWidget({
  id,
  type,
  state,
  message,
  data,
  name,
  image,
  exchange
}: Props) {
  const navigate = useKeepQueryParamsNavigate();

  return (
    <>
      <ModalGrid>
        <ModalImageWrapper>
          {type === "SUCCESS" && state === ExchangeState.Committed && (
            <DetailOpenSea
              exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
            />
          )}
          <Image src={image} dataTestId="offerImage" />
        </ModalImageWrapper>
        <div>
          <Widget>
            <Grid flexDirection="column">
              <Typography
                tag="p"
                style={{
                  margin: 0,
                  color: type === "ERROR" ? colors.red : colors.black
                }}
              >
                <b>{message}</b>
              </Typography>
              <Typography
                tag="h2"
                style={{ margin: "1rem 0", color: colors.secondary }}
              >
                {name}
              </Typography>
            </Grid>
            <Break />
            <div>
              <DetailTable align noBorder data={data} />
            </div>
          </Widget>
          <WidgetButtonWrapper>
            <Button
              theme="secondary"
              onClick={() => {
                const exchangeId = id || false;
                if (exchangeId) {
                  const pathname = generatePath(BosonRoutes.Exchange, {
                    [UrlParameters.exchangeId]: exchangeId
                  });
                  navigate({
                    pathname
                  });
                } else {
                  navigate({
                    pathname: BosonRoutes.YourAccount,
                    search: `${AccountQueryParameters.tab}=exchanges`
                  });
                }
              }}
            >
              {id ? "View my item" : "View my items"}
            </Button>
            <Button
              theme="primary"
              onClick={() => {
                navigate({ pathname: BosonRoutes.Explore });
              }}
            >
              Discover more
            </Button>
          </WidgetButtonWrapper>
        </div>
      </ModalGrid>
    </>
  );
}

import { subgraph } from "@bosonprotocol/react-kit";
import { BasicCommitDetailWidget } from "components/detail/DetailWidget/BasicCommitDetailWidget";
import { Offer } from "lib/types/offer";
import { generatePath } from "react-router-dom";

import {
  ModalGrid,
  ModalImageWrapper,
  Widget,
  WidgetButtonWrapper
} from "../../../components/detail/Detail.style";
import DetailOpenSea from "../../../components/detail/DetailOpenSea";
import {
  AccountQueryParameters,
  UrlParameters
} from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import Video from "../../ui/Video";
import { useModal } from "../useModal";

type Props = {
  state: string;
  message: string;
  name: string;
  image: string;
  animationUrl: string;
} & (
  | {
      id: string;
      type: "SUCCESS";
      exchange: subgraph.ExchangeFieldsFragment;
    }
  | {
      id?: undefined;
      type: "ERROR";
      exchange?: undefined;
    }
);
export default function DetailWidget({
  id,
  type,
  state,
  message,
  name,
  image,
  exchange,
  animationUrl
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const { hideModal } = useModal();

  return (
    <>
      <ModalGrid>
        <ModalImageWrapper>
          {type === "SUCCESS" && state === subgraph.ExchangeState.Committed && (
            <DetailOpenSea exchange={exchange} />
          )}
          {animationUrl ? (
            <Video
              src={animationUrl}
              dataTestId="offerAnimationUrl"
              videoProps={{ muted: true, loop: true, autoPlay: true }}
              componentWhileLoading={() => (
                <Image src={image} dataTestId="offerImage" />
              )}
            />
          ) : (
            <Image src={image} dataTestId="offerImage" />
          )}
        </ModalImageWrapper>
        <div style={{ width: "100%" }}>
          <Widget style={{ marginBottom: "1rem" }}>
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
          </Widget>
          {exchange?.offer && (
            <BasicCommitDetailWidget
              isPreview={false}
              selectedVariant={{
                offer: exchange.offer as Offer,
                variations: []
              }}
            />
          )}
          <WidgetButtonWrapper>
            <BosonButton
              variant="primaryFill"
              onClick={() => {
                const exchangeId = id || false;
                hideModal();
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
            </BosonButton>
            <BosonButton
              variant="accentInverted"
              onClick={() => {
                navigate({ pathname: BosonRoutes.Explore });
              }}
            >
              Discover more
            </BosonButton>
          </WidgetButtonWrapper>
        </div>
      </ModalGrid>
    </>
  );
}

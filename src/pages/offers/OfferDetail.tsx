import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { useEffect, useReducer, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import OfferStatuses from "../../components/offer/OfferStatuses";
import Grid from "../../components/ui/Grid";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useOffer } from "../../lib/utils/hooks/offers/useOffer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { isAccountSeller } from "../../lib/utils/isAccountSeller";
import { MOCK } from "./mock";
import {
  DarkerBackground,
  ImageContainer,
  OfferWrapper,
  StatusContainer,
  StatusSubContainer
} from "./OfferDetail.style";
import OfferDetailWidget from "./OfferDetailWidget";

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();
  const widgetRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fromAccountPage =
    (location.state as { from: string })?.from === BosonRoutes.YourAccount;
  const [isTabSellerSelected, setTabSellerSelected] =
    useState<boolean>(fromAccountPage);
  const [createdExchangeId, setCreatedExchangeId] = useState<string>("");
  const [isCreatedExchangeModalOpen, toggleCreatedExchangeModal] = useReducer(
    (state) => !state,
    false
  );
  const { address: account } = useAccount();
  const address = account || "";
  const navigate = useKeepQueryParamsNavigate();

  const {
    data: offer,
    isError,
    isLoading
  } = useOffer(
    {
      offerId: offerId || ""
    },
    { enabled: !!offerId }
  );

  useEffect(() => {
    if (!address) {
      setTabSellerSelected(false);
    }
  }, [address]);

  useEffect(() => {
    if (offer && widgetRef.current) {
      const widgetContainer = document.createElement("div");
      widgetContainer.style.width = "100%";
      widgetRef.current.appendChild(widgetContainer);
      manageOffer(offer.id, CONFIG, widgetContainer, {
        forceBuyerView: !isTabSellerSelected
      });
      return () => widgetContainer.remove();
    }

    return;
  }, [offer, isTabSellerSelected, address]);

  useEffect(() => {
    function handleMessageFromIframe(e: MessageEvent) {
      const { target, message, exchangeId } = e.data || {};

      if (target === "boson" && message === "created-exchange") {
        setCreatedExchangeId(exchangeId);
        toggleCreatedExchangeModal();
      }
    }

    window.addEventListener("message", handleMessageFromIframe);
    return () => window.removeEventListener("message", handleMessageFromIframe);
  }, []);

  if (!offerId) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="errorOffer">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offer) {
    return <div data-testid="notFound">This offer does not exist</div>;
  }

  if (!offer.isValid) {
    return (
      <div data-testid="invalidMetadata">
        This offer does not match the expected metadata standard this
        application enforces
      </div>
    );
  }
  const isSeller = isAccountSeller(offer, address);

  const name = offer.metadata?.name || "Untitled";
  const offerImg = offer.metadata.imageUrl;
  const sellerId = offer.seller?.id;
  const sellerAddress = offer.seller?.operator;
  const description = offer.metadata?.description || "";

  return (
    <>
      <OfferWrapper alignItems="flex-start" gap="50px">
        <div>
          <ImageContainer>
            <StatusContainer>
              <StatusSubContainer>
                <OfferStatuses offer={offer} />
              </StatusSubContainer>
            </StatusContainer>
            <Image src={offerImg} />
          </ImageContainer>
        </div>
        <div>
          <SellerID seller={offer?.seller} justifyContent="flex-start">
            <div>Hot</div>
          </SellerID>
          <Typography tag="h2">{name}</Typography>
          <OfferDetailWidget />
        </div>
      </OfferWrapper>
      {/* TODO: Remove mocks */}
      <DarkerBackground>
        <Grid gap="5rem" flex="1" padding="2.5rem 5rem" alignItems="flex-start">
          <div>
            <Typography tag="h3">Product data</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              {MOCK.description}
            </Typography>
          </div>
          <div>
            <Typography tag="h3">About the artist</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              {MOCK.aboutArtist}
            </Typography>
          </div>
        </Grid>
      </DarkerBackground>
    </>
  );
}

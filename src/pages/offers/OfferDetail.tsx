import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import OfferDetailChart from "../../components/offer/OfferDetailChart";
import OfferDetailModal from "../../components/offer/OfferDetailModal";
import OfferDetailShare from "../../components/offer/OfferDetailShare";
import OfferDetailSlider from "../../components/offer/OfferDetailSlider";
import OfferDetailTable from "../../components/offer/OfferDetailTable";
import OfferDetailWidget from "../../components/offer/OfferDetailWidget";
import OfferLabel from "../../components/offer/OfferLabel";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import getOfferImage from "../../lib/utils/hooks/offers/getOfferImage";
import { useOffer } from "../../lib/utils/hooks/offers/useOffer";
import { useSellers } from "../../lib/utils/hooks/useSellers";
import { isAccountSeller } from "../../lib/utils/isAccountSeller";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import CreatedExchangeModal from "./CreatedExchangeModal";
import { MOCK } from "./mock/mock";
import {
  DarkerBackground,
  LightBackground,
  MainOfferGrid,
  OfferGrid,
  OfferWrapper,
  WidgetContainer
} from "./OfferDetail.style";

const ImageWrapper = styled.div`
  position: relative;
`;
const OpenSeaButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.OfferStatus};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  border: 2px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.blue};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  &:hover {
    color: ${colors.black};
  }
`;
const Toggle = styled.div`
  border: 1px solid ${colors.bosonSkyBlue};
  color: ${colors.bosonSkyBlue};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.75rem;
  gap: 0.25rem;
  margin-bottom: 2rem;
`;

const InfoIconTextWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 30%;
`;

const Tab = styled("button")<{ $isSelected: boolean }>`
  all: unset;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? colors.blue : colors.lightGrey};
  padding: 0.5rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${(props) => (props.$isSelected ? colors.white : colors.black)};
  width: 200px;
  max-width: 100%;
  text-align: center;
`;
const InfoIcon = styled(IoIosInformationCircleOutline).attrs({
  fill: colors.bosonSkyBlue
})`
  position: relative;
  right: 2px;
  font-size: 27px;
`;

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();

  const widgetRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fromAccountPage =
    (location.state as { from: string })?.from === BosonRoutes.YourAccount;
  const [isTabSellerSelected, setTabSellerSelected] =
    useState<boolean>(fromAccountPage);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [createdExchangeId, setCreatedExchangeId] = useState<string>("");
  const [isCreatedExchangeModalOpen, toggleCreatedExchangeModal] = useReducer(
    (state) => !state,
    false
  );
  const { address: account } = useAccount();
  const address = account || "";
  const customMetaTransactionsApiKey = useCustomStoreQueryParameter(
    "metaTransactionsApiKey"
  );

  const handleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

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

  const { data: sellers } = useSellers({
    admin: offer?.seller.admin,
    includeFunds: true
  });
  const sellerAvailableDeposit = sellers?.[0].funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = offer?.sellerDeposit;
  const hasSellerEnoughFunds =
    Number(sellerAvailableDeposit) >= Number(offerRequiredDeposit);

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
      manageOffer(
        offer.id,
        {
          ...CONFIG,
          metaTransactionsApiKey:
            customMetaTransactionsApiKey || CONFIG.metaTransactionsApiKey
        },
        widgetContainer,
        {
          forceBuyerView: !isTabSellerSelected
        }
      );
      return () => widgetContainer.remove();
    }

    return;
  }, [offer, isTabSellerSelected, address, customMetaTransactionsApiKey]);

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
  const offerImg = getOfferImage(offer.id, name);
  const description = offer.metadata?.description || "";

  return (
    <OfferWrapper>
      <LightBackground>
        {isSeller && (
          <Toggle>
            <InfoIconTextWrapper>
              <InfoIcon />
              <span>You are the owner of this offer. Toggle view:</span>
            </InfoIconTextWrapper>
            <Tabs>
              <Tab
                $isSelected={!isTabSellerSelected}
                onClick={() => setTabSellerSelected(false)}
              >
                Buyer
              </Tab>
              <Tab
                $isSelected={isTabSellerSelected}
                onClick={() => setTabSellerSelected(true)}
              >
                Seller
              </Tab>
            </Tabs>
          </Toggle>
        )}
        <MainOfferGrid>
          <ImageWrapper>
            <OpenSeaButton>
              View on OpenSea
              <HiOutlineExternalLink size={18} />
            </OpenSeaButton>
            <Image src={offerImg} dataTestId="offerImage" />
          </ImageWrapper>
          <div>
            <SellerID seller={offer?.seller} justifyContent="flex-start">
              <OfferLabel offer={offer} />
            </SellerID>
            <Typography
              tag="h1"
              data-testid="name"
              style={{ fontSize: "2rem", marginBottom: "2rem" }}
            >
              {name}
            </Typography>
            {isSeller ? (
              <>
                {isTabSellerSelected ? (
                  <WidgetContainer ref={widgetRef}></WidgetContainer>
                ) : (
                  <OfferDetailWidget
                    offer={offer}
                    handleModal={handleModal}
                    name={name}
                    image={offerImg}
                    hasSellerEnoughFunds={hasSellerEnoughFunds}
                  />
                )}
              </>
            ) : (
              <OfferDetailWidget
                offer={offer}
                handleModal={handleModal}
                name={name}
                image={offerImg}
                hasSellerEnoughFunds={hasSellerEnoughFunds}
              />
            )}
          </div>
          <OfferDetailShare />
        </MainOfferGrid>
      </LightBackground>
      <DarkerBackground>
        <OfferGrid>
          <div>
            <Typography tag="h3">Product data</Typography>
            <Typography
              tag="p"
              style={{ color: colors.darkGrey }}
              data-testid="description"
            >
              {description || MOCK.description}
            </Typography>
            <OfferDetailTable data={MOCK.table} />
          </div>
          <div>
            <Typography tag="h3">About the artist</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              {MOCK.aboutArtist}
            </Typography>
          </div>
        </OfferGrid>
        <OfferDetailSlider images={MOCK.images} />
        <OfferGrid>
          <OfferDetailChart offer={offer} />
          <div>
            <Typography tag="h3">Shipping information</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              {MOCK.shipping}
            </Typography>
            <OfferDetailTable data={MOCK.shippingTable} />
          </div>
        </OfferGrid>
      </DarkerBackground>
      <OfferDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <CreatedExchangeModal
        isOpen={isCreatedExchangeModalOpen}
        onClose={() => toggleCreatedExchangeModal()}
        exchangeId={createdExchangeId}
      />
    </OfferWrapper>
  );
}

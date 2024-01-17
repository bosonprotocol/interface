/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetOfferDetailData } from "@bosonprotocol/react-kit";
import { formatUnits } from "@ethersproject/units";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { BigNumber, FixedNumber } from "ethers";
import { CONFIG } from "lib/config";
import { Plus, Warning } from "phosphor-react";
import styled from "styled-components";

import Price from "../../../components/price/index";
import { colors } from "../../../lib/styles/colors";
import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import {
  Break,
  ModalGrid,
  ModalImageWrapper,
  Widget
} from "../../detail/Detail.style";
import DetailTable from "../../detail/DetailTable";
import TokenGated from "../../detail/DetailWidget/TokenGated";
import Tooltip from "../../tooltip/Tooltip";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import Video from "../../ui/Video";
import { MODAL_TYPES } from "../ModalComponents";
import { useModal } from "../useModal";
interface Props {
  message: string;
  name: string;
  image: string;
  offer: any;
  onCreateNew?: () => void;
  onViewMyItem: () => void;
  hasMultipleVariants: boolean;
}
const Funds = styled.div`
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  background: ${colors.black};
  color: ${colors.white};
  p {
    margin: 0;
  }
`;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
  margin-bottom: 2rem;
  [data-testid="price-grid"] {
    justify-content: center;
  }
`;

const StyledProgress = styled(ProgressPrimitive.Root)`
  padding: 0.3rem;
  margin-top: 0.75rem;
  position: relative;
  overflow: hidden;
  background: ${colors.grey};
  border-radius: 99999px;
  width: 100%;
  height: 1.563rem;
`;

const StyledProgressLayer = styled.div`
  height: 100%;
  overflow: hidden;
  border-radius: 50px;
  width: 100%;
`;

const StyledIndicator = styled(ProgressPrimitive.Indicator)`
  background-color: ${colors.green};
  width: 100%;
  height: 100%;
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

const FundTile = styled(Typography)`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span {
    line-height: 2;
  }
`;

const Amount = styled.span`
  position: absolute;
  top: 50%;
  right: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  transform: translate(0, -50%);
`;

const PROGRESS = 15;
const exchangePolicyCheckResult = {
  isValid: true,
  errors: []
};
export default function ProductCreateSuccess({
  message,
  name,
  image,
  offer,
  onCreateNew,
  onViewMyItem,
  hasMultipleVariants
}: Props) {
  const commitProxyAddress = useCustomStoreQueryParameter("commitProxyAddress");
  const openseaLinkToOriginalMainnetCollection = useCustomStoreQueryParameter(
    "openseaLinkToOriginalMainnetCollection"
  );

  const { showModal } = useModal();

  const offerDetailData = useGetOfferDetailData({
    dateFormat: CONFIG.dateFormat,
    defaultCurrencySymbol: CONFIG.defaultCurrency.symbol,
    offer,
    exchange: null,
    onExchangePolicyClick: () => {
      showModal(MODAL_TYPES.EXCHANGE_POLICY_DETAILS, {
        title: "Exchange Policy Details",
        offerId: offer.id,
        offerData: offer,
        exchangePolicyCheckResult
      });
    },
    exchangePolicyCheckResult
  });

  const suggestedAmount = FixedNumber.fromString(
    formatUnits(
      BigNumber.from(offer?.sellerDeposit).mul(Number(offer?.quantityInitial)),
      Number(offer?.exchangeToken?.decimals || 18)
    )
  );

  const mulBy = FixedNumber.fromString("0.15");
  const fifteenOfAmmount = suggestedAmount.mulUnsafe(mulBy);

  const hasDeposit = offer?.sellerDeposit !== "0";
  const animationUrl = offer?.metadata?.animationUrl;

  return (
    <>
      <ModalGrid>
        <ModalImageWrapper
          style={{
            height: "100%"
          }}
        >
          {animationUrl ? (
            <Video
              src={animationUrl}
              dataTestId="offerAnimationUrl"
              videoProps={{ muted: true, loop: true, autoPlay: true }}
            />
          ) : (
            <Image
              src={image}
              dataTestId="offerImage"
              style={{
                height: "100%"
              }}
            />
          )}
        </ModalImageWrapper>
        <div>
          <Widget>
            <Grid flexDirection="column">
              <Typography tag="p" margin="0.5rem 0 0 0">
                <b>{message}</b>
              </Typography>
              <Typography
                tag="h2"
                margin="1rem 0"
                color={colors.secondary}
                $fontSize="1.5rem"
              >
                {name}
              </Typography>
              <StyledPrice
                isExchange={false}
                currencySymbol={offer.exchangeToken.symbol}
                value={offer.price}
                decimals={offer.exchangeToken.decimals}
                tag="h3"
                convert
                withAsterisk={hasMultipleVariants}
              />
            </Grid>
            <Break />
            {offer.condition && (
              <TokenGated
                offer={offer}
                commitProxyAddress={commitProxyAddress}
                openseaLinkToOriginalMainnetCollection={
                  openseaLinkToOriginalMainnetCollection
                }
                isConditionMet={false}
              />
            )}
            <div style={{ paddingTop: "2rem" }}>
              <DetailTable align noBorder data={offerDetailData} />
            </div>
          </Widget>
          {hasDeposit && (
            <Funds>
              <FundTile tag="p">
                <span>
                  <Warning
                    color={colors.green}
                    size={20}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Deposit funds to activate offer
                </span>
                <Tooltip
                  content="In order for your offer to go live you must first provide funds to cover your seller deposit. When a buyer commits to your offer, your deposit will be put into escrow as part of the exchange."
                  size={16}
                />
              </FundTile>
              <Typography tag="p" $fontSize="0.75rem">
                In order for your offer to go live you must first provide funds
                to cover your seller deposit. When a buyer commits to your
                offer, your deposit will be put into escrow as part of the
                exchange.
              </Typography>
              <Typography
                tag="p"
                margin="1rem 0 0 0"
                $fontSize="0.75rem"
                fontWeight="600"
              >
                Suggested pool amount: 15%
              </Typography>
              <StyledProgress>
                <StyledProgressLayer>
                  <StyledIndicator
                    style={{ transform: `translateX(-${100 - PROGRESS}%)` }}
                  />
                  <Amount>
                    {fifteenOfAmmount?._value} / {suggestedAmount?._value}{" "}
                    {offer.exchangeToken.symbol}
                  </Amount>
                </StyledProgressLayer>
              </StyledProgress>
            </Funds>
          )}
          <Grid flex="1 1" gap="1rem" margin="1rem 0 0 0">
            <BosonButton
              type="button"
              variant="primaryFill"
              onClick={onViewMyItem}
            >
              View my item
            </BosonButton>
            {onCreateNew && (
              <BosonButton
                type="button"
                variant="accentInverted"
                onClick={onCreateNew}
              >
                Create new
                <Plus size={14} />
              </BosonButton>
            )}
          </Grid>
        </div>
      </ModalGrid>
    </>
  );
}

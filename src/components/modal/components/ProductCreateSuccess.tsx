/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatUnits } from "@ethersproject/units";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { BigNumber } from "ethers";
import { Plus } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";

import { getOfferDetailData } from "../../../components/detail/DetailWidget/DetailWidget";
import Price from "../../../components/price/index";
import { useConvertedPrice } from "../../../components/price/useConvertedPrice";
import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import {
  Break,
  ModalGrid,
  ModalImageWrapper,
  Widget,
  WidgetButtonWrapper
} from "../../detail/Detail.style";
import DetailTable from "../../detail/DetailTable";
import Tooltip from "../../tooltip/Tooltip";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
interface Props {
  message: string;
  name: string;
  image: string;
  offer: any;
  onCreateNewProject: () => void;
  onViewMyItem: () => void;
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
const StyledWidgetButtonWrapper = styled(WidgetButtonWrapper)`
  button {
    width: 50%;
  }
`;

const FundTile = styled(Typography)`
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Amount = styled.span`
  position: absolute;
  top: 50%;
  right: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  transform: translate(0, -50%);
`;

const PROGRESS = 15;

export default function ProductCreateSuccess({
  message,
  name,
  image,
  offer,
  onCreateNewProject,
  onViewMyItem
}: Props) {
  const convertedPrice = useConvertedPrice({
    value: offer?.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const OFFER_DETAIL_DATA = useMemo(
    () => getOfferDetailData(offer, convertedPrice, false),
    [convertedPrice, offer]
  );

  const handleCreateNew = () => {
    onCreateNewProject();
  };

  const suggestedAmount = formatUnits(
    BigNumber.from(offer.sellerDeposit).mul(parseInt(offer.quantityInitial)),
    Number(CONFIG.nativeCoin?.decimals) || 18
  );

  const fifteenOfAmmount = parseFloat(suggestedAmount) * 0.15;

  return (
    <>
      <ModalGrid>
        <ModalImageWrapper
          style={{
            height: "100%"
          }}
        >
          <Image
            src={image}
            dataTestId="offerImage"
            style={{
              height: "100%"
            }}
          />
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
                address={offer.exchangeToken.address}
                currencySymbol={offer.exchangeToken.symbol}
                value={offer.price}
                decimals={offer.exchangeToken.decimals}
                tag="h3"
                convert
              />
            </Grid>
            <Break />
            <div>
              <DetailTable align noBorder data={OFFER_DETAIL_DATA} />
            </div>
          </Widget>
          <Funds>
            <FundTile tag="p">
              Please provide
              <Tooltip content="NEED TO BE ADDED" size={16} />
            </FundTile>
            <Typography tag="p" $fontSize="0.75rem">
              Describe here why seller should provide funds ..
              <br />
              alos in multiple lines possible.
            </Typography>
            <Typography
              tag="p"
              margin="1rem 0 0 0"
              $fontSize="0.75rem"
              fontWeight="bold"
            >
              Suggested pool amount: 15%
            </Typography>
            <StyledProgress>
              <StyledProgressLayer>
                <StyledIndicator
                  style={{ transform: `translateX(-${100 - PROGRESS}%)` }}
                />
                <Amount>
                  {fifteenOfAmmount} / {suggestedAmount}{" "}
                  {offer.exchangeToken.symbol}
                </Amount>
              </StyledProgressLayer>
            </StyledProgress>
          </Funds>
          <StyledWidgetButtonWrapper>
            <Button type="button" theme="secondary" onClick={onViewMyItem}>
              View my item
            </Button>
            <Button type="button" theme="primary" onClick={handleCreateNew}>
              Create new
              <Plus size={14} />
            </Button>
          </StyledWidgetButtonWrapper>
        </div>
      </ModalGrid>
    </>
  );
}

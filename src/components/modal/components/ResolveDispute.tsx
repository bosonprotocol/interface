import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import Price from "../../price";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import SellerID from "../../ui/SellerID";
import { ModalProps } from "../ModalContext";
import { ReactComponent as InfoSvg } from "./info.svg";

interface Props {
  exchange: Exchange;

  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const Name = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const ProposedSolution = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Info = styled.div`
  padding: 1.5rem;
  background-color: ${colors.lightGrey};
  margin: 2rem 0;
  color: ${colors.darkGrey};
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoSvg)`
  margin-right: 1.1875rem;
`;

const ButtonsSection = styled.div`
  border-top: 2px solid ${colors.border};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export default function ResolveDispute({ exchange, hideModal }: Props) {
  const { offer } = exchange;
  return (
    <>
      <Grid justifyContent="space-between">
        <Grid>
          <img src={offer.metadata.imageUrl} alt="Exchange url" width={80} />
          <Grid
            flexDirection="column"
            alignItems="flex-start"
            margin="1rem"
            gap="0.5rem"
          >
            <Name>{offer.metadata.name}</Name>
            <SellerID
              seller={offer?.seller}
              offerName={offer.metadata.name || ""}
              justifyContent="flex-start"
              withProfileImage
            />
          </Grid>
        </Grid>
        <Price
          address={offer.exchangeToken.address}
          currencySymbol={offer.exchangeToken.symbol}
          value={offer.price}
          decimals={offer.exchangeToken.decimals}
        />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <Info>
        <InfoIcon />
        By accepting this proposal the dispute is resolved and the refund is
        implemented
      </Info>
      <ButtonsSection>
        <Button theme="secondary">Accept proposal</Button>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}

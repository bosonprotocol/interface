import { useState } from "react";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { colors } from "../../../lib/styles/colors";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const DepositButton = styled(Button)`
  padding: 0.75rem 1.5rem;
`;

const ProtocolStrong = styled.strong`
  margin-right: 0.25rem;
`;

const InputWrapper = styled(Grid)`
  flex: 1;
  gap: 1rem;

  margin-top: -1rem;
  padding: 1.125rem 1rem;
  max-height: 3.5rem;
  background: ${colors.darkGrey};
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: ${colors.white};
  &:focus {
    outline: none;
  }
`;

const AmountWrapper = styled.div`
  width: 100%;
`;
// interface Props {
//   offer: Offer;
//   offerId?: string;
//   refetch: () => void;
// }

export default function FinanceWithdraw() {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const { data: signer } = useSigner();
  const { hideModal } = useModal();

  const handleChangeDepositAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setDepositAmount(newValue);
  };

  return (
    <Grid
      flexDirection="column"
      alignItems="flex-start"
      gap="1.5rem"
      margin="-2rem 0 0 0"
    >
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Withdrawable Balance:</ProtocolStrong> 100 USDC
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
        Enter Amount To Withdraw:
      </Typography>
      <AmountWrapper>
        <InputWrapper>
          <Input
            name="search"
            onChange={handleChangeDepositAmount}
            value={depositAmount}
          />
          <div>USDC</div>
        </InputWrapper>
        <Typography
          tag="p"
          $fontSize="0.75rem"
          color={colors.darkGrey}
          fontWeight="bold"
        >
          (Max Limit 89 USDC)
        </Typography>
      </AmountWrapper>
      <Grid>
        <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
          Wallet Balance: 89 USDC
        </Typography>
        <DepositButton theme="secondary" size="small">
          <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
            Withdraw USDC
          </Typography>
        </DepositButton>
      </Grid>
    </Grid>
  );
}

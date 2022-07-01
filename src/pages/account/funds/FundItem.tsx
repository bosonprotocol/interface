import { FundsEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useState } from "react";

import useWithdrawFunds from "./useWithdrawFunds";

interface Props {
  accountId: string;
  fund: FundsEntityFieldsFragment;
}

export default function FundItem({ accountId, fund }: Props) {
  const [amountToWithdraw, setAmountToWithdraw] = useState(
    fund.availableAmount
  );

  const withdrawFunds = useWithdrawFunds({
    accountId: accountId,
    tokensToWithdraw: [
      { address: fund.token.address, amount: amountToWithdraw }
    ]
  });

  return (
    <div>
      <p>{fund.token.name}</p>
      <p>{fund.availableAmount}</p>
      <input
        type="text"
        onChange={(e) => setAmountToWithdraw(e.target.value)}
        value={amountToWithdraw}
      ></input>
      <button onClick={withdrawFunds}>Withdraw token</button>
    </div>
  );
}

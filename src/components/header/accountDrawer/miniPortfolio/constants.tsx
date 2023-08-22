import {
  SwapOrderStatus,
  TransactionStatus
} from "graphql/data/__generated__/types-and-hooks";
import { UniswapXOrderStatus } from "lib/utils/hooks/orders/types";

import { TransactionType } from "./types";

// use even number because rows are in groups of 2
export const DEFAULT_NFT_QUERY_AMOUNT = 26;

const TransactionTitleTable: {
  [key in TransactionType]: { [state in TransactionStatus]: string };
} = {
  [TransactionType.SWAP]: {
    [TransactionStatus.Pending]: `Swapping`,
    [TransactionStatus.Confirmed]: `Swapped`,
    [TransactionStatus.Failed]: `Swap failed`
  },
  [TransactionType.WRAP]: {
    [TransactionStatus.Pending]: `Wrapping`,
    [TransactionStatus.Confirmed]: `Wrapped`,
    [TransactionStatus.Failed]: `Wrap failed`
  },
  [TransactionType.ADD_LIQUIDITY_V3_POOL]: {
    [TransactionStatus.Pending]: `Adding liquidity`,
    [TransactionStatus.Confirmed]: `Added liquidity`,
    [TransactionStatus.Failed]: `Add liquidity failed`
  },
  [TransactionType.REMOVE_LIQUIDITY_V3]: {
    [TransactionStatus.Pending]: `Removing liquidity`,
    [TransactionStatus.Confirmed]: `Removed liquidity`,
    [TransactionStatus.Failed]: `Remove liquidity failed`
  },
  [TransactionType.CREATE_V3_POOL]: {
    [TransactionStatus.Pending]: `Creating pool`,
    [TransactionStatus.Confirmed]: `Created pool`,
    [TransactionStatus.Failed]: `Create pool failed`
  },
  [TransactionType.COLLECT_FEES]: {
    [TransactionStatus.Pending]: `Collecting fees`,
    [TransactionStatus.Confirmed]: `Collected fees`,
    [TransactionStatus.Failed]: `Collect fees failed`
  },
  [TransactionType.APPROVAL]: {
    [TransactionStatus.Pending]: `Approving`,
    [TransactionStatus.Confirmed]: `Approved`,
    [TransactionStatus.Failed]: `Approval failed`
  },
  [TransactionType.CLAIM]: {
    [TransactionStatus.Pending]: `Claiming`,
    [TransactionStatus.Confirmed]: `Claimed`,
    [TransactionStatus.Failed]: `Claim failed`
  },
  [TransactionType.BUY]: {
    [TransactionStatus.Pending]: `Buying`,
    [TransactionStatus.Confirmed]: `Bough`,
    [TransactionStatus.Failed]: `Buy failed`
  },
  [TransactionType.SEND]: {
    [TransactionStatus.Pending]: `Sending`,
    [TransactionStatus.Confirmed]: `Sen`,
    [TransactionStatus.Failed]: `Send failed`
  },
  [TransactionType.RECEIVE]: {
    [TransactionStatus.Pending]: `Receiving`,
    [TransactionStatus.Confirmed]: `Received`,
    [TransactionStatus.Failed]: `Receive failed`
  },
  [TransactionType.MINT]: {
    [TransactionStatus.Pending]: `Minting`,
    [TransactionStatus.Confirmed]: `Minted`,
    [TransactionStatus.Failed]: `Mint failed`
  },
  [TransactionType.BURN]: {
    [TransactionStatus.Pending]: `Burning`,
    [TransactionStatus.Confirmed]: `Burned`,
    [TransactionStatus.Failed]: `Burn failed`
  },
  [TransactionType.VOTE]: {
    [TransactionStatus.Pending]: `Voting`,
    [TransactionStatus.Confirmed]: `Voted`,
    [TransactionStatus.Failed]: `Vote failed`
  },
  [TransactionType.QUEUE]: {
    [TransactionStatus.Pending]: `Queuing`,
    [TransactionStatus.Confirmed]: `Queued`,
    [TransactionStatus.Failed]: `Queue failed`
  },
  [TransactionType.EXECUTE]: {
    [TransactionStatus.Pending]: `Executing`,
    [TransactionStatus.Confirmed]: `Executed`,
    [TransactionStatus.Failed]: `Execute failed`
  },
  [TransactionType.BORROW]: {
    [TransactionStatus.Pending]: `Borrowing`,
    [TransactionStatus.Confirmed]: `Borrowed`,
    [TransactionStatus.Failed]: `Borrow failed`
  },
  [TransactionType.REPAY]: {
    [TransactionStatus.Pending]: `Repaying`,
    [TransactionStatus.Confirmed]: `Repaid`,
    [TransactionStatus.Failed]: `Repay failed`
  },
  [TransactionType.DEPLOY]: {
    [TransactionStatus.Pending]: `Deploying`,
    [TransactionStatus.Confirmed]: `Deployed`,
    [TransactionStatus.Failed]: `Deploy failed`
  },
  [TransactionType.CANCEL]: {
    [TransactionStatus.Pending]: `Cancelling`,
    [TransactionStatus.Confirmed]: `Cancelled`,
    [TransactionStatus.Failed]: `Cancel failed`
  },
  [TransactionType.DELEGATE]: {
    [TransactionStatus.Pending]: `Delegating`,
    [TransactionStatus.Confirmed]: `Delegated`,
    [TransactionStatus.Failed]: `Delegate failed`
  },
  [TransactionType.DEPOSIT_LIQUIDITY_STAKING]: {
    [TransactionStatus.Pending]: `Depositing`,
    [TransactionStatus.Confirmed]: `Deposited`,
    [TransactionStatus.Failed]: `Deposit failed`
  },
  [TransactionType.WITHDRAW_LIQUIDITY_STAKING]: {
    [TransactionStatus.Pending]: `Withdrawing`,
    [TransactionStatus.Confirmed]: `Withdrew`,
    [TransactionStatus.Failed]: `Withdraw failed`
  },
  [TransactionType.ADD_LIQUIDITY_V2_POOL]: {
    [TransactionStatus.Pending]: `Adding V2 liquidity`,
    [TransactionStatus.Confirmed]: `Added V2 liquidity`,
    [TransactionStatus.Failed]: `Add V2 liquidity failed`
  },
  [TransactionType.MIGRATE_LIQUIDITY_V3]: {
    [TransactionStatus.Pending]: `Migrating liquidity`,
    [TransactionStatus.Confirmed]: `Migrated liquidity`,
    [TransactionStatus.Failed]: `Migrate liquidity failed`
  },
  [TransactionType.SUBMIT_PROPOSAL]: {
    [TransactionStatus.Pending]: `Submitting proposal`,
    [TransactionStatus.Confirmed]: `Submitted proposal`,
    [TransactionStatus.Failed]: `Submit proposal failed`
  }
};

export const CancelledTransactionTitleTable: {
  [key in TransactionType]: string;
} = {
  [TransactionType.SWAP]: `Swap cancelled`,
  [TransactionType.WRAP]: `Wrap cancelled`,
  [TransactionType.ADD_LIQUIDITY_V3_POOL]: `Add liquidity cancelled`,
  [TransactionType.REMOVE_LIQUIDITY_V3]: `Remove liquidity cancelled`,
  [TransactionType.CREATE_V3_POOL]: `Create pool cancelled`,
  [TransactionType.COLLECT_FEES]: `Collect fees cancelled`,
  [TransactionType.APPROVAL]: `Approval cancelled`,
  [TransactionType.CLAIM]: `Claim cancelled`,
  [TransactionType.BUY]: `Buy cancelled`,
  [TransactionType.SEND]: `Send cancelled`,
  [TransactionType.RECEIVE]: `Receive cancelled`,
  [TransactionType.MINT]: `Mint cancelled`,
  [TransactionType.BURN]: `Burn cancelled`,
  [TransactionType.VOTE]: `Vote cancelled`,
  [TransactionType.QUEUE]: `Queue cancelled`,
  [TransactionType.EXECUTE]: `Execute cancelled`,
  [TransactionType.BORROW]: `Borrow cancelled`,
  [TransactionType.REPAY]: `Repay cancelled`,
  [TransactionType.DEPLOY]: `Deploy cancelled`,
  [TransactionType.CANCEL]: `Cancellation cancelled`,
  [TransactionType.DELEGATE]: `Delegate cancelled`,
  [TransactionType.DEPOSIT_LIQUIDITY_STAKING]: `Deposit cancelled`,
  [TransactionType.WITHDRAW_LIQUIDITY_STAKING]: `Withdrawal cancelled`,
  [TransactionType.ADD_LIQUIDITY_V2_POOL]: `Add V2 liquidity cancelled`,
  [TransactionType.MIGRATE_LIQUIDITY_V3]: `Migrate liquidity cancelled`,
  [TransactionType.SUBMIT_PROPOSAL]: `Submit proposal cancelled`
};

const AlternateTransactionTitleTable: {
  [key in TransactionType]?: { [state in TransactionStatus]: string };
} = {
  [TransactionType.WRAP]: {
    [TransactionStatus.Pending]: `Unwrapping`,
    [TransactionStatus.Confirmed]: `Unwrapped`,
    [TransactionStatus.Failed]: `Unwrap failed`
  },
  [TransactionType.APPROVAL]: {
    [TransactionStatus.Pending]: `Revoking approval`,
    [TransactionStatus.Confirmed]: `Revoked approval`,
    [TransactionStatus.Failed]: `Revoke approval failed`
  }
};

export function getActivityTitle(
  type: TransactionType,
  status: TransactionStatus,
  alternate?: boolean
) {
  if (alternate) {
    const alternateTitle = AlternateTransactionTitleTable[type];
    if (alternateTitle !== undefined) return alternateTitle[status];
  }
  return TransactionTitleTable[type][status];
}

const SwapTitleTable = TransactionTitleTable[TransactionType.SWAP];
export const OrderTextTable: {
  [status in UniswapXOrderStatus]: {
    title: string;
    status: TransactionStatus;
    statusMessage?: string;
  };
} = {
  [UniswapXOrderStatus.OPEN]: {
    title: SwapTitleTable.PENDING,
    status: TransactionStatus.Pending
  },
  [UniswapXOrderStatus.FILLED]: {
    title: SwapTitleTable.CONFIRMED,
    status: TransactionStatus.Confirmed
  },
  [UniswapXOrderStatus.EXPIRED]: {
    title: `Swap expired`,
    statusMessage: `Your swap could not be fulfilled at this time. Please try again.`,
    status: TransactionStatus.Failed
  },
  [UniswapXOrderStatus.ERROR]: {
    title: SwapTitleTable.FAILED,
    status: TransactionStatus.Failed
  },
  [UniswapXOrderStatus.INSUFFICIENT_FUNDS]: {
    title: SwapTitleTable.FAILED,
    statusMessage: `Your account had insufficent funds to complete this swap.`,
    status: TransactionStatus.Failed
  },
  [UniswapXOrderStatus.CANCELLED]: {
    title: `Swap cancelled`,
    status: TransactionStatus.Failed
  }
};

// Non-exhaustive list of addresses Moonpay uses when sending purchased tokens
export const MOONPAY_SENDER_ADDRESSES = [
  "0x8216874887415e2650d12d53ff53516f04a74fd7",
  "0x151b381058f91cf871e7ea1ee83c45326f61e96d",
  "0xb287eac48ab21c5fb1d3723830d60b4c797555b0",
  "0xd108fd0e8c8e71552a167e7a44ff1d345d233ba6"
];

// Converts GQL backend orderStatus enum to the enum used by the frontend and UniswapX backend
export const OrderStatusTable: {
  [key in SwapOrderStatus]: UniswapXOrderStatus;
} = {
  [SwapOrderStatus.Open]: UniswapXOrderStatus.OPEN,
  [SwapOrderStatus.Expired]: UniswapXOrderStatus.EXPIRED,
  [SwapOrderStatus.Error]: UniswapXOrderStatus.ERROR,
  [SwapOrderStatus.InsufficientFunds]: UniswapXOrderStatus.INSUFFICIENT_FUNDS
};

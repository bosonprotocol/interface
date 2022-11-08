import { Lock } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import Grid from "../../ui/Grid";

interface Props {
  offer: Offer;
}

interface Condition {
  __typename?: "ConditionEntity" | undefined;
  id: string;
  method: number;
  tokenType: number;
  tokenAddress: string;
  tokenId: string;
  threshold?: string;
  maxCommits: string;
  minBalance?: string;
}

/**
 * tokenType 0 - 20
 * tokenType 1 - 721
 * tokenType 2 - 1155
 * method 1 - Threshold
 * method 2 - specific token
 */
const buildMessage = (condition: Condition) => {
  const { method, tokenType, tokenId, tokenAddress, minBalance } = condition;
  console.log(
    "🚀  roberto --  ~ file: TokenGated.tsx ~ line 33 ~ buildMessage ~ method",
    method
  );
  console.log(
    "🚀  roberto --  ~ file: TokenGated.tsx ~ line 33 ~ buildMessage ~ tokenType",
    tokenType
  );
  if (tokenType === 0) {
    // get the symbol
    return ``;
  }
  if (tokenType === 1) {
    if (method === 1) {
      return `Token ID: ${tokenId} from ${tokenAddress}`;
    }
    if (method === 2) {
      return `${minBalance} tokens from ${tokenAddress}`;
    }
  }
  if (tokenType === 2) {
    return ``;
  }
  return "";
};

const TokenGated = ({ offer }: Props) => {
  const { condition } = offer;
  if (!condition) {
    return null;
  }

  const message = buildMessage(condition);

  return (
    <Grid as="section">
      <TokenGatedInfo>
        <LockIcon>
          <Lock size={20} color={colors.grey} />
        </LockIcon>
        <LockInfo>
          <LockInfoTitle>Token Gated Offer</LockInfoTitle>
          <LockInfoDesc>
            You need to {message}
            {/* You need to own the following token(s) to Commit */}
          </LockInfoDesc>
        </LockInfo>
      </TokenGatedInfo>
    </Grid>
  );
};

export default TokenGated;

const TokenGatedInfo = styled.div`
  padding: 1rem 2rem;
  background: ${colors.black};
  display: inline-flex;
  width: 100%;
`;

const LockIcon = styled.div`
  background-color: ${colors.white};
  padding: 0.5rem;
  border-radius: 50%;
  border: 0.125rem solid ${colors.black};
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1.5rem;
  margin-left: 1rem;
`;

const LockInfo = styled.div`
  display: grid;
  width: 100%;
`;

const LockInfoTitle = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${colors.white};
`;

const LockInfoDesc = styled.span`
  font-size: 0.75rem;
  color: ${colors.grey2};
`;

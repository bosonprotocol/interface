import { CoreSDK } from "@bosonprotocol/core-sdk";
import { FundsEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { useSellerToggle } from "../private/Toogle/SellerToggleContext";
import FundItem, { Cell, Input, shakeKeyframes } from "./FundItem";
import useFunds from "./useFunds";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const ButtonCell = styled(Cell)`
  button {
    width: 100%;
    div {
      justify-content: center;
    }
  }
`;

const TokenInput = styled(Input)`
  width: 100%;
  ${({ $hasError }) =>
    $hasError &&
    `
    animation: shake 0.1s; 
    `}

  ${shakeKeyframes}
`;
interface Props {
  sellerId: string;
  buyerId: string;
}

const flexBasisCells: [number, number, number, number] = [15, 25, 30, 30];

export default function Funds({ sellerId, buyerId }: Props) {
  const { isTabSellerSelected } = useSellerToggle();
  const [newTokenAddress, setNewTokenAddress] = useState<string>("");
  const [highlightedToken, setHighlightedToken] = useState<string>("");
  const [hasErrorTokenInput, setErrorTokenInput] = useState<boolean>(false);
  const [isAllFundsBeingWithdrawn, setIsAllFundsBeingWithdrawn] =
    useState<boolean>(false);

  const core = useCoreSDK() || ({} as CoreSDK);

  const accountId = isTabSellerSelected ? sellerId : buyerId;
  const { funds, reload } = useFunds(accountId);
  const [uiFunds, setUiFunds] = useState<FundsEntityFieldsFragment[]>(funds);
  const highlightToken = (tokenName: string) => {
    setHighlightedToken(tokenName);
    setTimeout(() => setHighlightedToken(""), 300);
  };
  useEffect(() => {
    setUiFunds(funds);
  }, [funds]);

  const addNew = async () => {
    setErrorTokenInput(false);
    try {
      const existingToken = uiFunds.find(
        (fund) =>
          fund.token?.address.toLowerCase() ===
          newTokenAddress?.trim().toLowerCase()
      );
      if (existingToken?.token?.address) {
        highlightToken(existingToken.token.address);
      } else {
        const { name, decimals, symbol } = await core.getExchangeTokenInfo(
          newTokenAddress
        );
        setUiFunds([
          ...uiFunds,
          {
            accountId,
            availableAmount: "0",
            id: "",
            token: {
              __typename: "ExchangeToken",
              address: newTokenAddress,
              name: name,
              symbol: symbol,
              decimals: decimals + ""
            }
          }
        ]);
        highlightToken(newTokenAddress);
      }
    } catch (error) {
      console.error(error);
      setErrorTokenInput(true);
    }
  };
  const withdrawAll = async () => {
    try {
      setIsAllFundsBeingWithdrawn(true);
      const tx = await core.withdrawAllAvailableFunds(accountId);
      await tx.wait();
      reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsAllFundsBeingWithdrawn(false);
    }
  };
  return (
    <Root>
      {uiFunds.length ? (
        <Row>
          <Cell $flexBasis={flexBasisCells[0]} $hasBorder={false} />
          <Cell $flexBasis={flexBasisCells[1]} $hasBorder>
            Protocol Balance
          </Cell>
          <Cell $flexBasis={flexBasisCells[2]} $hasBorder>
            Withdraw Funds
          </Cell>
          <Cell $flexBasis={flexBasisCells[3]} $hasBorder>
            Deposit Funds
          </Cell>
        </Row>
      ) : (
        <></>
      )}
      {uiFunds.length ? (
        uiFunds.map((fund) => (
          <FundItem
            isAllFundsBeingWithdrawn={isAllFundsBeingWithdrawn}
            key={fund.token.address}
            reload={reload}
            isHighlighted={highlightedToken === fund.token.address}
            accountId={accountId}
            fund={fund}
            flexBasisCells={flexBasisCells}
          />
        ))
      ) : (
        <p>No funds for connected wallet.</p>
      )}
      <Row>
        <Cell $flexBasis={flexBasisCells[0]} $hasBorder>
          Add new +
        </Cell>
        <Cell
          $flexBasis={flexBasisCells[1] + flexBasisCells[2]}
          $hasBorder={false}
        >
          <TokenInput
            placeholder="Enter Token Contract Address"
            onChange={(e) => {
              setErrorTokenInput(false);
              setNewTokenAddress(e.target.value);
            }}
            value={newTokenAddress}
            $hasError={hasErrorTokenInput}
          />
        </Cell>
        <ButtonCell $flexBasis={flexBasisCells[3]}>
          <Button
            onClick={addNew}
            theme="secondary"
            size="small"
            disabled={!newTokenAddress.length}
          >
            Add
          </Button>
        </ButtonCell>
      </Row>
      {uiFunds.length ? (
        <Row>
          <Cell $flexBasis={flexBasisCells[0]} />
          <Cell $flexBasis={flexBasisCells[1]} />
          <ButtonCell $flexBasis={flexBasisCells[2]}>
            <Button onClick={withdrawAll} theme="secondary" size="small">
              Withdraw all funds
            </Button>
          </ButtonCell>
          <Cell $flexBasis={flexBasisCells[3]} />
        </Row>
      ) : (
        <></>
      )}
    </Root>
  );
}

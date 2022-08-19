import { subgraph } from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import { colors } from "../../../lib/styles/colors";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { useSellerToggle } from "../private/Toogle/SellerToggleContext";
import FundItem, { Cell, fundsBorderRadius, Input } from "./FundItem";
import useFunds from "./useFunds";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3125rem;
`;

const Row = styled.div<{ $hasShade?: boolean }>`
  display: flex;
  justify-content: center;
  gap: 0.3125rem;

  ${({ $hasShade }) =>
    $hasShade &&
    `
    * {
      box-shadow: 0 0.125rem 0.5625rem -0.1875rem ${colors.grey};
    }
  `}
`;

const HeaderCell = styled(Cell)`
  font-size: 1.125rem;
`;

const ButtonCell = styled(Cell)`
  button {
    width: 100%;
    height: 1.875rem;
    div {
      justify-content: center;
    }
  }
`;

const TokenInput = styled(Input)`
  width: 100%;
`;

const CustomButton = styled(Button)`
  padding: 0;
  border-radius: ${fundsBorderRadius};
  * {
    height: 100%;
    border-radius: ${fundsBorderRadius};
  }
`;

interface Props {
  sellerId: string;
  buyerId: string;
}

const buyerFlexBasisCells: [number, number, number] = [15, 42.5, 42.5];
const sellerFlexBasisCells: [number, number, number, number] = [15, 25, 30, 30];

export default function Funds({ sellerId, buyerId }: Props) {
  const { isTabSellerSelected } = useSellerToggle();
  const [newTokenAddress, setNewTokenAddress] = useState<string>("");
  const [highlightedToken, setHighlightedToken] = useState<string>("");
  const [hasErrorTokenInput, setErrorTokenInput] = useState<boolean>(false);
  const [isAllFundsBeingWithdrawn, setIsAllFundsBeingWithdrawn] =
    useState<boolean>(false);

  const core = useCoreSDK();

  const accountId = isTabSellerSelected ? sellerId : buyerId;

  const { funds, reload } = useFunds(accountId);
  const [uiFunds, setUiFunds] =
    useState<subgraph.FundsEntityFieldsFragment[]>(funds);
  const highlightToken = (tokenName: string) => {
    setHighlightedToken(tokenName);
    setTimeout(() => setHighlightedToken(""), 300);
  };
  useEffect(() => {
    setUiFunds((prevFunds) => [
      ...Array.from(
        new Map(
          [
            {
              accountId,
              availableAmount: "0",
              id: "",
              token: {
                // TODO: change this depending on chainId
                id: "",
                address: ethers.constants.AddressZero,
                name: "Ether",
                symbol: "ETH",
                decimals: "18"
              }
            },
            ...funds,
            ...prevFunds
          ].map((v) => [v.id, v])
        ).values()
      )
    ]);
  }, [funds, accountId]);

  if (!core) {
    return <div>Connect your wallet</div>;
  }

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
              id: "",
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
  if (!accountId) {
    return <p>You have to interact with the protocol before adding funds</p>;
  }
  return (
    <Root>
      {uiFunds.length ? (
        isTabSellerSelected ? (
          <Row>
            <Cell $flexBasis={sellerFlexBasisCells[0]} $hasBorder={false} />
            <HeaderCell $flexBasis={sellerFlexBasisCells[1]} $hasBorder>
              Protocol Balance
            </HeaderCell>
            <HeaderCell $flexBasis={sellerFlexBasisCells[2]} $hasBorder>
              Funds available for withdrawal
            </HeaderCell>
            <HeaderCell $flexBasis={sellerFlexBasisCells[3]} $hasBorder>
              Deposit Funds
            </HeaderCell>
          </Row>
        ) : (
          <Row>
            <Cell $flexBasis={buyerFlexBasisCells[0]} $hasBorder={false} />
            <HeaderCell $flexBasis={buyerFlexBasisCells[1]} $hasBorder>
              Withdrawable Escrow
            </HeaderCell>
            <HeaderCell $flexBasis={buyerFlexBasisCells[2]} $hasBorder>
              Funds available for withdrawal
            </HeaderCell>
          </Row>
        )
      ) : (
        <></>
      )}
      {uiFunds.length ? (
        uiFunds.map((fund) => (
          <FundItem
            isAllFundsBeingWithdrawn={isAllFundsBeingWithdrawn}
            key={fund.token.address + "-" + accountId}
            reload={reload}
            isHighlighted={highlightedToken === fund.token.address}
            accountId={accountId}
            fund={fund}
            sellerFlexBasisCells={sellerFlexBasisCells}
            buyerFlexBasisCells={buyerFlexBasisCells}
            isTabSellerSelected={isTabSellerSelected}
            coreSDK={core}
          />
        ))
      ) : (
        <p style={{ marginTop: 0 }}>No funds for connected wallet.</p>
      )}
      {isTabSellerSelected && (
        <Row $hasShade>
          <Cell $flexBasis={sellerFlexBasisCells[0]} $hasBorder>
            Add New +
          </Cell>
          <Cell
            $flexBasis={
              isTabSellerSelected
                ? sellerFlexBasisCells[1] + sellerFlexBasisCells[2]
                : buyerFlexBasisCells[1]
            }
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
          <ButtonCell
            $flexBasis={
              isTabSellerSelected
                ? sellerFlexBasisCells[3]
                : buyerFlexBasisCells[2]
            }
          >
            <CustomButton
              onClick={addNew}
              theme="secondary"
              size="small"
              disabled={!newTokenAddress.length}
            >
              Add
            </CustomButton>
          </ButtonCell>
        </Row>
      )}
      {uiFunds.length ? (
        isTabSellerSelected ? (
          <Row>
            <Cell $flexBasis={sellerFlexBasisCells[0]} />
            <Cell $flexBasis={sellerFlexBasisCells[1]} />
            <ButtonCell $flexBasis={sellerFlexBasisCells[2]}>
              <CustomButton
                onClick={withdrawAll}
                theme="secondary"
                size="small"
              >
                Withdraw All Funds
              </CustomButton>
            </ButtonCell>
            <Cell $flexBasis={sellerFlexBasisCells[3]} />
          </Row>
        ) : (
          <Row>
            <Cell $flexBasis={buyerFlexBasisCells[0]} />
            <Cell $flexBasis={buyerFlexBasisCells[1]} />
            <ButtonCell $flexBasis={buyerFlexBasisCells[2]}>
              <CustomButton
                onClick={withdrawAll}
                theme="secondary"
                size="small"
              >
                Withdraw All Funds
              </CustomButton>
            </ButtonCell>
          </Row>
        )
      ) : (
        <></>
      )}
    </Root>
  );
}

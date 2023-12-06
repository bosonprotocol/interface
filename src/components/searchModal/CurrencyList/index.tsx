import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { Spinner } from "components/loading/Spinner";
import TokenSafetyIcon from "components/tokenSafety/TokenSafetyIcon";
import Tooltip from "components/tooltip/Tooltip";
import Column, { AutoColumn } from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { checkWarning } from "lib/constants/tokenSafety";
import { colors } from "lib/styles/colors";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { TokenBalances } from "lib/utils/hooks/useTokenList/sorting";
import tryParseCurrencyAmount from "lib/utils/tryParseCurrencyAmount";
import { Check } from "phosphor-react";
import { CSSProperties, MutableRefObject, useCallback, useMemo } from "react";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import { WrappedTokenInfo } from "../../../state/lists/wrappedTokenInfo";
import CurrencyLogo from "../../logo/CurrencyLogo";
import { LoadingRows, MenuItem } from "../styled";

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : "ETHER";
}
/* &::-webkit-scrollbar: {
    background: transparent;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb: {
    background: grey;
    borderradius: 8px;
  } */
const StyledFixedSizeList = styled(FixedSizeList)`
  scrollbar-width: thin;
  scrollbar-color: ${colors.darkGrey} transparent;
  height: 100%;
`;

const CheckIcon = styled(Check)`
  height: 20px;
  width: 20px;
  margin-left: 4px;
  color: ${colors.secondary};
`;

const StyledBalanceText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const CurrencyName = styled(Typography)`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => theme.deprecated_bg3};
  color: ${colors.lightGrey};
  font-size: 0.875rem;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

const WarningContainer = styled.div`
  margin-left: 0.3em;
`;

const ListWrapper = styled.div`
  padding-right: 0.25rem;
`;

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return null;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <Tooltip content={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </Tooltip>
      {tags.length > 1 ? (
        <Tooltip
          content={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join("; \n")}
        >
          <Tag>...</Tag>
        </Tooltip>
      ) : null}
    </TagContainer>
  );
}

export function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  showCurrencyAmount,
  balance
}: {
  currency: Currency;
  onSelect: (hasWarning: boolean) => void;
  isSelected: boolean;
  otherSelected: boolean;
  style?: CSSProperties;
  showCurrencyAmount?: boolean;
  balance?: CurrencyAmount<Currency>;
}) {
  const { account } = useAccount();
  const key = currencyKey(currency);
  const warning = currency.isNative ? null : checkWarning(currency.address);
  const isBlockedToken = !!warning && !warning.canProceed;
  const blockedTokenOpacity = "0.6";

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      tabIndex={0}
      style={style}
      className={`token-item-${key}`}
      onKeyPress={(e) =>
        !isSelected && e.key === "Enter" ? onSelect(!!warning) : null
      }
      onClick={() => (isSelected ? null : onSelect(!!warning))}
      disabled={isSelected}
      selected={otherSelected}
      dim={isBlockedToken}
    >
      <Column>
        <CurrencyLogo
          currency={currency}
          size="36px"
          style={{ opacity: isBlockedToken ? blockedTokenOpacity : "1" }}
        />
      </Column>
      <AutoColumn
        style={{ opacity: isBlockedToken ? blockedTokenOpacity : "1" }}
      >
        <Grid>
          <CurrencyName title={currency.name}>{currency.name}</CurrencyName>
          <WarningContainer>
            <TokenSafetyIcon warning={warning} />
          </WarningContainer>
        </Grid>
        <Typography marginLeft="0px" $fontSize="12px" fontWeight={300}>
          {currency.symbol}
        </Typography>
      </AutoColumn>
      <Column>
        <Grid style={{ justifySelf: "flex-end" }}>
          <TokenTags currency={currency} />
        </Grid>
      </Column>
      {showCurrencyAmount ? (
        <Grid style={{ justifySelf: "flex-end" }}>
          {account ? (
            balance ? (
              <Balance balance={balance} />
            ) : (
              <Spinner />
            )
          ) : null}
          {isSelected && <CheckIcon />}
        </Grid>
      ) : (
        isSelected && (
          <Grid style={{ justifySelf: "flex-end" }}>
            <CheckIcon />
          </Grid>
        )
      )}
    </MenuItem>
  );
}

interface TokenRowProps {
  data: Array<Currency>;
  index: number;
  style: CSSProperties;
}

const LoadingRow = () => (
  <LoadingRows data-testid="loading-rows">
    <div />
    <div />
    <div />
  </LoadingRows>
);

export default function CurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showCurrencyAmount,
  isLoading,
  balances
}: {
  height: number;
  currencies: Currency[];
  otherListTokens?: WrappedTokenInfo[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency, hasWarning?: boolean) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showCurrencyAmount?: boolean;
  isLoading: boolean;
  balances: TokenBalances;
}) {
  const itemData: Currency[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, ...otherListTokens];
    }
    return currencies;
  }, [currencies, otherListTokens]);

  const Row = useCallback(
    function TokenRow({ data, index, style }: TokenRowProps) {
      const row: Currency = data[index];

      const currency = row;

      const balance =
        tryParseCurrencyAmount(
          String(
            balances[
              currency.isNative ? "ETH" : currency.address?.toLowerCase()
            ]?.balance ?? 0
          ),
          currency
        ) ?? CurrencyAmount.fromRawAmount(currency, 0);

      const isSelected = Boolean(
        currency && selectedCurrency && selectedCurrency.equals(currency)
      );
      const otherSelected = Boolean(
        currency && otherCurrency && otherCurrency.equals(currency)
      );
      const handleSelect = (hasWarning: boolean) =>
        currency && onCurrencySelect(currency, hasWarning);

      if (isLoading) {
        return LoadingRow();
      } else if (currency) {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            showCurrencyAmount={showCurrencyAmount}
            balance={balance}
          />
        );
      } else {
        return null;
      }
    },
    [
      selectedCurrency,
      otherCurrency,
      isLoading,
      onCurrencySelect,
      showCurrencyAmount,
      balances
    ]
  );

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index];
    return currencyKey(currency);
  }, []);

  return (
    <ListWrapper data-testid="currency-list-wrapper">
      {isLoading ? (
        <StyledFixedSizeList
          height={height}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={fixedListRef as any}
          width="100%"
          itemData={[]}
          itemCount={10}
          itemSize={56}
        >
          {LoadingRow}
        </StyledFixedSizeList>
      ) : (
        <FixedSizeList
          height={height}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={fixedListRef as any}
          width="100%"
          itemData={itemData}
          itemCount={itemData.length}
          itemSize={56}
          itemKey={itemKey}
        >
          {Row}
        </FixedSizeList>
      )}
    </ListWrapper>
  );
}

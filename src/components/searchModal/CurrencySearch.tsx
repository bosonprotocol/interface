import { Currency, Token } from "@uniswap/sdk-core";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { isAddress } from "lib/utils/address";
import { useChainId } from "lib/utils/hooks/connection/connection";
import {
  useDefaultActiveTokens,
  useIsUserAddedToken,
  useSearchInactiveTokenLists,
  useToken
} from "lib/utils/hooks/Tokens";
import useDebounce from "lib/utils/hooks/useDebounce";
import useNativeCurrency from "lib/utils/hooks/useNativeCurrency";
import { useOnClickOutside } from "lib/utils/hooks/useOnClickOutside";
import useToggle from "lib/utils/hooks/useToggle";
import { getTokenFilter } from "lib/utils/hooks/useTokenList/filtering";
import { useSortTokensByQuery } from "lib/utils/hooks/useTokenList/sorting";
import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import CommonBases from "./CommonBases";
import { CurrencyRow } from "./CurrencyList";
import CurrencyList from "./CurrencyList";
import { PaddedColumn, SearchInput, Separator } from "./styled";

const ContentWrapper = styled(Column)`
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex: 1 1;
  position: relative;
  border-radius: 20px;
`;

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency, hasWarning?: boolean) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showCurrencyAmount?: boolean;
  disableNonToken?: boolean;
  onlyShowCurrenciesWithBalance?: boolean;
}
const balances = {};
export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  onDismiss,
  isOpen,
  onlyShowCurrenciesWithBalance
}: CurrencySearchProps) {
  const chainId = useChainId();

  const [tokenLoaderTimerElapsed, setTokenLoaderTimerElapsed] = useState(false);

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);
  const isAddressSearch = isAddress(debouncedQuery);
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  const defaultTokens = useDefaultActiveTokens(chainId);
  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(defaultTokens).filter(getTokenFilter(debouncedQuery));
  }, [defaultTokens, debouncedQuery]);

  const isLoading = Boolean(!tokenLoaderTimerElapsed);

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    filteredTokens
  );

  const native = useNativeCurrency(chainId);
  const wrapped = native.wrapped;

  const searchCurrencies: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();

    const tokens = filteredSortedTokens.filter(
      (t) => !(t.equals(wrapped) || (disableNonToken && t.isNative))
    );
    const shouldShowWrapped = !onlyShowCurrenciesWithBalance;
    const natives = (
      disableNonToken || native.equals(wrapped)
        ? [wrapped]
        : shouldShowWrapped
        ? [native, wrapped]
        : [native]
    ).filter(
      (n) =>
        n.symbol?.toLowerCase()?.indexOf(s) !== -1 ||
        n.name?.toLowerCase()?.indexOf(s) !== -1
    );

    return [...natives, ...tokens];
  }, [
    debouncedQuery,
    filteredSortedTokens,
    onlyShowCurrenciesWithBalance,
    wrapped,
    disableNonToken,
    native
  ]);

  const handleCurrencySelect = useCallback(
    (currency: Currency, hasWarning?: boolean) => {
      onCurrencySelect(currency, hasWarning);
      if (!hasWarning) onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("");
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === native?.symbol?.toLowerCase()) {
          handleCurrencySelect(native);
        } else if (searchCurrencies.length > 0) {
          if (
            searchCurrencies[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            searchCurrencies.length === 1
          ) {
            handleCurrencySelect(searchCurrencies[0]);
          }
        }
      }
    },
    [debouncedQuery, native, searchCurrencies, handleCurrencySelect]
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    !onlyShowCurrenciesWithBalance &&
      (filteredTokens.length === 0 ||
        (debouncedQuery.length > 2 && !isAddressSearch))
      ? debouncedQuery
      : undefined
  );

  // Timeout token loader after 3 seconds to avoid hanging in a loading state.
  useEffect(() => {
    const tokenLoaderTimer = setTimeout(() => {
      setTokenLoaderTimerElapsed(true);
    }, 3000);
    return () => clearTimeout(tokenLoaderTimer);
  }, []);

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <Grid>
          <Typography fontWeight={500} $fontSize={16}>
            <>Select a token</>
          </Typography>
        </Grid>
        <Grid>
          <SearchInput
            type="text"
            id="token-search-input"
            data-testid="token-search-input"
            placeholder={`Search name or paste address`}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Grid>
        {showCommonBases && (
          <CommonBases
            chainId={chainId}
            onSelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
          />
        )}
      </PaddedColumn>
      <Separator />
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: "20px 0", height: "100%" }}>
          <CurrencyRow
            currency={searchToken}
            isSelected={Boolean(
              searchToken &&
                selectedCurrency &&
                selectedCurrency.equals(searchToken)
            )}
            onSelect={(hasWarning: boolean) =>
              searchToken && handleCurrencySelect(searchToken, hasWarning)
            }
            otherSelected={Boolean(
              searchToken &&
                otherSelectedCurrency &&
                otherSelectedCurrency.equals(searchToken)
            )}
            showCurrencyAmount={showCurrencyAmount}
          />
        </Column>
      ) : searchCurrencies?.length > 0 ||
        filteredInactiveTokens?.length > 0 ||
        isLoading ? (
        <div style={{ flex: "1" }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                currencies={searchCurrencies}
                otherListTokens={filteredInactiveTokens}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showCurrencyAmount={showCurrencyAmount}
                isLoading={isLoading}
                balances={balances}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: "20px", height: "100%" }}>
          <Typography textAlign="center" marginBottom="20px">
            <>No results found.</>
          </Typography>
        </Column>
      )}
    </ContentWrapper>
  );
}

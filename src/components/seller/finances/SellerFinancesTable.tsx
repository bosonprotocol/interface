import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber, utils } from "ethers";
import filter from "lodash/filter";
import groupBy from "lodash/groupBy";
import isEmpty from "lodash/isEmpty";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  WarningCircle
} from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import styled from "styled-components";
import { useAccount } from "wagmi";
dayjs.extend(isBetween);

import { colors } from "../../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { useExchangeTokens } from "../../../lib/utils/hooks/useExchangeTokens";
import { useSellerDeposit } from "../../../lib/utils/hooks/useSellerDeposit";
import useFunds from "../../../pages/account/funds/useFunds";
import { useModal } from "../../modal/useModal";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Loading from "../../ui/Loading";
import Typography from "../../ui/Typography";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    font-weight: 600;
    color: ${colors.darkGrey};
    :not([data-sortable]) {
      cursor: default !important;
    }
    [data-sortable] {
      cursor: pointer !important;
    }
  }
  td {
    font-weight: 400;
    color: ${colors.black};
  }
  th,
  td {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 0.75rem;
    line-height: 1.5;
  }
  thead {
    tr {
      th {
        border-bottom: 2px solid ${colors.border};
        text-align: left;
        padding: 0.5rem;
        &:first-child {
          padding-left: 0.5rem;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
  }
  tbody {
    tr {
      :hover {
        td {
          background-color: ${colors.darkGrey}08;
          cursor: pointer;
        }
      }
      &:not(:last-child) {
        td {
          border-bottom: 1px solid ${colors.border};
        }
      }
      td {
        text-align: left;
        padding: 0.5rem;
        &:first-child {
        }
        &:last-child {
          text-align: right;
          > button {
            display: inline-block;
          }
        }
      }
    }
  }
  [data-testid="price"] {
    transform: scale(0.75);
  }
`;
const HeaderSorter = styled.span`
  margin-left: 0.5rem;
`;
const Pagination = styled.div`
  width: 100%;
  padding-top: 1rem;
  border-top: 2px solid ${colors.border};

  select {
    padding: 0.5rem;
    border: 1px solid ${colors.border};
    background: ${colors.white};
    margin: 0 1rem;
  }
`;
const Span = styled.span`
  font-size: 0.75rem;
  color: ${colors.darkGrey};
  &:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

const WithdrawButton = styled(Button)`
  color: ${colors.secondary};
  border-color: transparent;
`;
const WarningWrapper = styled(Grid)`
  svg {
    color: ${colors.orange};
  }
`;

const processValue = (value: string, decimals: string) => {
  try {
    return utils.formatUnits(BigNumber.from(value), Number(decimals));
  } catch (e) {
    console.error(e);
    return "";
  }
};

const mockedFunds = [
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "ETH",
      name: "Ether"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "BTC",
      name: "Bit Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "A",
      name: "A Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "b",
      name: "b Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "c",
      name: "c Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "d",
      name: "d Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "e",
      name: "e Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "f",
      name: "f Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "g",
      name: "g Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "h",
      name: "h Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "i",
      name: "i Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "j",
      name: "j Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "k",
      name: "k Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "l",
      name: "l Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "h",
      name: "h Coin"
    }
  },
  {
    id: "20-0x0000000000000000000000000000000000000000",
    availableAmount: "130000000000000000",
    accountId: "20",
    token: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      symbol: "ł",
      name: "ł Coin"
    }
  }
];
export default function SellerFinancesTable() {
  const { showModal, modalTypes } = useModal();
  const { address } = useAccount();
  const {
    seller: { sellerId, isError: isErrorSellers, isLoading: isLoadingSellers }
  } = useBuyerSellerAccounts(address || "");
  const { funds, reload, foundStatus } = useFunds(sellerId);
  const {
    data: exchangesTokens,
    isLoading: isLoadingExchangesTokens,
    isError: isErrorExchangesTokens,
    refetch: exchangesTokensRefetch
  } = useExchangeTokens();
  const [isFoundsInitialized, setIsFoundsInitialized] = useState(false);

  const {
    data: sellersData,
    refetch: sellerRefetch,
    isLoading: sellerDataLoading,
    isError: sellerDataIsError
  } = useSellerDeposit({
    sellerId
  });

  useEffect(() => {
    if (foundStatus === "success" && !isFoundsInitialized) {
      setIsFoundsInitialized(true);
    }
  }, [foundStatus, isFoundsInitialized]);

  const columns = useMemo(
    () => [
      {
        Header: "Token",
        accessor: "token",
        disableSortBy: false
      } as const,
      {
        Header: "All funds",
        accessor: "allFound",
        disableSortBy: false
      } as const,
      {
        Header: "Locked funds",
        accessor: "lockedFunds",
        disableSortBy: false
      } as const,
      {
        Header: "Withdrawable",
        accessor: "withdrawable",
        disableSortBy: false
      } as const,
      {
        Header: "Offers backed",
        accessor: "offersBacked",
        disableSortBy: false
      } as const,
      {
        Header: "",
        accessor: "action",
        disableSortBy: false
      } as const
    ],
    []
  );

  const calcOffersBacked = useMemo(() => {
    const offersBackedByGroup: { [key: string]: string } = {};
    if (isEmpty(exchangesTokens)) {
      return offersBackedByGroup;
    }
    exchangesTokens?.forEach((exchangeToken) => {
      const key = exchangeToken.symbol;
      const notExpiredAndNotVoidedOffers = exchangeToken.offers.filter(
        (offer) => {
          const validUntilDateParsed = dayjs(
            Number(offer?.validUntilDate) * 1000
          );
          const validFromDateParsed = dayjs(
            Number(offer?.validFromDate) * 1000
          );
          const isNotExpired = dayjs()
            .startOf("day")
            .isBetween(validUntilDateParsed, validFromDateParsed, "day");
          return isNotExpired && !offer.voidedAt;
        }
      );
      const sumValue = notExpiredAndNotVoidedOffers.reduce(
        (acc, { price, sellerDeposit, quantityAvailable }) => {
          acc = acc
            ? BigNumber.from(acc)
                .add(
                  BigNumber.from(sellerDeposit)
                    .mul(BigNumber.from(price))
                    .mul(BigNumber.from(quantityAvailable))
                )
                .toString()
            : BigNumber.from(sellerDeposit)
                .mul(BigNumber.from(price))
                .mul(BigNumber.from(quantityAvailable))
                .toString();
          return acc;
        },
        ""
      );
      offersBackedByGroup[key] = sumValue;
    });
    return offersBackedByGroup;
  }, [exchangesTokens]);

  const sellerLockedFunds = useMemo(() => {
    const lockedFundsByGroup: { [key: string]: string } = {};
    if (isEmpty(sellersData?.exchanges)) {
      return lockedFundsByGroup;
    }
    const noFinalized = filter(
      sellersData?.exchanges,
      ({ finalizedDate }) => !finalizedDate
    );

    const groupedBySymbol = groupBy(
      noFinalized,
      (exchange) => exchange.offer.exchangeToken.symbol
    );
    Object.keys(groupedBySymbol).forEach((key) => {
      const element = groupedBySymbol[key];
      const sum = element.reduce((acc, elem) => {
        acc = acc
          ? BigNumber.from(acc)
              .add(BigNumber.from(elem.offer.sellerDeposit))
              .toString()
          : elem.offer.sellerDeposit;
        return acc;
      }, "");
      lockedFundsByGroup[key] = sum;
    });
    return lockedFundsByGroup;
  }, [sellersData?.exchanges]);

  const reloadData = useCallback(() => {
    reload();
    sellerRefetch();
    exchangesTokensRefetch();
  }, [reload, sellerRefetch, exchangesTokensRefetch]);

  const offersBackedCell = useCallback((value: number | null) => {
    if (value === null) {
      return "";
    }
    if (value < 15) {
      return (
        <>
          <WarningCircle size={15} /> {value} %
        </>
      );
    }
    return `${value} %`;
  }, []);

  const data = useMemo(
    () =>
      mockedFunds?.map((fund) => {
        const decimals = fund.token.decimals;
        const lockedFunds = sellerLockedFunds?.[fund.token.symbol] ?? "0";
        const lockedFundsFormatted = utils.formatUnits(lockedFunds, decimals);
        const withdrawable = processValue(fund.availableAmount, decimals);
        const allFounds = processValue(
          BigNumber.from(lockedFunds)
            .add(BigNumber.from(fund.availableAmount))
            .toString(),
          decimals
        );
        const offersBacked = () => {
          let result = null;
          if (fund.availableAmount && calcOffersBacked[fund.token.symbol]) {
            console.log({
              withdrawable: fund.availableAmount,
              calcOffersBacked: calcOffersBacked[fund.token.symbol]
            });
            result =
              BigNumber.from(fund.availableAmount)
                .div(calcOffersBacked[fund.token.symbol])
                .toNumber() * 100;
          }
          return result;
        };
        return {
          token: <Typography tag="p">{fund.token.symbol}</Typography>,
          allFound: <Typography tag="p">{allFounds}</Typography>,
          lockedFunds: <Typography tag="p">{lockedFundsFormatted}</Typography>,
          withdrawable: <Typography tag="p">{withdrawable}</Typography>,
          offersBacked: (
            <Typography tag="p">
              <WarningWrapper gap="0.2rem" justifyContent="flex-start">
                {offersBackedCell(offersBacked())}
              </WarningWrapper>
            </Typography>
          ),
          action: (
            <Grid justifyContent="space-evently" gap="1rem">
              <WithdrawButton
                theme="outline"
                size="small"
                onClick={() => {
                  showModal(
                    modalTypes.FINANCE_WITHDRAW_MODAL,
                    {
                      title: `Withdraw ${fund.token.symbol}`,
                      protocolBalance: withdrawable,
                      symbol: fund.token.symbol,
                      accountId: sellerId,
                      tokenDecimals: fund.token.decimals,
                      exchangeToken: fund.token.address,
                      availableAmount: fund.availableAmount,
                      reload: reloadData
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Withdraw
              </WithdrawButton>
              <Button
                theme="primary"
                size="small"
                onClick={() => {
                  showModal(
                    modalTypes.FINANCE_DEPOSIT_MODAL,
                    {
                      title: `Deposit ${fund.token.symbol}`,
                      protocolBalance: withdrawable,
                      symbol: fund.token.symbol,
                      accountId: sellerId,
                      tokenDecimals: fund.token.decimals,
                      exchangeToken: fund.token.address,
                      reload: reloadData
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Deposit
              </Button>
            </Grid>
          )
        };
      }),
    [
      calcOffersBacked,
      modalTypes.FINANCE_DEPOSIT_MODAL,
      modalTypes.FINANCE_WITHDRAW_MODAL,
      offersBackedCell,
      reloadData,
      sellerId,
      sellerLockedFunds,
      showModal
    ]
  );

  const tableProps = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageCount,
    state: { pageIndex, pageSize }
  } = tableProps;

  const paginate = useMemo(() => {
    return Array.from(Array(pageCount).keys()).slice(
      pageIndex < 1 ? 0 : pageIndex - 1,
      pageIndex < 1 ? 3 : pageIndex + 2
    );
  }, [pageCount, pageIndex]);

  if (
    !isFoundsInitialized ||
    isLoadingSellers ||
    sellerDataLoading ||
    isLoadingExchangesTokens
  ) {
    return <Loading />;
  }

  if (
    isErrorSellers ||
    sellerDataIsError ||
    foundStatus === "error" ||
    isErrorExchangesTokens
  ) {
    // TODO: NO FIGMA REPRESENTATIONS
  }

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`seller_table_thead_tr_${key}`}
            >
              {headerGroup.headers.map((column, i) => {
                return (
                  <th
                    data-sortable={column.disableSortBy}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`seller_table_thead_th_${i}`}
                  >
                    {column.render("Header")}
                    {i > 0 && !column.disableSortBy && (
                      <HeaderSorter>
                        {column?.isSorted ? (
                          column?.isSortedDesc ? (
                            <CaretDown size={14} />
                          ) : (
                            <CaretUp size={14} />
                          )
                        ) : (
                          ""
                        )}
                      </HeaderSorter>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(page.length > 0 &&
            page.map((row) => {
              prepareRow(row);
              console.log(row.original, "LOGGG");
              return (
                <tr
                  {...row.getRowProps()}
                  key={`seller_table_finances_tbody_tr_${row.original.token}`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`seller_table_finances_tbody_td_${row.original.token}-${cell.column.id}`}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })) || (
            <tr>
              (
              <td colSpan={columns.length}>
                <Typography
                  tag="h6"
                  justifyContent="center"
                  padding="1rem 0"
                  margin="0"
                >
                  No data to display
                </Typography>
              </td>
              )
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination>
        <Grid>
          <Grid justifyContent="flex-start" gap="1rem">
            <Span>
              Show
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              per page
            </Span>
            <Span>
              Showing {pageIndex * pageSize + 1} - {(pageIndex + 1) * pageSize}{" "}
              of {rows.length} entries
            </Span>
          </Grid>
          {pageCount > 1 && (
            <Grid justifyContent="flex-end" gap="1rem">
              <Button
                size="small"
                theme="blank"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <CaretLeft size={16} />
              </Button>
              {paginate.map((pageNumber: number) => (
                <Button
                  key={`page_btn_${pageNumber}`}
                  size="small"
                  theme="blank"
                  style={{
                    color:
                      pageNumber === pageIndex
                        ? colors.secondary
                        : colors.black,
                    background:
                      pageNumber === pageIndex
                        ? colors.lightGrey
                        : "transparent"
                  }}
                  onClick={() => gotoPage(pageNumber)}
                >
                  {pageNumber + 1}
                </Button>
              ))}
              <Button
                size="small"
                theme="blank"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <CaretRight size={16} />
              </Button>
            </Grid>
          )}
        </Grid>
      </Pagination>
    </>
  );
}

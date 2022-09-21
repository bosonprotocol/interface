import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber, utils } from "ethers";
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
dayjs.extend(isBetween);

import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";

import { colors } from "../../../lib/styles/colors";
import { useModal } from "../../modal/useModal";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Loading from "../../ui/Loading";
import Typography from "../../ui/Typography";
import PaginationPages from "../common/PaginationPages";
import { WithSellerDataProps } from "../common/WithSellerData";
import { SellerInsideProps } from "../SellerInside";

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
const CurrencyName = styled(Typography)`
  > div > *:not(svg) {
    display: none;
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

export default function SellerFinances({
  sellerId,
  funds: fundsData,
  exchangesTokens: exchangesTokensData,
  sellerDeposit: sellerDepositData,
  offersBacked
}: SellerInsideProps & WithSellerDataProps) {
  const { showModal, modalTypes } = useModal();
  const { funds: allFunds, reload, fundStatus } = fundsData;
  const {
    isLoading: isLoadingExchangesTokens,
    isError: isErrorExchangesTokens,
    refetch: exchangesTokensRefetch
  } = exchangesTokensData;
  const [isFundsInitialized, setIsFundsInitialized] = useState(false);

  const {
    refetch: sellerRefetch,
    isLoading: isLoadingSellerData,
    isError: sellerDataIsError
  } = sellerDepositData;

  useEffect(() => {
    if (fundStatus === "success" && !isFundsInitialized) {
      setIsFundsInitialized(true);
    }
  }, [fundStatus, isFundsInitialized]);

  const columns = useMemo(
    () => [
      {
        Header: "Token",
        accessor: "token",
        disableSortBy: false
      } as const,
      {
        Header: "All funds",
        accessor: "allFund",
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
        Header: "Action",
        accessor: "action",
        disableSortBy: true
      } as const
    ],
    []
  );

  const { calcOffersBacked, sellerLockedFunds, threshold } = offersBacked;

  const reloadData = useCallback(() => {
    reload();
    sellerRefetch();
    exchangesTokensRefetch();
  }, [reload, sellerRefetch, exchangesTokensRefetch]);

  const offersBackedCell = useCallback(
    (value: number | null) => {
      if (value === null) {
        return "";
      }
      if (value < threshold) {
        return (
          <>
            <WarningCircle size={15} /> {value} %
          </>
        );
      }
      return `${value} %`;
    },
    [threshold]
  );

  const data = useMemo(
    () =>
      allFunds?.map((fund) => {
        const decimals = fund.token.decimals;
        const lockedFunds = sellerLockedFunds?.[fund.token.symbol] ?? "0";
        const lockedFundsFormatted = utils.formatUnits(lockedFunds, decimals);
        const withdrawable = processValue(fund.availableAmount, decimals);
        const allFunds = processValue(
          BigNumber.from(lockedFunds)
            .add(BigNumber.from(fund.availableAmount))
            .toString(),
          decimals
        );
        const offersBackedFn = () => {
          let result = null;
          if (fund.availableAmount && calcOffersBacked[fund.token.symbol]) {
            result = Number(
              (
                (Number(fund.availableAmount) /
                  Number(calcOffersBacked[fund.token.symbol])) *
                100
              ).toFixed(2)
            );
          }
          return result;
        };
        return {
          token: (
            <CurrencyName tag="p" gap="0.5rem">
              {fund.token.symbol}
              <CurrencyDisplay
                currency={fund.token.symbol as Currencies}
                height={18}
              />
            </CurrencyName>
          ),
          allFund: <Typography tag="p">{allFunds}</Typography>,
          lockedFunds: <Typography tag="p">{lockedFundsFormatted}</Typography>,
          withdrawable: <Typography tag="p">{withdrawable}</Typography>,
          offersBacked: (
            <Typography tag="p">
              <WarningWrapper gap="0.2rem" justifyContent="flex-start">
                {offersBackedCell(offersBackedFn())}
              </WarningWrapper>
            </Typography>
          ),
          action: (
            <Grid justifyContent="flex-end" gap="1rem">
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
                theme="bosonSecondary"
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
      showModal,
      allFunds
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

  if (!isFundsInitialized || isLoadingSellerData || isLoadingExchangesTokens) {
    return <Loading />;
  }

  if (sellerDataIsError || fundStatus === "error" || isErrorExchangesTokens) {
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
                    {i >= 0 && !column.disableSortBy && (
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
            page.map((row, id) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={`seller_table_finances_tbody_tr_${id}`}
                >
                  {row.cells.map((cell, key) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`seller_table_finances_tbody_td_${id}-${key}`}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })) || (
            <tr>
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
            <PaginationPages
              pageIndex={pageIndex + 1}
              pageSize={pageSize}
              allItems={rows.length}
            />
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

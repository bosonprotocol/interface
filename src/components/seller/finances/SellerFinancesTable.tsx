import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber, ethers, utils } from "ethers";
import groupBy from "lodash/groupBy";
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

import { CONFIG } from "../../../lib/config";
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
import PaginationPages from "../common/PaginationPages";

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

export default function SellerFinancesTable() {
  const { showModal, modalTypes } = useModal();
  const { address } = useAccount();
  const {
    seller: { sellerId, isError: isErrorSellers, isLoading: isLoadingSellers }
  } = useBuyerSellerAccounts(address || "");
  const accountId = sellerId;
  const { funds, reload, fundStatus } = useFunds(sellerId);
  const [uiFunds, setUiFunds] =
    useState<subgraph.FundsEntityFieldsFragment[]>(funds);
  useEffect(() => {
    const nativeFund = funds.find(
      (f) => f.token.address === ethers.constants.AddressZero
    );
    const fundsDefaultList = nativeFund
      ? [nativeFund]
      : [
          {
            accountId,
            availableAmount: "0",
            id: "",
            token: {
              id: "",
              address: ethers.constants.AddressZero,
              name: CONFIG.nativeCoin?.name || "",
              symbol: CONFIG.nativeCoin?.symbol || "",
              decimals: CONFIG.nativeCoin?.decimals || ""
            }
          }
        ];
    setUiFunds((prevFunds) => [
      ...Array.from(
        new Map(
          [...funds, ...prevFunds, ...fundsDefaultList].map((v) => [
            v.token.address,
            v
          ])
        ).values()
      )
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds, accountId]);
  const {
    data: exchangesTokens,
    isLoading: isLoadingExchangesTokens,
    isError: isErrorExchangesTokens,
    refetch: exchangesTokensRefetch
  } = useExchangeTokens({ sellerId });
  const [isFundsInitialized, setIsFundsInitialized] = useState(false);

  const {
    data: sellersData,
    refetch: sellerRefetch,
    isLoading: isLoadingSellerData,
    isError: sellerDataIsError
  } = useSellerDeposit(
    {
      sellerId
    },
    { enabled: !!sellerId }
  );

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

  const calcOffersBacked = useMemo(() => {
    const offersBackedByGroup: { [key: string]: string } = {};
    if (!Array.isArray(exchangesTokens) || !exchangesTokens.length) {
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
          const isNotExpired = dayjs().isBetween(
            validFromDateParsed,
            validUntilDateParsed,
            "day",
            "[]"
          );
          return isNotExpired && !offer.voidedAt;
        }
      );
      const sumValue = notExpiredAndNotVoidedOffers.reduce(
        (acc, { sellerDeposit, quantityAvailable }) => {
          acc = acc
            ? BigNumber.from(acc)
                .add(
                  BigNumber.from(sellerDeposit).mul(
                    BigNumber.from(quantityAvailable)
                  )
                )
                .toString()
            : BigNumber.from(sellerDeposit)
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
    if (
      !Array.isArray(sellersData?.exchanges) ||
      !sellersData?.exchanges.length
    ) {
      return lockedFundsByGroup;
    }

    const noFinalized =
      sellersData?.exchanges?.filter(({ finalizedDate }) => !finalizedDate) ??
      [];

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
      uiFunds?.map((fund) => {
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
        const offersBacked = () => {
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
          token: <Typography tag="p">{fund.token.symbol}</Typography>,
          allFund: <Typography tag="p">{allFunds}</Typography>,
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
      uiFunds
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
    !isFundsInitialized ||
    isLoadingSellers ||
    isLoadingSellerData ||
    isLoadingExchangesTokens
  ) {
    return <Loading />;
  }

  if (
    isErrorSellers ||
    sellerDataIsError ||
    fundStatus === "error" ||
    isErrorExchangesTokens
  ) {
    // TODO: NO FIGMA REPRESENTATIONS
    return <p>There has been an error, please try again later...</p>;
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
            page.map((row) => {
              prepareRow(row);
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
              <td colSpan={columns.length}>
                <Typography
                  tag="h6"
                  justifyContent="center"
                  padding="1rem 0"
                  margin="0"
                >
                  (No data to display)
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

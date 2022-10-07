import dayjs from "dayjs";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp
  //   Table
} from "phosphor-react";
import { useMemo } from "react";
import { generatePath } from "react-router";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";

import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { getDateTimestamp } from "../../lib/utils/getDateTimestamp";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import PaginationPages from "../seller/common/PaginationPages";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import {
  HeaderSorter,
  Pagination,
  Span,
  Table
} from "./TransactionsTable.styles";

interface Transaction {
  account: string;
  transaction: string;
  date: string;
  executed: string;
  hash: string;
  offerExchangeId: string;
  buyerSellerID: string;
  isOffer: boolean;
}

interface Props {
  transactions: Transaction[];
  isLoading?: boolean;
}

export default function TransactionsTable({ transactions }: Props) {
  const navigate = useKeepQueryParamsNavigate();

  const columns = useMemo(
    () => [
      {
        Header: "offerExchangeId",
        accessor: "offerExchangeId"
      } as const,
      {
        Header: "isOffer",
        accessor: "isOffer"
      } as const,
      {
        Header: "Account",
        accessor: "account"
      } as const,
      {
        Header: "Transaction",
        accessor: "transaction"
      } as const,
      {
        Header: "Date/time",
        accessor: "dateTime",
        disableSortBy: true
      } as const,
      {
        Header: "Executed By",
        accessor: "executedBy",
        disableSortBy: true
      } as const,
      {
        Header: "Link to block",
        accessor: "linkToBlock"
      } as const
    ],
    []
  );

  const data = useMemo(
    () =>
      transactions?.map((tx: Transaction | null) => {
        if (!tx) {
          return <></>;
        }

        return {
          offerExchangeId: tx.offerExchangeId,
          isOffer: tx.isOffer,
          account: (
            <Typography $fontSize="0.75rem" tag="p">
              {tx.account}
            </Typography>
          ),
          transaction: (
            <Typography $fontSize="0.75rem" tag="p">
              {tx.transaction}
            </Typography>
          ),
          dateTime: (
            <Typography $fontSize="0.75rem">
              {dayjs(getDateTimestamp(tx.date)).format(CONFIG.dateFormat)}
            </Typography>
          ),
          executedBy: (
            <Typography $fontSize="0.75rem" tag="p">
              {tx.executed}
            </Typography>
          ),
          linkToBlock: (
            <a href={CONFIG.getTxExplorerUrl?.(tx.hash)} target="_blank">
              <Typography
                fontWeight="600"
                $fontSize="0.75rem"
                lineHeight="150%"
                margin="0.5rem 0 1.5rem 0"
                color={colors.secondary}
              >
                View on Explorer
              </Typography>
            </a>
          )
        };
      }),
    [transactions] // eslint-disable-line
  );

  const tableProps = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["offerExchangeId", "isOffer"]
      }
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

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`transaction_table_thead_tr_${key}`}
            >
              {headerGroup.headers.map((column, i) => {
                return (
                  <th
                    data-sortable={column.disableSortBy}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`transaction_table_thead_th_${i}`}
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
              return (
                <tr {...row.getRowProps()} key={`transaction_${row.id}`}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`transaction_${row.id}-${cell.column.id}`}
                        onClick={() => {
                          if (cell.column.id !== "linkToBlock") {
                            const pathname = generatePath(
                              row?.values?.isOffer
                                ? OffersRoutes.OfferDetail
                                : BosonRoutes.Exchange,
                              {
                                [UrlParameters.exchangeId]:
                                  row?.values?.offerExchangeId ?? "0"
                              }
                            );
                            navigate({ pathname });
                          }
                        }}
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

// eslint-disable-next-line
// @ts-nocheck
import type { Cell, Column, HeaderGroup, Row } from "@types/react-table";
import { CaretDown, CaretLeft, CaretRight, CaretUp } from "phosphor-react";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import styled from "styled-components";

import { UrlParameters } from "../../../lib/routing/parameters";
import { OffersRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useModal } from "../../modal/useModal";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  offers: (Offer | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
}

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
  border: none;
`;
export default function SellerFinancesTable({ offers, refetch }: Props) {
  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const columns = useMemo(
    () => [
      {
        Header: "Token",
        accessor: "token"
      },
      {
        Header: "All funds",
        accessor: "allFound"
      },
      {
        Header: "Locked funds",
        accessor: "lockedFounds"
      },
      {
        Header: "Withdrawable",
        accessor: "withdrawable"
      },
      {
        Header: "Offers backed",
        accessor: "offersBacked"
      },
      {
        Header: "",
        accessor: "action"
      }
    ],
    []
  );

  const data = useMemo(
    () =>
      offers?.map((offer) => {
        return {
          sku: offer.id,
          token: <Typography tag="p">MOCK 0</Typography>,
          allFound: <Typography tag="p">MOCK 1</Typography>,
          lockedFounds: <Typography tag="p">MOCK 2</Typography>,
          withdrawable: <Typography tag="p">MOCK 3</Typography>,
          offersBacked: <Typography tag="p">MOCK 4</Typography>,
          action: (
            <Grid justifyContent="space-evenly">
              <WithdrawButton
                theme="outline"
                size="small"
                onClick={() => {
                  showModal(
                    modalTypes.FINANCE_WITHDRAW_MODAL,
                    {
                      title: "Withdraw USDC",
                      offerId: offer.id,
                      offer,
                      refetch
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
                      title: "Deposit USDC",
                      offerId: offer.id,
                      offer,
                      refetch
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
    [offers] // eslint-disable-line
  );

  const tableProps = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, hiddenColumns: ["offerId", "isSelectable"] }
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
          {headerGroups.map((headerGroup: HeaderGroup, key: number) => (
            <tr
              key={`seller_table_thead_tr_${key}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column: Column, i: number) => (
                <th
                  key={`seller_table_thead_th_${i}`}
                  data-sortable={column.sortable}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {i > 0 && column.sortable && (
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
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(page.length > 0 &&
            page.map((row: Row, key: number) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`seller_table_tbody_tr_${key}`}>
                  {row.cells.map((cell: Cell, i: number) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`seller_table_tbody_td_${i}`}
                        onClick={() => {
                          return;
                          // TODO: ASK ABOUT LOGIC
                          if (
                            cell.column.id !== "action" &&
                            cell.column.id !== "selection"
                          ) {
                            const pathname = generatePath(
                              OffersRoutes.OfferDetail,
                              {
                                [UrlParameters.offerId]:
                                  row?.original?.offerId ?? 0
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

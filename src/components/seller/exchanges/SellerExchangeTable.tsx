// eslint-disable-next-line
// @ts-nocheck
import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import type {
  Cell,
  Column,
  Header,
  HeaderGroup,
  Row
} from "@types/react-table";
import dayjs from "dayjs";
import { Chat, Check } from "phosphor-react";
import { CaretDown, CaretLeft, CaretRight, CaretUp } from "phosphor-react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { generatePath } from "react-router-dom";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { CheckboxWrapper } from "../../form/Field.styles";
import { useModal } from "../../modal/useModal";
import ExchangeStatuses from "../../offer/ExchangeStatuses";
import Price from "../../price/index";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";

interface Props {
  data: (Exchange | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
}

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;
  const checkboxId = `checkbox-${Math.random().toString().replace("0.", "")}`;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <CheckboxWrapper htmlFor={checkboxId}>
      <input
        hidden
        id={checkboxId}
        type="checkbox"
        ref={resolvedRef}
        {...rest}
      />
      <div>
        <Check size={16} />
      </div>
    </CheckboxWrapper>
  );
});

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
export default function SellerExchangeTable({ data, refetch }: Props) {
  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const columns = useMemo(
    () => [
      {
        Header: "Exchange ID",
        accessor: "exchangeId"
      },
      {
        Header: "",
        accessor: "image",
        disableSortBy: true
      },
      {
        Header: "ID/SKU",
        accessor: "sku",
        sortable: true
      },
      {
        Header: "Product name",
        accessor: "productName",
        sortable: true
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true
      },
      {
        Header: "Price",
        accessor: "price",
        disableSortBy: true
      },
      {
        Header: "Offer validity",
        accessor: "offerValidity",
        disableSortBy: true
      },
      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true
      }
    ],
    []
  );

  const tableData = useMemo(
    () =>
      data?.map((element) => {
        const status = ExchangesKit.getExchangeState(element);
        return {
          exchangeId: element.id,
          isSelectable: true,
          image: (
            <Image
              src={element?.offer?.metadata?.image}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
              showPlaceholderText={false}
            />
          ),
          sku: element.id,
          productName: (
            <Typography tag="p">
              <b>{element?.offer?.metadata?.name}</b>
            </Typography>
          ),
          status: (
            <ExchangeStatuses
              offer={element?.offer}
              exchange={element as NonNullable<Offer["exchanges"]>[number]}
              size="small"
              displayDot
              showValid
              style={{
                display: "inline-block",
                position: "relative",
                top: "unset",
                left: "unset",
                right: "unset"
              }}
            />
          ),
          price: (
            <Price
              address={element?.offer?.exchangeToken?.address}
              currencySymbol={element?.offer?.exchangeToken?.symbol}
              value={element?.offer?.price}
              decimals={element?.offer?.exchangeToken?.decimals}
            />
          ),
          offerValidity: (
            // TODO: add based on status
            <Typography>
              <span>
                <small style={{ margin: "0" }}>Redeemable Until</small> <br />
                {dayjs(
                  getDateTimestamp(element?.offer?.voucherRedeemableUntilDate)
                ).format(CONFIG.dateFormat)}
              </span>
            </Typography>
          ),
          action:
            // TODO: add proper logic and modals if needed
            status === subgraph.ExchangeState.Committed ? (
              <Grid justifyContent="flex-end" gap="1rem">
                <Button
                  theme="orange"
                  size="small"
                  onClick={() => {
                    console.log(element.id);
                  }}
                >
                  Revoke
                </Button>
                <Button
                  theme="primary"
                  size="small"
                  onClick={() => {
                    console.log(element.id);
                  }}
                >
                  Chat <Chat size={14} />
                </Button>
              </Grid>
            ) : (
              <Button
                theme="secondary"
                size="small"
                onClick={() => {
                  console.log(element.id);
                }}
              >
                Redeem
              </Button>
            )
        };
      }),
    [data] // eslint-disable-line
  );

  const tableProps = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["exchangeId", "isSelectable"]
      }
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }: Header) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }: Cell) => (
            <IndeterminateCheckbox
              {...row.getToggleRowSelectedProps()}
              disabled={!row?.original?.isSelectable}
            />
          )
        },
        ...columns
      ]);
    }
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
                          if (
                            cell.column.id !== "action" &&
                            cell.column.id !== "selection"
                          ) {
                            const pathname = generatePath(
                              BosonRoutes.Exchange,
                              {
                                [UrlParameters.exchangeId]:
                                  row?.original?.exchangeId ?? 0
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

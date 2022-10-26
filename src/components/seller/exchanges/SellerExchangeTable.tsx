import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check
} from "phosphor-react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { generatePath } from "react-router-dom";
import {
  CellProps,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from "react-table";
import styled from "styled-components";

import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { isExchangeCompletableBySeller } from "../../../lib/utils/exchange";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { SellerRolesProps } from "../../../lib/utils/hooks/useSellerRoles";
import ExchangeTimeline from "../../../pages/chat/components/ExchangeTimeline";
import { CheckboxWrapper } from "../../form/Field.styles";
import ExchangeStatuses from "../../offer/ExchangeStatuses";
import { OfferHistoryStatuses } from "../../offer/OfferHistory";
import Price from "../../price/index";
import Tooltip from "../../tooltip/Tooltip";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import PaginationPages from "../common/PaginationPages";
import { SellerActionButton, SellerResolveDisputeButton } from "./SellerAction";
import SellerExchangeTimePeriod from "./SellerExchangeTimePeriod";

interface Props {
  data: (Exchange | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Array<Exchange | null>>>;
  sellerRoles: SellerRolesProps;
}

interface IIndeterminateInputProps {
  indeterminate?: boolean;
  disabled?: boolean;
}
const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IIndeterminateInputProps
>(({ indeterminate, ...rest }, ref: React.Ref<HTMLInputElement>) => {
  const defaultRef = useRef(null);
  const resolvedRef = ref || defaultRef;
  const checkboxId = `checkbox-${Math.random().toString().replace("0.", "")}`;

  useEffect(() => {
    if (
      "current" in resolvedRef &&
      resolvedRef.current !== null &&
      "indeterminate" in resolvedRef.current
    ) {
      resolvedRef.current.indeterminate = !!indeterminate;
    }
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

export default function SellerExchangeTable({
  data,
  refetch,
  setSelected,
  sellerRoles
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const columns = useMemo(
    () => [
      {
        Header: "Exchange ID",
        accessor: "exchangeId"
      } as const,
      {
        Header: "",
        accessor: "image",
        disableSortBy: true
      } as const,
      {
        Header: "ID/SKU",
        accessor: "sku"
      } as const,
      {
        Header: "Product name",
        accessor: "productName"
      } as const,
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true
      } as const,
      {
        Header: "Price",
        accessor: "price",
        disableSortBy: true
      } as const,
      {
        Header: "Time period",
        accessor: "timePeriod",
        disableSortBy: true
      } as const,
      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true
      } as const
    ],
    []
  );

  const tableData = useMemo(
    () =>
      data?.map((element) => {
        const status = element ? ExchangesKit.getExchangeState(element) : "";
        return {
          exchangeId: element?.id,
          isSelectable: element && isExchangeCompletableBySeller(element),
          image: (
            <Image
              src={element?.offer?.metadata?.image ?? ""}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
              showPlaceholderText={false}
            />
          ),
          sku: element?.id,
          productName: (
            <Typography tag="p">
              <b>{element?.offer?.metadata?.name}</b>
            </Typography>
          ),
          status: element && (
            <Tooltip
              interactive
              content={
                <OfferHistoryStatuses>
                  <ExchangeTimeline exchange={element}>
                    <h4>History</h4>
                  </ExchangeTimeline>
                </OfferHistoryStatuses>
              }
            >
              <ExchangeStatuses
                isDisputeSubState
                offer={element?.offer}
                exchange={element}
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
            </Tooltip>
          ),
          price: element && (
            <Price
              currencySymbol={element?.offer?.exchangeToken?.symbol}
              value={element?.offer?.price}
              decimals={element?.offer?.exchangeToken?.decimals}
            />
          ),
          timePeriod: element && (
            <SellerExchangeTimePeriod exchange={element} />
          ),
          action:
            status === subgraph.ExchangeState.Disputed ? (
              <SellerResolveDisputeButton
                exchange={element}
                navigate={navigate}
                sellerRoles={sellerRoles}
              />
            ) : (
              <SellerActionButton
                exchange={element}
                refetch={refetch}
                navigate={navigate}
                status={status}
                sellerRoles={sellerRoles}
              />
            )
        };
      }),
    [data, sellerRoles] // eslint-disable-line
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
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Cell: ({ row }: CellProps<any>) =>
            !row?.original?.isSelectable ? (
              <IndeterminateCheckbox disabled />
            ) : (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
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
    state: { pageIndex, pageSize, selectedRowIds }
  } = tableProps;

  const paginate = useMemo(() => {
    return Array.from(Array(pageCount).keys()).slice(
      pageIndex < 1 ? 0 : pageIndex - 1,
      pageIndex < 1 ? 3 : pageIndex + 2
    );
  }, [pageCount, pageIndex]);

  useEffect(() => {
    const arr = Object.keys(selectedRowIds);
    if (arr.length) {
      const selectedExchanges = arr
        .map((index: string) => {
          const el = rows[Number(index)];
          const exchangeId = el?.original?.exchangeId;
          const exchange = data?.find(
            (exchange) => exchange?.id === exchangeId
          );
          if (exchange && isExchangeCompletableBySeller(exchange)) {
            return exchange || null;
          }

          return null;
        })
        .filter((n): boolean => n !== null);
      setSelected(selectedExchanges);
    } else {
      setSelected([]);
    }
  }, [selectedRowIds]); // eslint-disable-line

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`seller_table_thead_tr_${key}`}
            >
              {headerGroup.headers.map((column, i) => (
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
              ))}
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
                  key={`seller_table_tbody_tr_${row.original.exchangeId}`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`seller_table_tbody_td_${row.original.exchangeId}-${cell.column.id}`}
                        onClick={() => {
                          if (
                            cell.column.id !== "action" &&
                            cell.column.id !== "selection"
                          ) {
                            const pathname = generatePath(
                              BosonRoutes.Exchange,
                              {
                                [UrlParameters.exchangeId]:
                                  row?.original?.exchangeId ?? "0"
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

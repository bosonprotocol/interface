import { ButtonSize, subgraph } from "@bosonprotocol/react-kit";
import { Button as ReactKitButton } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { CaretDown, CaretLeft, CaretRight, CaretUp } from "phosphor-react";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Disputes } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useModal } from "../../modal/useModal";
import Price from "../../price";
import PaginationPages from "../../seller/common/PaginationPages";
import Tooltip from "../../tooltip/Tooltip";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import { DisputeHistory } from "../DisputeHistory/DisputeHistory";
import {
  DisputeStateWrapper,
  HeaderSorter,
  Pagination,
  Span,
  Table
} from "./DisputesTable.styles";

interface Props {
  disputes: (Disputes | null)[];
  isError: boolean;
  isLoading?: boolean;
}

const StyledReactKitButton = styled(ReactKitButton)`
  margin-right: 0.3125rem;
`;
export default function DisputesTable({ disputes }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const { showModal, modalTypes } = useModal();

  const columns = useMemo(
    () => [
      {
        Header: "Offer ID",
        accessor: "offerId"
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
        Header: "Escalated Date",
        accessor: "escalatedDate",
        disableSortBy: true
      } as const,
      {
        Header: "Escalation Expires",
        accessor: "expiresDate",
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

  const data = useMemo(
    () =>
      disputes?.map((dispute: Disputes | null) => {
        if (!dispute) {
          return <></>;
        }

        const offer = dispute.exchange.offer;

        return {
          offerId: offer?.id,
          image: (
            <Image
              src={offer?.metadata?.image ?? ""}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
              showPlaceholderText={false}
            />
          ),
          sku: dispute.id,
          productName: (
            <Typography tag="p">
              <b>{offer?.metadata?.name}</b>
            </Typography>
          ),
          status: dispute && (
            <Tooltip
              interactive
              content={<DisputeHistory exchange={dispute.exchange} />}
            >
              <DisputeStateWrapper state={dispute.state}>
                {dispute.state}
              </DisputeStateWrapper>
            </Tooltip>
          ),
          price: (
            <Price
              currencySymbol={offer?.exchangeToken?.symbol ?? ""}
              value={offer?.price ?? ""}
              decimals={offer?.exchangeToken?.decimals ?? ""}
            />
          ),
          escalatedDate: dispute?.escalatedDate && (
            <Typography>
              <span>
                {dayjs(getDateTimestamp(dispute?.escalatedDate)).format(
                  CONFIG.dateFormat
                )}
              </span>
            </Typography>
          ),
          expiresDate: offer?.resolutionPeriodDuration && (
            <Typography>
              <span>
                {dayjs(
                  getDateTimestamp(
                    `${
                      parseInt(dispute?.escalatedDate || "") +
                      parseInt(offer?.resolutionPeriodDuration)
                    }`
                  )
                ).format(CONFIG.dateFormat)}
              </span>
            </Typography>
          ),
          action: dispute.state === subgraph.DisputeState.Escalated && (
            <>
              <StyledReactKitButton
                variant="accentInverted"
                size={ButtonSize.Small}
                onClick={async () => {
                  showModal(
                    modalTypes.DISPUTE_RESOLUTION_REFUSE_MODAL,
                    {
                      title: `Refuse to Decide Dispute: ${dispute.exchange.id}`,
                      exchangeId: dispute.exchange.id,
                      offer: dispute.exchange.offer
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Refuse
              </StyledReactKitButton>
              <ReactKitButton
                variant="primaryFill"
                size={ButtonSize.Small}
                onClick={async () => {
                  showModal(
                    modalTypes.DISPUTE_RESOLUTION_DECIDE_MODAL,
                    {
                      title: `Decide Dispute: ${dispute.exchange.id}`,
                      exchangeId: dispute.exchange.id,
                      offer: dispute.exchange.offer,
                      currencySymbol:
                        dispute.exchange.offer?.exchangeToken?.symbol ?? "",
                      value: dispute.exchange.offer?.price ?? "",
                      decimals:
                        dispute.exchange.offer?.exchangeToken?.decimals ?? ""
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Decide
              </ReactKitButton>
            </>
          )
        };
      }),
    [disputes] // eslint-disable-line
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
          {headerGroups.map((headerGroup, key) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`dispute_resolver_table_thead_tr_${key}`}
            >
              {headerGroup.headers.map((column, i) => {
                return (
                  <th
                    data-sortable={column.disableSortBy}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`dispute_resolver_table_thead_th_${i}`}
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
                <tr
                  {...row.getRowProps()}
                  key={`dispute_resolver_table_tbody_tr_${row.id}`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`dispute_resolver_table_tbody_td_${row.id}-${cell.column.id}`}
                        onClick={() => {
                          if (
                            cell.column.id !== "action" &&
                            cell.column.id !== "selection" &&
                            cell.column.id !== "status"
                          ) {
                            const pathname = generatePath(
                              BosonRoutes.Exchange,
                              {
                                [UrlParameters.exchangeId]:
                                  row?.values?.sku ?? "0"
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

import { offers as OffersKit } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { CaretDown, CaretLeft, CaretRight, CaretUp } from "phosphor-react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { generatePath } from "react-router-dom";
import {
  CellProps,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from "react-table";

import { CONFIG } from "../../../lib/config";
import { UrlParameters } from "../../../lib/routing/parameters";
import { OffersRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Disputes } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { CheckboxWrapper } from "../../form/Field.styles";
import { useModal } from "../../modal/useModal";
import OfferHistory from "../../offer/OfferHistory";
import Price from "../../price";
import PaginationPages from "../../seller/common/PaginationPages";
import Tooltip from "../../tooltip/Tooltip";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import {
  DisputeState,
  HeaderSorter,
  Pagination,
  Span,
  Table
} from "./DisputesTable.styles";

interface Props {
  disputes: (Disputes | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Array<Disputes | null>>>;
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

export default function DisputesTable({ disputes, refetch }: Props) {
  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
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
        Header: "Escalated Expires",
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

        console.log(
          "🚀  roberto --  ~ file: DisputesTable.tsx ~ line 235 ~ disputes?.map ~ dispute",
          dispute
        );

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
          sku: offer?.id,
          productName: (
            <Typography tag="p">
              <b>{offer?.metadata?.name}</b>
            </Typography>
          ),
          status: dispute && (
            <Tooltip interactive content={<OfferHistory offer={offer} />}>
              <DisputeState>{dispute.state}</DisputeState>
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
          action: !(
            status === OffersKit.OfferState.EXPIRED ||
            status === OffersKit.OfferState.VOIDED
          ) && (
            <>
              <Button
                theme="bosonSecondary"
                size="small"
                style={{ "margin-right": "5px" }}
                onClick={() => {
                  // TODO: call the refuse action from the coreSDK
                  console.log("call the refuse action from the coreSDK");
                }}
              >
                Refuse
              </Button>
              <Button
                theme="primary"
                size="small"
                onClick={() => {
                  // TODO: call the decide action from the coreSDK
                  console.log("call the decide action from the coreSDK");
                }}
              >
                Decide
              </Button>
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
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            );
          },
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
                              OffersRoutes.OfferDetail,
                              {
                                [UrlParameters.offerId]: row?.id ?? "0"
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

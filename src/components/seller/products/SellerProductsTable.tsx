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
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { UrlParameters } from "../../../lib/routing/parameters";
import { OffersRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { CheckboxWrapper } from "../../form/Field.styles";
import { useModal } from "../../modal/useModal";
import OfferHistory from "../../offer/OfferHistory";
import OfferStatuses from "../../offer/OfferStatuses";
import Price from "../../price/index";
import Tooltip from "../../tooltip/Tooltip";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import PaginationPages from "../common/PaginationPages";

interface Props {
  offers: (Offer | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Array<Offer | null>>>;
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
export default function SellerProductsTable({
  offers,
  refetch,
  setSelected
}: Props) {
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
        Header: "Quantity (available/total)",
        accessor: "quantity",
        disableSortBy: true
      } as const,
      {
        Header: "Price",
        accessor: "price",
        disableSortBy: true
      } as const,
      {
        Header: "Offer validity",
        accessor: "offerValidity",
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
      offers?.map((offer) => {
        const status = offer ? OffersKit.getOfferStatus(offer) : "";

        return {
          offerId: offer?.id,
          isSelectable: !(
            status === OffersKit.OfferState.EXPIRED ||
            status === OffersKit.OfferState.VOIDED
          ),
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
          status: offer && (
            <Tooltip interactive content={<OfferHistory offer={offer} />}>
              <OfferStatuses
                offer={offer}
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
          quantity: (
            <Typography>
              {offer?.quantityAvailable}/{offer?.quantityInitial}
            </Typography>
          ),
          price: (
            <Price
              currencySymbol={offer?.exchangeToken?.symbol ?? ""}
              value={offer?.price ?? ""}
              decimals={offer?.exchangeToken?.decimals ?? ""}
            />
          ),
          offerValidity: offer?.validUntilDate && (
            <Typography>
              <span>
                <small style={{ margin: "0" }}>Until</small> <br />
                {dayjs(getDateTimestamp(offer.validUntilDate)).format(
                  CONFIG.dateFormat
                )}
              </span>
            </Typography>
          ),
          action: !(
            status === OffersKit.OfferState.EXPIRED ||
            status === OffersKit.OfferState.VOIDED
          ) && (
            <Button
              theme="orangeInverse"
              size="small"
              onClick={() => {
                if (offer) {
                  showModal(
                    modalTypes.VOID_PRODUCT,
                    {
                      title: "Void Confirmation",
                      offerId: offer.id,
                      offer,
                      refetch
                    },
                    "xs"
                  );
                }
              }}
            >
              Void
            </Button>
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
      const selectedOffers = arr
        .map((index: string) => {
          const el = rows[Number(index)];
          const offerId = el?.original?.offerId;
          const offer = offers?.find((offer) => offer?.id === offerId);
          const status = offer ? OffersKit.getOfferStatus(offer) : "";

          if (
            !(
              status === OffersKit.OfferState.EXPIRED ||
              status === OffersKit.OfferState.VOIDED
            )
          ) {
            return offer || null;
          }

          return null;
        })
        .filter((n): boolean => n !== null);
      setSelected(selectedOffers);
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
              return (
                <tr
                  {...row.getRowProps()}
                  key={`seller_table_tbody_tr_${row.original.offerId}`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`seller_table_tbody_td_${row.original.offerId}-${cell.column.id}`}
                        onClick={() => {
                          if (
                            cell.column.id !== "action" &&
                            cell.column.id !== "selection" &&
                            cell.column.id !== "status"
                          ) {
                            const pathname = generatePath(
                              OffersRoutes.OfferDetail,
                              {
                                [UrlParameters.offerId]:
                                  row?.original?.offerId ?? "0"
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

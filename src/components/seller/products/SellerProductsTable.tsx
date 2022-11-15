import { ButtonSize, offers as OffersKit } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import uniqBy from "lodash/uniqBy";
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
  useExpanded,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from "react-table";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { UrlParameters } from "../../../lib/routing/parameters";
import { ProductRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { SellerRolesProps } from "../../../lib/utils/hooks/useSellerRoles";
import { ExtendedOffer } from "../../../pages/explore/WithAllOffers";
import { CheckboxWrapper } from "../../form/Field.styles";
import { useModal } from "../../modal/useModal";
import OfferHistory from "../../offer/OfferHistory";
import OfferStatuses from "../../offer/OfferStatuses";
import Price from "../../price/index";
import Tooltip from "../../tooltip/Tooltip";
import BosonButton from "../../ui/BosonButton";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import PaginationPages from "../common/PaginationPages";

const VoidButton = styled(BosonButton)`
  background: transparent;
  border-color: ${colors.orange};
  color: ${colors.orange};
  &:hover {
    background: ${colors.orange};
    border-color: ${colors.orange};
    color: ${colors.white};
  }
`;

const StyledCheckboxWrapper = styled(CheckboxWrapper)``;

interface Props {
  offers: (ExtendedOffer | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Array<Offer | null>>>;
  sellerRoles: SellerRolesProps;
}

interface IIndeterminateInputProps {
  indeterminate?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IIndeterminateInputProps
>(
  (
    { indeterminate, style, onClick, ...rest },
    ref: React.Ref<HTMLInputElement>
  ) => {
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
      <StyledCheckboxWrapper htmlFor={checkboxId} style={style}>
        <input
          hidden
          id={checkboxId}
          type="checkbox"
          ref={resolvedRef}
          onClick={onClick}
          {...rest}
        />
        <div>
          <Check size={16} />
        </div>
      </StyledCheckboxWrapper>
    );
  }
);

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  .th {
    font-weight: 600;
    color: ${colors.darkGrey};
    :not([data-sortable]) {
      cursor: default !important;
    }
    [data-sortable] {
      cursor: pointer !important;
    }
    .td {
      &:nth-of-type(1) {
        max-width: 100px;
      }
    }
  }
  .td {
    font-weight: 400;
    color: ${colors.black};
    &:nth-of-type(1) {
      max-width: 40px;
    }
  }
  .th,
  .td {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 0.75rem;
    line-height: 1.5;
  }
  .thead {
    .tr {
      .th {
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
  .tbody {
    padding-top: 5px;
    padding-left: 8px;
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tr {
      :hover {
        .td {
          background-color: ${colors.darkGrey}08;
          cursor: pointer;
        }
      }
      &:not(:last-child) {
        .td {
          border-bottom: 1px solid ${colors.border};
        }
      }
      .td {
        text-align: left;
        padding: 0.5rem;
        align-items: center;
        display: flex;
        &:first-child {
        }
        &:last-child {
          display: flex;
          justify-content: flex-end;
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
  setSelected,
  sellerRoles
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
        disableSortBy: true,
        maxWidth: 50
      } as const,
      {
        Header: "ID/SKU",
        accessor: "sku",
        maxWidth: 100
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
        const showVariant =
          offer?.additional?.variants && offer?.additional?.variants.length > 1;
        return {
          offerId: offer?.id,
          uuid: offer?.metadata?.product?.uuid,
          isSubRow: false,
          subRows: showVariant
            ? offer?.additional?.variants.map((variant) => {
                const variantStatus = offer
                  ? OffersKit.getOfferStatus(variant)
                  : "";
                return {
                  isSubRow: true,
                  offerId: variant.id,
                  uuid: offer.additional?.product?.uuid ?? "",
                  isSelectable: !(
                    variantStatus === OffersKit.OfferState.EXPIRED ||
                    variantStatus === OffersKit.OfferState.VOIDED
                  ),
                  image: variant.metadata && "image" in variant.metadata && (
                    <Image
                      src={variant.metadata.image}
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        paddingTop: "0%",
                        fontSize: "0.75rem",
                        marginLeft: "35px"
                      }}
                      showPlaceholderText={false}
                    />
                  ),

                  sku: (
                    <Tooltip
                      content={
                        <Typography $fontSize="0.75rem">
                          {variant.metadata && "uuid" in variant.metadata
                            ? variant.metadata.uuid
                            : ""}
                        </Typography>
                      }
                    >
                      <Typography
                        $fontSize="0.75rem"
                        style={{
                          paddingLeft: "2rem"
                        }}
                      >
                        {variant.metadata && "uuid" in variant.metadata
                          ? variant.metadata.uuid.substring(0, 3) + "..."
                          : ""}
                      </Typography>
                    </Tooltip>
                  ),
                  productName: (
                    <Typography
                      style={{
                        textTransform: "uppercase",
                        marginLeft: "2rem"
                      }}
                      tag="p"
                    >
                      {variant?.metadata?.name}
                    </Typography>
                  ),
                  status: variant && (
                    <Tooltip
                      interactive
                      content={<OfferHistory offer={variant as Offer} />}
                    >
                      <OfferStatuses
                        offer={variant as Offer}
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
                      {variant?.quantityAvailable}/{variant?.quantityInitial}
                    </Typography>
                  ),
                  price: (
                    <Price
                      currencySymbol={variant?.exchangeToken?.symbol ?? ""}
                      value={variant?.price ?? ""}
                      decimals={variant?.exchangeToken?.decimals ?? ""}
                    />
                  ),
                  offerValidity: variant?.validUntilDate && (
                    <Typography>
                      <span>
                        <small style={{ margin: "0" }}>Until</small> <br />
                        {dayjs(getDateTimestamp(variant.validUntilDate)).format(
                          CONFIG.dateFormat
                        )}
                      </span>
                    </Typography>
                  ),
                  action: !(
                    variantStatus === OffersKit.OfferState.EXPIRED ||
                    variantStatus === OffersKit.OfferState.VOIDED ||
                    variant?.quantityAvailable === "0"
                  ) && (
                    <VoidButton
                      variant="secondaryInverted"
                      size={ButtonSize.Small}
                      disabled={!sellerRoles?.isOperator}
                      tooltip="This action is restricted to only the operator wallet"
                      onClick={() => {
                        if (variant) {
                          showModal(
                            modalTypes.VOID_PRODUCT,
                            {
                              title: "Void Confirmation",
                              offerId: variant.id,
                              offer: variant as Offer,
                              refetch
                            },
                            "xs"
                          );
                        }
                      }}
                    >
                      Void
                    </VoidButton>
                  )
                };
              })
            : [],
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
          sku: <Typography $fontSize="0.75rem">{offer?.id}</Typography>,
          productName: (
            <Grid justifyContent="flex-start" alignItems="center">
              <div>
                <Typography
                  tag="p"
                  style={{
                    marginBottom: 0
                  }}
                >
                  <b>{offer?.metadata?.name}</b>
                </Typography>
                {showVariant && (
                  <Typography
                    tag="span"
                    $fontSize="0.75rem"
                    color={colors.darkGrey}
                  >
                    {offer?.additional?.variants.length} variants
                  </Typography>
                )}
              </div>
              {showVariant && (
                <CaretDown
                  size={14}
                  style={{
                    marginLeft: "0.5rem"
                  }}
                />
              )}
            </Grid>
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
            status === OffersKit.OfferState.VOIDED ||
            offer?.quantityAvailable === "0"
          ) && (
            <VoidButton
              variant="secondaryInverted"
              size={ButtonSize.Small}
              disabled={!sellerRoles?.isOperator}
              tooltip="This action is restricted to only the operator wallet"
              onClick={() => {
                if (offer) {
                  if (showVariant) {
                    showModal(
                      modalTypes.VOID_PRODUCT,
                      {
                        title: "Void Confirmation",
                        offers: offer.additional?.variants.filter((variant) => {
                          variant.validUntilDate;
                          return (
                            !variant.voided &&
                            !dayjs(
                              getDateTimestamp(offer?.validUntilDate)
                            ).isBefore(dayjs())
                          );
                        }) as Offer[],
                        refetch
                      },
                      "s"
                    );
                  } else {
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
                }
              }}
            >
              Void
            </VoidButton>
          )
        };
      }),
    [offers] // eslint-disable-line
  );

  const tableProps = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["offerId", "uuid", "isSelectable"]
      },
      paginateExpandedRows: false,
      autoResetExpanded: false
    },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useFlexLayout,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          width: 70,
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Cell: ({ row }: CellProps<any>) => {
            return !row?.original?.isSelectable ? (
              <>
                <IndeterminateCheckbox
                  disabled
                  style={{
                    paddingLeft: row.original.isSubRow ? "2.375rem" : "0"
                  }}
                />
              </>
            ) : (
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                style={{
                  paddingLeft: row.original.isSubRow ? "2.375rem" : "0"
                }}
                onClick={() => {
                  row.toggleRowExpanded(true);
                }}
              />
            );
          }
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

  const subRows = useMemo(() => {
    return rows.reduce((acc, row) => {
      if (row.subRows.length > 1) {
        row.subRows.forEach((sub) => {
          acc.push(sub);
        });
      }
      return acc;
    }, [] as typeof rows);
  }, [rows]);

  useEffect(() => {
    const arr = Object.keys(selectedRowIds);
    const flatRows = [...rows, ...subRows];

    if (arr.length) {
      const selectedOffers = arr
        .map((index: string) => {
          const el = flatRows.find((elem) => elem.id === index);
          const offerId = el?.original?.offerId;
          const subOffers = offers
            .map((offer) => {
              if (
                offer?.additional?.variants &&
                offer?.additional?.variants?.length > 1
              ) {
                return offer?.additional?.variants;
              }
              return [];
            })
            .flat()
            .filter(Boolean);
          const offer = [...subOffers, ...offers]?.find(
            (offer) => offer?.id === offerId
          );
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
      setSelected(uniqBy(selectedOffers, "id") as (Offer | null)[]);
    } else {
      setSelected([]);
    }
  }, [selectedRowIds, subRows]); // eslint-disable-line

  return (
    <>
      <Table {...getTableProps()}>
        <div className="thead">
          {headerGroups.map((headerGroup, key) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              key={`seller_table_thead_tr_${key}`}
              className="tr"
            >
              {headerGroup.headers.map((column, i) => {
                return (
                  <div
                    data-sortable={column.disableSortBy}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`seller_table_thead_th_${i}`}
                    className="th"
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
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="tbody">
          {(page.length > 0 &&
            page.map((row, index) => {
              prepareRow(row);
              return (
                <div
                  {...row.getRowProps()}
                  key={`seller_table_tbody_tr_${row.original.offerId}-${index}`}
                  className="row"
                >
                  {row.cells.map((cell) => {
                    const hasSubRows = cell.row.subRows.length > 1;
                    return (
                      <div
                        {...cell.getCellProps()}
                        key={`seller_table_tbody_td_${row.original.offerId}-${cell.column.id}`}
                        onClick={() => {
                          if (hasSubRows) {
                            if (
                              (!cell.row.isExpanded &&
                                cell.column.id === "action") ||
                              cell.column.id === "productName"
                            ) {
                              cell.row.toggleRowExpanded();
                            }
                          } else if (
                            cell.column.id !== "action" &&
                            cell.column.id !== "selection" &&
                            cell.column.id !== "status"
                          ) {
                            const pathname = generatePath(
                              ProductRoutes.ProductDetail,
                              {
                                [UrlParameters.uuid]: row?.original?.uuid ?? ""
                              }
                            );
                            navigate({ pathname });
                          }
                        }}
                      >
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })) || (
            <div>
              <div>
                <Typography
                  tag="h6"
                  justifyContent="center"
                  padding="1rem 0"
                  margin="0"
                >
                  No data to display
                </Typography>
              </div>
            </div>
          )}
        </div>
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

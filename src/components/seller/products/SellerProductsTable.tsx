import { offers as OffersKit } from "@bosonprotocol/react-kit";
import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { NO_EXPIRATION } from "lib/constants/offer";
import { defaultFontFamily } from "lib/styles/fonts";
import { formatDate } from "lib/utils/date";
import uniqBy from "lodash/uniqBy";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  WarningCircle
} from "phosphor-react";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
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

import {
  SellerHubQueryParameters,
  UrlParameters
} from "../../../lib/routing/parameters";
import { ProductRoutes, SellerCenterRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { isTruthy } from "../../../lib/types/helpers";
import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { getProductStatusBasedOnVariants } from "../../../lib/utils/getProductStatusBasedOnVariants";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { SellerRolesProps } from "../../../lib/utils/hooks/useSellerRoles";
import { ExtendedOffer } from "../../../pages/explore/WithAllOffers";
import { CheckboxWrapper } from "../../form/Field.styles";
import { Spinner } from "../../loading/Spinner";
import { Channels } from "../../modal/components/SalesChannelsModal/form";
import { useModal } from "../../modal/useModal";
import OfferStatuses from "../../offer/OfferStatuses";
import Price from "../../price/index";
import Tooltip from "../../tooltip/Tooltip";
import BosonButton from "../../ui/BosonButton";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";
import { UnthemedButton } from "../../ui/UnthemedButton";
import PaginationPages from "../common/PaginationPages";
import { BackedProps, OffersBackedProps } from "../common/WithSellerData";
import Actions from "./Actions";
import OfferVariation from "./OfferVariation";
import { SalesChannels } from "./types";

const TagWrapper = styled.div`
  background-color: ${colors.lightGrey};
  display: inline-block;
  padding: 0.5em 0.75em;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: pre;
`;

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

export interface SellerProductsTableProps {
  offers: (ExtendedOffer | null)[];
  isError: boolean;
  isLoading?: boolean;
  refetch: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Array<Offer | null>>>;
  sellerRoles: SellerRolesProps;
  currentTag: string;
  offersBacked: OffersBackedProps;
  columnsToShow?: ProductsTableColumnId[] | Readonly<ProductsTableColumnId[]>;
  salesChannels: SalesChannels;
  refetchSellers: () => void;
  isSellersRefetching: boolean;
  sellerId: string;
}

interface IIndeterminateInputProps {
  indeterminate?: boolean;
  disabled?: boolean;
  isChecked?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IIndeterminateInputProps
>(
  (
    { indeterminate, style, onClick, onChange, isChecked, ...rest },
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onClick?.();
      onChange?.(e);
    };

    return (
      <StyledCheckboxWrapper htmlFor={checkboxId} style={style}>
        <input
          hidden
          id={checkboxId}
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          checked={isChecked as boolean}
          onChange={handleChange}
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
    font-family: ${defaultFontFamily};
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
      margin: 0.5rem 0;
      [role="cell"] {
        p {
          padding: 0;
          margin: 0;
        }
      }
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

const statusOrder = [
  OffersKit.OfferState.NOT_YET_VALID,
  OffersKit.OfferState.VALID,
  OffersKit.OfferState.VOIDED,
  OffersKit.OfferState.EXPIRED
] as const;

const compareOffersSortByStatus = (
  { offerStatus: offerStatusA }: { offerStatus: OffersKit.OfferState | string },
  { offerStatus: offerStatusB }: { offerStatus: OffersKit.OfferState | string }
): number => {
  if (!offerStatusA) {
    return -1;
  }
  if (!offerStatusB) {
    return 1;
  }
  return (
    statusOrder.indexOf(offerStatusA as OffersKit.OfferState) -
    statusOrder.indexOf(offerStatusB as OffersKit.OfferState)
  );
};

export enum ProductsTableColumnId {
  offerId = "offerId",
  warningIcon = "warningIcon",
  image = "image",
  sku = "sku",
  productName = "productName",
  status = "status",
  quantity = "quantity",
  price = "price",
  offerValidity = "offerValidity",
  salesChannels = "salesChannels",
  action = "action"
}
const defaultColumnsToShow = Object.values(ProductsTableColumnId);

export default function SellerProductsTable({
  offers,
  refetch,
  setSelected,
  sellerRoles,
  currentTag,
  offersBacked,
  columnsToShow = defaultColumnsToShow,
  salesChannels: salesChannelsWithoutdApp,
  refetchSellers,
  isSellersRefetching,
  sellerId
}: SellerProductsTableProps) {
  const salesChannels: SalesChannels = useMemo(
    () => [
      {
        tag: Channels.dApp,
        id: `${sellerId}-${Channels.dApp.toLowerCase()}-sale-channel`
      } as SalesChannels[number],
      ...salesChannelsWithoutdApp
    ],
    [salesChannelsWithoutdApp, sellerId]
  );
  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const columns = useMemo(
    () =>
      [
        {
          id: ProductsTableColumnId.offerId,
          Header: "Offer ID",
          accessor: "offerId"
        } as const,
        {
          id: ProductsTableColumnId.warningIcon,
          Header: "",
          accessor: "warningIcon",
          disableSortBy: true,
          maxWidth: 30
        } as const,
        {
          id: ProductsTableColumnId.image,
          Header: "",
          accessor: "image",
          disableSortBy: true,
          maxWidth: 50
        } as const,
        {
          id: ProductsTableColumnId.sku,
          Header: "ID/SKU",
          accessor: "sku",
          maxWidth: 80
        } as const,
        {
          id: ProductsTableColumnId.productName,
          Header: "Product name",
          accessor: "productName",
          maxWidth: 200
        } as const,
        {
          id: ProductsTableColumnId.status,
          Header: "Status",
          accessor: "status",
          disableSortBy: true,
          maxWidth: 100
        } as const,
        {
          id: ProductsTableColumnId.quantity,
          Header: "Quantity (available/total)",
          accessor: "quantity",
          disableSortBy: true
        } as const,
        {
          id: ProductsTableColumnId.price,
          Header: "Price",
          accessor: "price",
          disableSortBy: true
        } as const,
        {
          id: ProductsTableColumnId.offerValidity,
          Header: "Offer validity",
          accessor: "offerValidity",
          disableSortBy: true
        } as const,
        {
          id: ProductsTableColumnId.salesChannels,
          Header: "Sales channels",
          accessor: "salesChannels",
          disableSortBy: true
        } as const,
        {
          id: ProductsTableColumnId.action,
          Header: "Action",
          accessor: "action",
          disableSortBy: true
        } as const
      ].filter((col) => columnsToShow.includes(col.id)),
    [columnsToShow]
  );

  const shouldDisplayFundWarning = useCallback(
    (token: string | undefined) => {
      if (token) {
        const { offersBacked: offers, threshold } = offersBacked;
        const backedFund = offers.find(
          (v: BackedProps) =>
            v.token === token &&
            v?.value !== null &&
            Number(v?.value) < threshold
        );

        if (backedFund !== undefined) {
          return (
            <Tooltip
              content={
                <Typography
                  $fontSize="0.75rem"
                  color={colors.red}
                  fontWeight="600"
                >
                  Please deposit {token} via the Finances page.
                </Typography>
              }
            >
              <WarningCircle size={20} color={colors.orange} />
            </Tooltip>
          );
        }
      }
      return null;
    },
    [offersBacked]
  );

  const data = useMemo(
    () =>
      offers
        ?.map((offer) => {
          const status = offer
            ? offer?.additional?.variants?.length
              ? getProductStatusBasedOnVariants(offer?.additional?.variants)
              : OffersKit.getOfferStatus(offer)
            : "";

          const showVariant =
            offer?.additional?.variants &&
            offer?.additional?.variants.length > 1;
          if (currentTag === "voided" && offer !== null && offer.additional) {
            offer.additional.variants = offer.additional.variants.filter(
              (variant) => variant.voided
            );
          }
          if (currentTag === "expired" && offer !== null && offer.additional) {
            offer.additional.variants = offer.additional.variants.filter(
              (variant) =>
                dayjs(getDateTimestamp(variant?.validUntilDate)).isBefore(
                  dayjs()
                ) && !variant.voided
            );
          }
          return {
            offerStatus: status,
            offerId: offer?.id,
            uuid: offer?.metadata?.product?.uuid,
            isSubRow: false,
            subRows: showVariant
              ? (offer?.additional?.variants || [])
                  .map((variant) => {
                    const variantStatus = offer
                      ? OffersKit.getOfferStatus(variant)
                      : "";
                    const color = (
                      variant.metadata as subgraph.ProductV1MetadataEntity
                    )?.attributes?.find(
                      (attribute) =>
                        attribute?.traitType?.toLowerCase() === "color"
                    )?.value;
                    const size = (
                      variant.metadata as subgraph.ProductV1MetadataEntity
                    )?.attributes?.find(
                      (attribute) =>
                        attribute?.traitType?.toLowerCase() === "size"
                    )?.value;
                    return {
                      offerStatus: variantStatus,
                      isSubRow: true,
                      offerId: variant.id,
                      uuid: offer.additional?.product?.uuid ?? "",
                      isSelectable: !(
                        variantStatus === OffersKit.OfferState.EXPIRED ||
                        variantStatus === OffersKit.OfferState.VOIDED
                      ),
                      warningIcon: shouldDisplayFundWarning(
                        offer?.exchangeToken?.symbol
                      ),
                      image: variant.metadata &&
                        "image" in variant.metadata && (
                          <Image
                            src={variant.metadata.image}
                            style={{
                              width: "2.5rem",
                              height: "2.5rem",
                              paddingTop: "0%",
                              fontSize: "0.75rem",
                              marginLeft: "2.1875rem"
                            }}
                            showPlaceholderText={false}
                          />
                        ),
                      sku: (
                        <Typography
                          justifyContent="flex-start"
                          $fontSize="0.75rem"
                          style={{
                            paddingLeft: "2rem"
                          }}
                        >
                          {variant.id}
                        </Typography>
                      ),
                      productName: (
                        <Grid
                          flexDirection="column"
                          alignItems="flex-start"
                          style={{
                            paddingLeft: "2rem",
                            paddingRight: "0.5rem"
                          }}
                        >
                          <Typography tag="p">
                            {variant?.metadata?.name}
                          </Typography>
                          <OfferVariation color={color} size={size} />
                        </Grid>
                      ),
                      status: variant && (
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
                      ),
                      quantity: (
                        <Typography justifyContent="flex-start">
                          {variant?.quantityAvailable}/
                          {variant?.quantityInitial}
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
                        <Typography justifyContent="flex-start">
                          <span>
                            <small style={{ margin: "0" }}>Until</small> <br />
                            {formatDate(
                              getDateTimestamp(variant.validUntilDate),
                              { textIfTooBig: NO_EXPIRATION }
                            )}
                          </span>
                        </Typography>
                      ),
                      action: !(
                        variantStatus === OffersKit.OfferState.EXPIRED ||
                        variantStatus === OffersKit.OfferState.VOIDED ||
                        variant?.quantityAvailable === "0"
                      ) && (
                        <Grid justifyContent="flex-end">
                          <VoidButton
                            variant="secondaryInverted"
                            size="small"
                            disabled={!sellerRoles?.isAssistant}
                            tooltip="This action is restricted to only the assistant wallet"
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
                        </Grid>
                      )
                    };
                  })
                  .filter(isTruthy)
                  .sort(compareOffersSortByStatus)
              : [],
            isSelectable: !(
              status === OffersKit.OfferState.EXPIRED ||
              status === OffersKit.OfferState.VOIDED
            ),
            warningIcon: shouldDisplayFundWarning(offer?.exchangeToken?.symbol),
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
            sku: (
              <Tooltip
                content={
                  <Typography $fontSize="0.75rem">
                    {offer?.metadata?.product?.uuid || ""}
                  </Typography>
                }
              >
                <Typography $fontSize="0.75rem">
                  {offer?.metadata?.product?.uuid?.substring(0, 4) + "..."}
                </Typography>
              </Tooltip>
            ),
            productName: (
              <Grid justifyContent="flex-start" alignItems="center">
                <div>
                  <Typography
                    tag="p"
                    style={{
                      marginBottom: 0,
                      cursor: "pointer"
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
                      marginLeft: "0.5rem",
                      cursor: "pointer"
                    }}
                  />
                )}
              </Grid>
            ),
            status: offer && (
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
            ),
            quantity: (
              <Typography justifyContent="flex-start">
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
                  {formatDate(getDateTimestamp(offer.validUntilDate), {
                    textIfTooBig: NO_EXPIRATION
                  })}
                </span>
              </Typography>
            ),
            salesChannels: (() => {
              return (
                <Grid
                  gap="1rem"
                  justifyContent="flex-start"
                  style={{ flexWrap: "wrap" }}
                >
                  {salesChannels
                    .filter(
                      (ch) =>
                        [Channels.dApp, Channels["Custom storefront"]].includes(
                          ch.tag as unknown as Channels
                        ) ||
                        ch.deployments?.some(
                          (deployment) =>
                            deployment?.product?.uuid ===
                              offer?.additional?.product.uuid &&
                            offer?.additional?.product.uuid
                        )
                    )
                    .map((channel) => {
                      return (
                        <TagWrapper
                          key={
                            channel.tag + "-" + channel.link + "-" + channel.id
                          }
                        >
                          {channel.name ?? channel.tag}
                        </TagWrapper>
                      );
                    })}
                  {isSellersRefetching && <Spinner size={10} />}
                </Grid>
              );
            })(),
            action: (() => {
              const withVoidButton = !(
                status === OffersKit.OfferState.EXPIRED ||
                status === OffersKit.OfferState.VOIDED ||
                offer?.quantityAvailable === "0"
              );
              return (
                <Grid gap="1rem" justifyContent="flex-end">
                  <Actions
                    label="Actions"
                    items={[
                      ...(withVoidButton
                        ? [
                            {
                              key: "void",
                              content: (
                                <UnthemedButton
                                  style={{ width: "100%" }}
                                  disabled={!sellerRoles?.isAssistant}
                                  tooltip="This action is restricted to only the assistant wallet"
                                  onClick={() => {
                                    if (offer) {
                                      if (showVariant) {
                                        showModal(
                                          modalTypes.VOID_PRODUCT,
                                          {
                                            title: "Void Confirmation",
                                            offers:
                                              offer.additional?.variants.filter(
                                                (variant) => {
                                                  variant.validUntilDate;
                                                  return (
                                                    !variant.voided &&
                                                    !dayjs(
                                                      getDateTimestamp(
                                                        offer?.validUntilDate
                                                      )
                                                    ).isBefore(dayjs())
                                                  );
                                                }
                                              ) as Offer[],
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
                                </UnthemedButton>
                              )
                            }
                          ]
                        : []),
                      {
                        key: "relist",
                        content: (
                          <UnthemedButton
                            style={{ width: "100%" }}
                            tooltip="This action is restricted to only the assistant wallet"
                            disabled={!offer || !sellerRoles?.isAssistant}
                            onClick={async (event) => {
                              event.stopPropagation();
                              if (!offer || !offer.uuid) {
                                return;
                              }
                              navigate({
                                pathname: SellerCenterRoutes.CreateProduct,
                                search: {
                                  [SellerHubQueryParameters.fromProductUuid]:
                                    offer.uuid
                                }
                              });
                            }}
                          >
                            Relist
                          </UnthemedButton>
                        )
                      },
                      {
                        key: "update-sales-channels",
                        content: (
                          <UnthemedButton
                            style={{ width: "100%" }}
                            onClick={() => {
                              if (
                                !offer ||
                                !offer.additional?.product.uuid ||
                                !offer.additional?.product.version
                              ) {
                                return;
                              }
                              showModal(
                                modalTypes.SALES_CHANNELS,
                                {
                                  title: "Update sales channels",
                                  productUuid: offer.additional?.product.uuid,
                                  version: offer.additional?.product.version,
                                  sellerSalesChannels: salesChannels,
                                  onClose: () => {
                                    setTimeout(() => {
                                      refetchSellers();
                                    }, 10000); // give enough time to the subgraph to reindex
                                  }
                                },
                                "auto",
                                undefined,
                                {
                                  m: "35rem"
                                }
                              );
                            }}
                          >
                            Update sales channels
                          </UnthemedButton>
                        )
                      }
                    ].filter(isTruthy)}
                  />
                </Grid>
              );
            })()
          };
        })
        .sort(compareOffersSortByStatus),
    [offers, salesChannels, isSellersRefetching] // eslint-disable-line
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
          width: 35,
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Cell: ({ row, state }: CellProps<any>) => {
            const isChecked =
              (state?.selectedRowIds?.[row?.id] || false) === true &&
              row.original.isSelectable;
            return !row?.original?.isSelectable ? (
              <>
                <IndeterminateCheckbox
                  disabled
                  style={{
                    paddingLeft: row.original.isSubRow ? "2.375rem" : "0"
                  }}
                  isChecked={isChecked}
                  {...row.getToggleRowSelectedProps()}
                />
              </>
            ) : (
              <IndeterminateCheckbox
                style={{
                  paddingLeft: row.original.isSubRow ? "2.375rem" : "0"
                }}
                onClick={() => {
                  row.toggleRowExpanded(true);
                }}
                isChecked={isChecked}
                {...row.getToggleRowSelectedProps()}
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
      <div style={{ width: "100%", overflow: "auto" }}>
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
                                  [UrlParameters.uuid]:
                                    row?.original?.uuid ?? "",
                                  [UrlParameters.sellerId]: sellerId
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
      </div>
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

// TODO: remove below comments
// eslint-disable-next-line
// @ts-nocheck
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { CaretDown, CaretLeft, CaretRight, CaretUp } from "phosphor-react";
import { Dispatch, forwardRef, useEffect, useMemo, useRef } from "react";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { CheckboxWrapper } from "../../form/Field.styles";
import Price from "../../price/index";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import Typography from "../../ui/Typography";

interface Props {
  offers?: Array<Offer>;
  isError: boolean;
  isLoading?: boolean;
  offersPerPage: number;
  setOffersPerPage: Dispatch<SetStateAction<number>>;
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

export default function SellerTable({
  offers,
  offersPerPage,
  setOffersPerPage
}: Props) {
  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "image"
      },
      {
        Header: "ID/SKU",
        accessor: "sku"
      },
      {
        Header: "Product name",
        accessor: "productName"
      },
      {
        Header: "Status",
        accessor: "status"
      },
      {
        Header: "Quantity",
        accessor: "quantity"
      },
      {
        Header: "Price",
        accessor: "price"
      },
      {
        Header: "Offer validity",
        accessor: "offerValidity"
      },
      {
        Header: "Action",
        accessor: "action"
      }
    ],
    []
  );

  const data = useMemo(
    () =>
      offers.map((offer) => {
        return {
          image: (
            <Image
              // TODO: prefetch to prevent reloading
              src={offer.metadata?.image}
              style={{
                width: "5rem",
                height: "5rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
              showPlaceholderText={false}
            />
          ),
          sku: ("0000" + offer.id).slice(-4),
          productName: offer.metadata?.name,
          status: "status",
          quantity: (
            <Typography>
              {offer.quantityAvailable}/{offer.quantityInitial}
            </Typography>
          ),
          price: (
            <Price
              address={offer.exchangeToken.address}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          ),
          offerValidity: (
            <Typography>
              Until <br />
              {dayjs(getDateTimestamp(offer?.validUntilDate)).format(
                CONFIG.dateFormat
              )}
            </Typography>
          ),
          action: (
            <Button
              // disabled
              theme="primary"
              size="small"
              onClick={() => {
                console.log(`VOID: ${offer.id}`);
              }}
            >
              Void
            </Button>
          )
        };
      }),
    [offers]
  );

  const tableProps = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: 10
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }: any) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
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
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage
  } = tableProps;
  console.log("dsfdsfsd", tableProps);

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any, key: number) => (
            <tr
              key={`seller_table_thead_tr_${key}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column: any, i: number) => (
                <th
                  key={`seller_table_thead_th_${i}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <HeaderSorter>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <CaretDown size={16} />
                      ) : (
                        <CaretUp size={16} />
                      )
                    ) : (
                      ""
                    )}
                  </HeaderSorter>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any, key: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`seller_table_tbody_tr_${key}`}>
                {row.cells.map((cell: any, i: number) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={`seller_table_tbody_td_${i}`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        <Grid>
          <Grid justifyContent="flex-start" gap="1rem">
            <Span>
              Show
              <select
                value={offersPerPage}
                onChange={(e) => {
                  setOffersPerPage(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              per page
            </Span>
            <Span>
              Showing {tableProps.state.pageIndex + 1} -{" "}
              {tableProps.rows.length} of {tableProps.rows.length} entries
            </Span>
          </Grid>
          <Grid justifyContent="flex-end" gap="1rem">
            <Button
              size="small"
              theme="blank"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <CaretLeft size={16} />
            </Button>
            <Button size="small" theme="blank" onClick={() => gotoPage(1)}>
              1
            </Button>
            <Button
              size="small"
              theme="blank"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <CaretRight size={16} />
            </Button>
          </Grid>
        </Grid>
      </Pagination>
    </>
  );
}

import dayjs from "dayjs";

import { Offer } from "../../lib/types/offer";
import { IPrice } from "../../lib/utils/convertPrice";
import { getDateTimestamp } from "../../lib/utils/getDateTimestamp";
import { useConvertedPrice } from "../price/useConvertedPrice";
import Typography from "../ui/Typography";
import { EVENT_TYPES, HEADER } from "./const";
import { Transactions } from "./Detail.style";

interface Props {
  offer: Offer;
  exchange: NonNullable<Offer["exchanges"]>[number];
  title?: string;
  buyerAddress: string;
}

interface ITransactionHistory {
  event: typeof EVENT_TYPES[number];
  from: string;
  to: string;
  price?: string | null | undefined;
  currency?: string | null;
  date: string;
}

interface IHandleRows {
  exchange: NonNullable<Offer["exchanges"]>[number];
  price: IPrice | null;
  to: string;
  currency: string;
}
const handleRows = ({ exchange, price, to, currency }: IHandleRows) => {
  const dates = [
    exchange?.committedDate || null,
    exchange?.redeemedDate || null,
    exchange?.cancelledDate || null,
    exchange?.revokedDate || null,
    exchange?.finalizedDate || null
  ];

  return dates
    .map((date: string | null, index: number) =>
      date
        ? {
            event: EVENT_TYPES[index],
            from: "-",
            to: index === 0 ? to : "-",
            price: index === 0 ? price?.price : null,
            currency: index === 0 ? currency : null,
            date
          }
        : null
    )
    .filter((n): boolean => {
      return n !== null;
    });
};

export default function DetailTransactions({
  exchange,
  offer,
  title,
  buyerAddress
}: Props) {
  const price = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const to = `${buyerAddress.substring(0, 5)}...${buyerAddress.substring(
    buyerAddress.length - 4
  )}`;
  const currency = offer.exchangeToken.symbol;
  const allRows = handleRows({ exchange, price, to, currency });

  return (
    <div>
      <Typography tag="h3">{title || "Exchange History"}</Typography>
      <Transactions>
        <thead>
          <tr>
            {HEADER.map((name: string, index: number) => (
              <th key={`transaction_th_${index}`}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {allRows?.map((row: ITransactionHistory | null, index: number) => {
            if (row) {
              const date = dayjs(getDateTimestamp(row.date)).format(
                `YY.MM.DD, HH:mm`
              );

              return (
                <tr key={`transaction_tr_${index}`}>
                  <td>{row.event}</td>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.price ? `${row.price} ${row.currency}` : "-"}</td>
                  <td>{date}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </Transactions>
    </div>
  );
}

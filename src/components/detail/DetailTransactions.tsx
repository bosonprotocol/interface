import dayjs from "dayjs";
import { useMemo } from "react";

import { Offer } from "../../lib/types/offer";
import { IPrice } from "../../lib/utils/convertPrice";
import { getDateTimestamp } from "../../lib/utils/getDateTimestamp";
import useTransactionHistory from "../../lib/utils/hooks/useTransactionHistory";
import { useConvertedPrice } from "../price/useConvertedPrice";
import { Typography } from "../ui/Typography";
import { HEADER } from "./const";
import { Transactions } from "./Detail.style";

interface Props {
  offer: Offer;
  exchange: NonNullable<Offer["exchanges"]>[number];
  title?: string;
  buyerAddress: string;
}

interface ITransactionHistory {
  event: string;
  from: string;
  to: string;
  price?: string | null | undefined;
  currency?: string | null;
  timestamp: number;
}

interface IHandleRows {
  timesteps: {
    text: string;
    date: string;
    timestamp: number;
  }[];
  price: IPrice | null;
  to: string;
  currency: string;
}

const handleRows = ({
  timesteps,
  price,
  to,
  currency
}: IHandleRows): ITransactionHistory[] => {
  return timesteps.map((timestep, index) => ({
    event: timestep.text,
    from: "-",
    to: index === 0 ? to : "-",
    price: index === 0 ? price?.price : null,
    currency: index === 0 ? currency : null,
    timestamp: timestep.timestamp
  }));
};

export default function DetailTransactions({
  exchange,
  offer,
  title,
  buyerAddress
}: Props) {
  const { timesteps } = useTransactionHistory({
    exchangeId: exchange.id,
    tense: "present"
  });
  const price = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const to = `${buyerAddress.substring(0, 5)}...${buyerAddress.substring(
    buyerAddress.length - 4
  )}`;
  const currency = offer.exchangeToken.symbol;
  const allRows = useMemo(() => {
    return handleRows({ timesteps, price, to, currency });
  }, [timesteps, currency, price, to]);

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
          {allRows?.map((row, index) => {
            if (row) {
              const date = dayjs(
                getDateTimestamp(row.timestamp.toString())
              ).format(`YY.MM.DD, HH:mm`);

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

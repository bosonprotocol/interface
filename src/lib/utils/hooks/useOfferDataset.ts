/* eslint @typescript-eslint/no-explicit-any: "off" */
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(minMax);
import { useState } from "react";

import { colors } from "./../../styles/colors";
import { Offer } from "./../../types/offer";
import { getDateTimestamp } from "./../getDateTimestamp";

const SAME_TYPES_OPTIONS = {
  animations: {
    y: {
      duration: 2000,
      delay: 500
    }
  }
};

interface IGroupBy {
  committed: number;
  redeemed: number;
}
type GroupByTypes = keyof IGroupBy;
function groupBy(xs: Array<IGroupBy>, key: GroupByTypes): Array<number> {
  return xs
    .reduce((rv: Array<any>, x: IGroupBy) => {
      if (x[key] !== null) (rv[x[key]] = rv[x[key]] || []).push(x[key]);
      return rv;
    }, [])
    .filter((n: Array<number>) => n)
    .flat();
}

function accumulate(arr: Array<number>): Array<number> {
  return arr.reduce((r: Array<number>, i: number, k: number) => {
    const newValue = k > 0 ? i + r[k - 1] : i;
    return [...r, newValue];
  }, []);
}
function uniq(a: Array<string>) {
  return Array.from(new Set(a));
}
function formatDate(timestamp: string) {
  return dayjs(getDateTimestamp(timestamp));
}
function getOccurrence(array: Array<string>, value: string): number {
  let count = 0;
  array.forEach((v: string) => v === value && count++);
  return count;
}

function groupDates(exchanges: any) {
  // Check if diff is bigger than 1 day to determin how to group them
  const listOfDates = exchanges?.map((exchange: any) =>
    formatDate(exchange.committedDate)
  );
  if (!listOfDates.length) {
    return false;
  }

  // Determine differences between newest and oldest dates
  const min = dayjs.min(listOfDates);
  const max = dayjs.max(listOfDates);
  const diff = max.diff(min, "hours");
  const breakByDay = diff > 24;
  const format = breakByDay ? "DD/MM" : "DD/MM HH:00";
  // Group all dates by day or hour depending of the diff
  const timeline = uniq(
    listOfDates.map((date: any) =>
      dayjs(date)
        .startOf(breakByDay ? "day" : "hour")
        .format()
    )
  ).map((d: string) => dayjs(d).format(format));
  // Pass proper commits/redeems values on the timeline
  const committedDate = exchanges?.map((exchange: any) =>
    dayjs(formatDate(exchange.committedDate)).format(format)
  );
  const redeemedDate = exchanges
    ?.map((exchange: any) =>
      exchange.redeemedDate
        ? dayjs(formatDate(exchange.committedDate)).format(format)
        : null
    )
    .filter((n: any) => n);
  // Count how many commits and redeems
  const count = timeline.map((d) => ({
    committed: getOccurrence(committedDate, d),
    redeemed: getOccurrence([...committedDate, ...redeemedDate], d)
  }));

  return {
    count,
    commited: groupBy(count, "committed"),
    redeemed: groupBy(count, "redeemed"),
    listOfDates,
    min,
    max,
    diff,
    breakByDay,
    format,
    committedDate,
    redeemedDate,
    labels: timeline,
    timeline
  };
}
function determineDataset(dates: any) {
  const commitedData = accumulate(dates.commited);
  const redeemedData = accumulate(dates.redeemed);

  return {
    labels: dates.labels.length <= 1 ? ["", dates.labels] : dates.labels,
    datasets: [
      {
        data: commitedData.length <= 1 ? [0, commitedData] : commitedData,
        label: "Commited",
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        fill: "start",
        ...SAME_TYPES_OPTIONS
      },
      {
        data: redeemedData.length <= 1 ? [0, redeemedData] : redeemedData,
        label: "Redeemed",
        backgroundColor: colors.torquise,
        borderColor: colors.torquise,
        fill: "start",
        ...SAME_TYPES_OPTIONS
      }
    ]
  };
}

interface IUseOfferDataset {
  display: boolean;
  options: any;
  data: any;
}
export const useOfferDataset = (offer: Offer): IUseOfferDataset => {
  const [quantity] = useState<number>(Number(offer?.quantityInitial));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      }
    },
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      xAxes: {
        display: true
      },
      yAxes: {
        display: true,
        ticks: {
          suggestedMin: 0,
          min: 0,
          suggestedMax: Number(quantity),
          max: Number(quantity),
          step: Number(quantity / 2),
          stepSize: Number(quantity / 2),
          precision: 1,
          beginAtZero: true
        }
      }
    }
  };

  const dates = groupDates(offer?.exchanges);

  if (dates) {
    const dataset = determineDataset(dates);
    return {
      display: true,
      options,
      data: dataset
    };
  }

  return {
    display: false,
    options,
    data: null
  };
};

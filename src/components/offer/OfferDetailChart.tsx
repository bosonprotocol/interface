import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  SubTitle,
  Title,
  Tooltip
} from "chart.js";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getDateTimestamp } from "../../lib/utils/getDateTimestamp";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  Filler,
  LineElement,
  Title,
  Tooltip,
  SubTitle,
  Legend
  // ArcElement,
  // BarElement,
  // BarController,
  // BubbleController,
  // DoughnutController,
  // LineController,
  // PieController,
  // PolarAreaController,
  // RadarController,
  // ScatterController,
  // LogarithmicScale,
  // RadialLinearScale,
  // TimeScale,
  // TimeSeriesScale,
  // Decimation,
  // Filler,
);

const ChartWrapper = styled.div`
  canvas {
    max-width: 100%;
  }
`;

interface IOfferDetailChart {
  offer: Offer;
}

const setDataset = (createdAt: any, exchanges: Offer["exchanges"]) => {
  const values = exchanges?.map((exchange) => ({
    committedDate: exchange?.committedDate
      ? dayjs(getDateTimestamp(exchange?.committedDate)).format(
          CONFIG.dateFormat
        )
      : null,
    redeemedDate: exchange?.redeemedDate
      ? dayjs(getDateTimestamp(exchange?.redeemedDate)).format(
          CONFIG.dateFormat
        )
      : null
  }));

  // console.log(values);

  return [
    {
      label: "Commited",
      animations: {
        y: {
          duration: 2000,
          delay: 500
        }
      },
      data: [0, 4],
      fill: true,
      backgroundColor: colors.blue,
      borderColor: colors.blue
    },
    {
      label: "Redeemed",
      animations: {
        y: {
          duration: 500,
          delay: 500
        }
      },
      data: [0, 8],
      fill: "-1",
      backgroundColor: colors.torquise,
      borderColor: colors.torquise
    }
  ];
};
const OfferDetailChart: React.FC<IOfferDetailChart> = ({ offer }) => {
  const [createdAt] = useState(dayjs(getDateTimestamp(offer?.createdAt)));
  const [current] = useState(dayjs());
  const [month] = useState<string>(current.format("MMMM"));
  const [quantity] = useState<number>(Number(offer?.quantityInitial));
  const [labels] = useState<Array<string>>(["1", "2"]);

  // console.log(createdAt, current, month);

  const options = useMemo(
    () => ({
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
        x: {
          display: true,
          title: {
            display: true,
            text: month
          }
        },
        y: {
          display: true,
          ticks: {
            suggestedMin: 0,
            suggestedMax: Number(quantity),
            step: Number(quantity / 2),
            precision: 1,
            beginAtZero: true
          }
        }
      }
    }),
    [quantity, month]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: setDataset(createdAt, offer?.exchanges)
    }),
    [labels, createdAt, offer?.exchanges]
  );
  console.log(offer);

  return (
    <ChartWrapper>
      <Line options={options} data={data} />
    </ChartWrapper>
  );
};

export default OfferDetailChart;

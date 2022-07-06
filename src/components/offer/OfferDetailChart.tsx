import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ChartWrapper = styled.div`
  canvas {
    max-width: 100%;
  }
`;

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Month"
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Value"
      },
      ticks: {
        suggestedMin: 0,
        suggestedMax: 1000,
        step: 10,
        precision: 1,
        beginAtZero: true
      }
    }
  }
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const numbers = labels.map(
  (l, k) => k + Math.floor(Math.random() * (10 - 0 + 1) + 0)
);

export const data = {
  labels,
  datasets: [
    {
      label: "Commited",
      animations: {
        y: {
          duration: 2000,
          delay: 500
        }
      },
      data: [0, 5, 8, 18, 29, 46, 52, 57, 64, 75, 81],
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
      data: [0, 12, 21, 35, 41, 68, 78, 82, 85, 91, 105],
      fill: "-1",
      backgroundColor: colors.torquise,
      borderColor: colors.torquise
    }
  ]
};

const OfferDetailChart: React.FC = () => {
  return (
    <ChartWrapper>
      <Line options={options} data={data} />
    </ChartWrapper>
  );
};

export default OfferDetailChart;

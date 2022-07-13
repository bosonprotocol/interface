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
import { Line } from "react-chartjs-2";
import styled from "styled-components";

import { Offer } from "../../lib/types/offer";
import { useOfferDataset } from "../../lib/utils/hooks/useOfferDataset";
import Typography from "../ui/Typography";

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

const OfferDetailChart: React.FC<IOfferDetailChart> = ({ offer }) => {
  const { options, data, display } = useOfferDataset(offer);

  if (!display) {
    return null;
  }

  return (
    <div>
      <Typography tag="h3">Inventory graph</Typography>
      <ChartWrapper>
        <Line options={options} data={data} />
      </ChartWrapper>
    </div>
  );
};

export default OfferDetailChart;

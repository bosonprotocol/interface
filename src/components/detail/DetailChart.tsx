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

import { Offer } from "../../lib/types/offer";
import { useOfferDataset } from "../../lib/utils/hooks/useOfferDataset";
import Typography from "../ui/Typography";
import { ChartWrapper } from "./Detail.style";

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
);

interface Props {
  offer: Offer;
  title?: string;
}

export default function DetailChart({ offer, title }: Props) {
  const { options, data, display } = useOfferDataset(offer);

  if (!display) {
    return null;
  }

  return (
    <div>
      <Typography tag="h3">{title || "Graph"}</Typography>
      <ChartWrapper>
        <Line options={options} data={data} />
      </ChartWrapper>
    </div>
  );
}

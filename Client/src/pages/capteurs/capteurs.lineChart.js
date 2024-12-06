import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Enregistre les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CapteursLineChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.date_mesure),
    datasets: [
      {
        label: "Température",
        data: data.map((d) => d.temperature),
        borderColor: "red",
        fill: false,
      },
    ],
  };

  return (
    <div className="pt-3 pb-2 mb-3">
      <h5>Dashboard de Production</h5>
      {data && data.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>Aucune donnée à afficher.</p>
      )}
    </div>
  );
}

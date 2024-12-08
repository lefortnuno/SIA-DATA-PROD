import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data }) {
  const machines = data.map((d) => d.libelle_machine);
  const avgTemperatures = data.map((d) => parseFloat(d.avg_temperature));
  const avgPressions = data.map((d) => parseFloat(d.avg_pression));
  const avgVibrations = data.map((d) => parseFloat(d.avg_vibration));

  const thresholds = {
    temperature: 100,
    pression: 8,
    vibration: 100,
  };

  const barChartData = {
    labels: machines,
    datasets: [
      {
        label: "Température (°C)",
        data: avgTemperatures,
        backgroundColor: avgTemperatures.map((v) =>
          v < thresholds.temperature
            ? "rgba(255, 165, 0, 0.6)"
            : "rgba(255, 0, 0, 0.5)"
        ),
      },
      {
        label: "Pression (Pa)",
        data: avgPressions,
        backgroundColor: avgPressions.map((v) =>
          v < thresholds.pression
            ? "rgba(54, 162, 235, 0.7)"
            : "rgba(255, 0, 0, 0.5)"
        ),
      },
      {
        label: "Vibration (Hz)",
        data: avgVibrations,
        backgroundColor: avgVibrations.map((v) =>
          v < thresholds.vibration
            ? "rgba(0, 190, 0, 0.6)"
            : "rgba(255, 0, 0, 0.5)"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const datasetLabel = context.dataset.label;
            let dangerLabel = "";

            if (
              (datasetLabel === "Température (°C)" &&
                value >= thresholds.temperature) ||
              (datasetLabel === "Pression (Pa)" &&
                value >= thresholds.pression) ||
              (datasetLabel === "Vibration (Hz)" &&
                value >= thresholds.vibration)
            ) {
              dangerLabel = " - Anomalie !";
            }

            return `${datasetLabel}: ${value}${dangerLabel}`;
          },
        },
      },
    },
  };

  return (
    <div
      className="p-4 mb-3 mt-2"
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        height: "65vh",
        width: "70%",
      }}
    >
      <div className="text-center mb-4">
        <h5 style={{ color: "#000", fontWeight: "bold" }}>
          Analyse par Machine : Température, Pression et Vibration
        </h5>
      </div>
      {data && data.length > 0 ? (
        // <Bar data={barChartData} options={{ responsive: true }} />
        <Bar
          data={barChartData}
          options={options} 
        />
      ) : (
        <p>Aucune donnée à afficher.</p>
      )}
    </div>
  );
}

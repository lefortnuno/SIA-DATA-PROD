import axios from "../../contexts/api/axios";
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
import { Spinner } from "reactstrap";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const url_req = `machines/`;
export default function BarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const machines = data.map((d) => d.libelle_machine);
  const avgTemperatures = data.map((d) => parseFloat(d.avg_temperature));
  const avgPressions = data.map((d) => parseFloat(d.avg_pression));
  const avgVibrations = data.map((d) => parseFloat(d.avg_vibration));

  const thresholds = {
    temperature: 100,
    pression: 11,
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      getBarChart();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      glitchResetDataBase();
    }, 6000);
    return () => clearInterval(intervalId);
  }, []);

  function getBarChart() {
    axios
      .get(url_req + `barChart/`)
      .then(function (response) {
        if (
          response.status === 200 &&
          response.data.success &&
          response.data.data.length > 0
        ) {
          const allHisto = response.data.data;
          setData(allHisto);
          setLoading(false);
        } else {
          setData([]);
        }
      })
      .catch((error) => {
        setData([]);
      });
  }

  function glitchResetDataBase() {
    axios
      .get(`machines/glitch/`)
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {});
  }
  return (
    <div
      className="col-md-12 mt-2 pb-2"
      style={{
        padding: "40px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <div className="text-center mb-4">
        <h5 style={{ color: "#000", fontWeight: "bold" }}>
          Analyse par Machine : Température, Pression et Vibration
        </h5>
      </div>
      <div className="">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "250px" }}
          >
            <Spinner color="danger" />
          </div>
        ) : error ? (
          <p className="text-danger text-center">
            Aucune donnée à afficher. Veuillez réessayer.
          </p>
        ) : data.length > 1 ? (
          <Bar data={barChartData} options={options} />
        ) : (
          <p className="text-center">
            Aucune donnée disponible pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}

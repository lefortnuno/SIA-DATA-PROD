import axios from "../../contexts/api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const url_req = `productions/pieChart/`;

export default function PieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProductionData();
  }, []);

  function getProductionData() {
    axios
      .get(url_req)
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.success &&
          response.data.data.length > 0
        ) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      })
      .catch(() => {
        setData([]);
      });
  }

  // Préparer les données pour le graphique Pie
  const pieChartData = {
    labels: data.map((item) => item.produit), // Liste des produits
    datasets: [
      {
        label: "Quantités Produites",
        data: data.map((item) => item.total_quantite), // Quantités produites pour chaque produit
        backgroundColor: [
          "#FF5252",
          "#4CAF50",
          "#db3efe",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
        ],
        borderColor: [
          "#FF5252",
          "#4CAF50",
          "#db3efe",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div
      className="row"
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <div className="text-center mb-4">
        <h5 style={{ color: "#000", fontWeight: "bold" }}>
          Quantités Total Produites par Dodge
        </h5>
      </div>
      <div
        className=""
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {data && data.length > 0 ? (
          <Pie data={pieChartData} />
        ) : (
          <p>Aucune donnée à afficher.</p>
        )}
      </div>
    </div>
  );
}

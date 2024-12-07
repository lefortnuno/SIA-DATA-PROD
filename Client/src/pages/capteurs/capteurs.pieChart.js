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

export default function ProductionPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProductionData();
    // const intervalId = setInterval(() => {
    //   getProductionData();
    // }, 1000);
    // return () => clearInterval(intervalId);
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
          "#FF6384",
          "#36A2EB",
          "#db3efe",
          "#4CAF50",
          "#FF5252",
          "#FFCE56",
        ], // Couleurs dynamiques
        borderColor: ["#FF6384", "#36A2EB", "#db3efe", "#3E8E41", "#FFCE56"],
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
          Quantités Produites par Type de Produit
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

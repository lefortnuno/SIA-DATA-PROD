import axios from "../../contexts/api/axios";
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
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const url_req = `productions/lineChart/`;

export default function ProductionLineChartByMonth() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getHisto();
  }, []);

  function getHisto() {
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
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setData([]);
      });
  }

  // Générer tous les mois fixes de janvier à décembre 2024
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1; // De 1 à 12
    return `2024-${month.toString().padStart(2, "0")}`; // Format "2024-01", "2024-02", ...
  });

  const groupedData = [];
  data.forEach((item) => {
    const { produit, mois, total_quantite } = item;

    // Formater la clé mois au format "YYYY-MM"
    const formattedMonth = mois.slice(0, 7); // Garde uniquement "YYYY-MM"

    let productEntry = groupedData.find((entry) => entry.produit === produit);
    if (!productEntry) {
      productEntry = { produit, moisData: {} };
      groupedData.push(productEntry);
    }

    productEntry.moisData[formattedMonth] = total_quantite || 0;
  });

  const datasets = groupedData.map((entry, index) => {
    const { produit, moisData } = entry; 
    const dataPoints = allMonths.map((month) => {
      const cle = moisData[month]; 
      const val = moisData[month] || 0;
      return val;
    });

    return {
      label: produit,
      data: dataPoints,
      borderColor: getColor(index),
      backgroundColor: getColor(index, 0.2),
      tension: 0.4, // Rendre la courbe fluide
      borderWidth: 2,
      pointBackgroundColor: getColor(index),
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: getColor(index),
    };
  });

  const chartData = {
    labels: allMonths,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Évolution des Quantités Produites par Mois et Produit (2024)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mois",
        },
        ticks: {
          callback: function (value, index) {
            return allMonths[index]?.slice(0, 7) || "";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Quantités Produites",
        },
        beginAtZero: true,
      },
    },
  };

  function getColor(index, alpha = 1) {
    const colors = [
      "rgba(255, 99, 132, ALPHA)",
      "rgba(54, 162, 235, ALPHA)",
      "rgba(255, 206, 86, ALPHA)",
      "rgba(75, 192, 192, ALPHA)",
      "rgba(153, 102, 255, ALPHA)",
      "rgba(255, 159, 64, ALPHA)",
    ];
    return colors[index % colors.length].replace("ALPHA", alpha);
  }

  return (
    <div className="pt-1 pb-2 mb-3">
      <div className="text-center mb-4">
        <h5 style={{ color: "#000", fontWeight: "bold" }}>
          Évolution Mensuelle des Quantités Produites par Produit (2024)
        </h5>
      </div>
      {data && data.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Aucune donnée à afficher.</p>
      )}
    </div>
  );
}

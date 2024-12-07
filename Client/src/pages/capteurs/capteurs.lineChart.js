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
    
    // const intervalId = setInterval(() => {
    //   getHisto();
    // }, 1000);
    // return () => clearInterval(intervalId);
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

  // Fonction pour générer tous les mois entre deux dates
  function generateMonths(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = [];
    while (startDate <= endDate) {
      months.push(new Date(startDate).toISOString().slice(0, 7)); // Format "YYYY-MM"
      startDate.setMonth(startDate.getMonth() + 1);
    }
    return months;
  }

  // Obtenir tous les mois entre le premier et le dernier mois
  const allMonths = (() => {
    if (data.length === 0) return [];
    const sortedData = [...data].sort(
      (a, b) => new Date(a.mois) - new Date(b.mois)
    );
    const startMonth = sortedData[0].mois;
    const endMonth = sortedData[sortedData.length - 1].mois;
    const generatedMonths = generateMonths(startMonth, endMonth);

    // Ajouter des mois fictifs si moins de 3 mois
    while (generatedMonths.length < 3) {
      const lastDate = new Date(
        generatedMonths[generatedMonths.length - 1] || endMonth
      );
      lastDate.setMonth(lastDate.getMonth() + 1);
      generatedMonths.push(lastDate.toISOString().slice(0, 7));
    }

    return generatedMonths;
  })();

  // Groupement des données par produit// Vérifiez si `data` contient des valeurs
  if (!data || data.length === 0) {
    console.error("Les données `data` sont vides ou non définies :", data);
  }

  // Initialisation de groupedData
  const groupedData = {};

  // Groupement des données par produit et mois
  data.forEach((item) => {
    const { produit, mois, total_quantite } = item;

    // Vérifiez que chaque élément a les propriétés nécessaires
    if (!produit || !mois || total_quantite === undefined) {
      console.warn("Élément invalide dans les données :", item);
      return;
    }

    // Ajout des données dans groupedData
    if (!groupedData[produit]) {
      groupedData[produit] = {};
    }
    groupedData[produit][mois] = total_quantite;
  });

  // Vérifiez si groupedData est bien structuré
  console.log("Données groupées :", groupedData);

  // Création des datasets avec sécurité
  const datasets = Object.keys(groupedData).map((produit, index) => ({
    label: produit,
    data: allMonths.map((month) => groupedData[produit][month] || 0), // Ajoute 0 pour les mois manquants
    borderColor: getColor(index),
    backgroundColor: getColor(index, 0.2),
    tension: 0.4, // Rendre la courbe fluide
    borderWidth: 2,
    pointBackgroundColor: getColor(index),
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: getColor(index),
  }));

  // Vérifiez les datasets générés
  console.log("Datasets générés :", datasets);

  const chartData = {
    labels: allMonths, // Tous les mois générés
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
        text: "Évolution des Quantités Produites par Mois et Produit",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mois",
        },
        ticks: {
          callback: function (value, index, values) {
            const monthLabel = this.getLabelForValue(value);
            return monthLabel.slice(0, 7); // Afficher "YYYY-MM"
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
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];
    return `${colors[index % colors.length]}${
      alpha < 1 ? `${Math.round(alpha * 255).toString(16)}` : ""
    }`;
  }

  return (
    <div className="pt-1 pb-2 mb-3">
      <div className="text-center mb-4">
        <h5 style={{ color: "#000", fontWeight: "bold" }}>
          Évolution Mensuelle des Quantités Produites par Produit
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

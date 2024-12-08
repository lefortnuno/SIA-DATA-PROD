import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "../../contexts/api/axios";
import { Spinner } from "reactstrap";

export default function GanttChartVoiture({ prod }) {
  const [ganttData, setGanttData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (prod) fetchGanttChartData();
  }, [prod]);

  const fetchGanttChartData = () => {
    setLoading(true);
    axios
      .post("productions/ganttChartVoiture/", { produit: prod }) // Paramètre produit
      .then((response) => {
        if (response.status === 200 && response.data.success) {
          const formattedData = formatGanttData(response.data.data);
          setGanttData(formattedData);
          setError(false);
        } else {
          console.error("Erreur : Aucune donnée reçue ou problème serveur.");
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  const formatGanttData = (data) => {
    const chartData = [
      [
        { type: "string", label: "Commande ID" },
        { type: "string", label: "Étape" },
        { type: "string", label: "Ressource" },
        { type: "date", label: "Début" },
        { type: "date", label: "Fin" },
        { type: "number", label: "Durée (millisecondes)" },
        { type: "number", label: "Pourcentage terminé" },
        { type: "string", label: "Dépendances" },
      ],
    ];

    data.forEach((item) => {
      chartData.push([
        `Produit: ${prod} - Fabrication #${item.id_fabrication}`,
        item.operation,
        item.ressource_production || "Aucune ressource",
        new Date(item.debut_etape.split("T")[0]),
        new Date(item.fin_etape.split("T")[0]),
        null,
        item.progression_production || (item.statut_etape ? 100 : 0),
        item.id_etape_precedente
          ? `Fabrication #${item.id_etape_precedente}`
          : null,
      ]);
    });

    return chartData;
  };

  const options = {
    gantt: {
      criticalPathEnabled: false,
      labelStyle: { fontName: "Arial", fontSize: 14, color: "#333" },
    },
  };

  return (
    <div
      className="mt-2"
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <div className="text-center mb-4">
        <h5 style={{ color: "#000", fontWeight: "bold" }}>
          Diagramme de Gantt - Étapes pour le produit : {prod}
        </h5>
      </div>
      <div>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <Spinner color="danger" />
          </div>
        ) : error ? (
          <p className="text-danger text-center">
            Aucune donnée à afficher. Veuillez réessayer.
          </p>
        ) : ganttData.length > 1 ? (
          <Chart
            chartType="Gantt"
            width="100%"
            height="300px"
            data={ganttData}
            options={options}
          />
        ) : (
          <p className="text-center">
            Aucune donnée disponible pour le produit : {prod}.
          </p>
        )}
      </div>
    </div>
  );
}

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

// Enregistrer les composants nécessaires pour le Pie Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function CapteursPieChart({ data }) {
  console.log("Données reçues pour le Pie Chart:", data);

  // Exemples : Nombre d'occurrences par état
  const etatData = {
    labels: ["Disponible", "En panne"],
    datasets: [
      {
        label: "État des Machines",
        data: [
          data.filter((d) => !d.etat).length, // Machines disponibles
          data.filter((d) => d.etat).length, // Machines en panne
        ],
        backgroundColor: ["#4CAF50", "#FF5252"],
        borderColor: ["#3E8E41", "#E57373"],
        borderWidth: 1,
      },
    ],
  };

  const TEMPERATURE_CRITIQUE = 80;

  const pieChartData = {
    labels: ["Température Normale", "Température Critique"],
    datasets: [
      {
        label: "Répartition des Températures",
        data: [
          data.filter((d) => d.temperature <= TEMPERATURE_CRITIQUE).length,
          data.filter((d) => d.temperature > TEMPERATURE_CRITIQUE).length,
        ],
        backgroundColor: ["#4CAF50", "#FF5252"], // Vert pour normal, rouge pour critique
        borderColor: ["#3E8E41", "#E57373"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="pt-3 pb-2 mb-3" >
      {/* <h5>Répartition des Machines</h5>
      {data && data.length > 0 ? (
        <Pie data={etatData} />
      ) : (
        <p>Aucune donnée à afficher.</p>
      )} */}

      <div className="pt-3 pb-2 mb-3">
        <h6>Marque de Dodge le plus vendu</h6>
        {data && data.length > 0 ? (
          <Pie data={pieChartData} />
        ) : (
          <p>Aucune donnée à afficher.</p>
        )}
      </div>
    </div>
  );
}

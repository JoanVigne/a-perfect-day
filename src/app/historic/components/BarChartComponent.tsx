import React from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  Chart,
  BarController,
  BarElement,
} from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarController, BarElement);

interface Activity {
  id: string;
  name: string;
  description: string;
  details: string;
  unit: string | boolean;
  count: string | number;
}

interface HistoricData {
  [shortDate: string]: {
    date: string;
    [activityId: string]: Activity | string;
  };
}

interface Props {
  data: HistoricData;
}

const BarChartComponent: React.FC<Props> = ({ data }) => {
  // Créer un objet contenant les nombres de squats pour chaque date
  const squatData: { [date: string]: number } = {};

  // Récupérer les dates et les nombres de squats
  Object.values(data).forEach((historicDay) => {
    const squatActivity = Object.values(historicDay).find(
      (activity) => activity && activity.name === "squat"
    ) as Activity | undefined;

    if (squatActivity) {
      // Extraire uniquement la partie de la date sans l'année ni l'heure
      const formattedDate = historicDay.date.split("T")[0];
      squatData[formattedDate] = parseInt(squatActivity.count as string);
    } else {
      // Affecter 0 si aucun squat pour la date
      const formattedDate = historicDay.date.split("T")[0];
      squatData[formattedDate] = 0;
    }
  });

  // Créer les labels et les données pour le graphique en barres
  const labels = Object.keys(squatData);
  const counts = Object.values(squatData);

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "Nombre de squats",
        data: counts,
        backgroundColor: "#FF6384",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Nombre de squats par jour</h2>
      <Bar data={barData} />
    </div>
  );
};

export default BarChartComponent;

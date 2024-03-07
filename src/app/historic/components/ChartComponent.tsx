import React from "react";
import { Doughnut } from "react-chartjs-2";

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

const ChartComponent: React.FC<Props> = ({ data }) => {
  const activityCounts: { [key: string]: number } = {};

  // Compter le nombre total d'activités pour chaque type
  Object.values(data).forEach((historicDay) => {
    Object.values(historicDay).forEach((activity) => {
      if (
        activity &&
        typeof activity !== "string" &&
        activity.count &&
        activity.unit
      ) {
        const key = `${activity.name} (${activity.unit})`;
        if (activityCounts[key]) {
          activityCounts[key] += parseInt(activity.count as string);
        } else {
          activityCounts[key] = parseInt(activity.count as string);
        }
      }
    });
  });

  // Créer les labels et les données pour le graphique en anneau
  const labels = Object.keys(activityCounts);
  const counts = Object.values(activityCounts);

  const doughnutData = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8A2BE2",
          "#00FF00",
          "#0000FF",
          "#FF00FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8A2BE2",
          "#00FF00",
          "#0000FF",
          "#FF00FF",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Activités par durée</h2>
      <Doughnut data={doughnutData} />
    </div>
  );
};

export default ChartComponent;

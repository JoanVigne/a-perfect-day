import React from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  Chart,
  BarController,
  BarElement,
} from "chart.js";
import { formatDate } from "@/app/utils/date";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarController, BarElement);

interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  unit: string | boolean;
  count: string | number;
}

interface Props {
  data: { date: string; [activityId: string]: Task | string }[];
  task: string;
}

const BarChart: React.FC<Props> = ({ data, task }) => {
  const taskData: { [date: string]: number } = {};

  let unit: string | undefined;
  Object.values(data).forEach((day) => {
    const thisTask = Object.values(day).find(
      (t: Task | any) => t && t.name === task
    ) as Task | undefined;
    if (thisTask) {
      const formattedDate = formatDate(day.date);
      taskData[formattedDate] = parseInt(thisTask.count as string);
      unit = thisTask.unit as string; //
    } else {
      const formattedDate = formatDate(day.date);
      taskData[formattedDate] = 0;
    }
  });
  const labels = Object.keys(taskData);
  const counts = Object.values(taskData);

  const barData = {
    labels: labels,
    datasets: [
      {
        label: task,
        data: counts,
        backgroundColor: "#FF6384",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: unit, // Titre de l'axe des ordonnées
        },
      },
    },
  };

  return (
    <div>
      <h2>About {task}</h2>
      <Bar data={barData} options={options} />
    </div>
  );
};

export default BarChart;

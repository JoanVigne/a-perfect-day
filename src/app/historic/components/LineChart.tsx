import React from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  Chart,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";
import { formatDate } from "@/utils/date";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(LineController, LineElement, PointElement);

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

const LineChart: React.FC<Props> = ({ data, task }) => {
  const taskData: { [date: string]: number } = {};

  let unit: string | undefined;
  Object.values(data).forEach((day) => {
    const thisTask = Object.values(day).find(
      (t: Task | any) => t && t.name === task
    ) as Task | undefined;
    if (thisTask) {
      const formattedDate = formatDate(day.date);
      taskData[formattedDate] = parseInt(thisTask.count as string);
      unit = thisTask.unit as string;
    } else {
      const formattedDate = formatDate(day.date);
      taskData[formattedDate] = 0;
    }
  });
  const labels = Object.keys(taskData);
  const counts = Object.values(taskData);

  const lineData = {
    labels: labels,
    datasets: [
      {
        label: task,
        data: counts,
        fill: false,
        borderColor: "rgb(3, 143, 3)",
        tension: 0.1,
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
      <h3>{task}</h3>
      <Line data={lineData} options={options} />
    </div>
  );
};

export default LineChart;

// LineChart0to100.tsx
import React, { useEffect, useState } from "react";
import { Line, getDatasetAtEvent } from "react-chartjs-2";
import {
  Chart,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

interface Props {
  perf: Record<string, any>;
  selectedImprovement: string;
  color: number;
}

const colors = [
  {
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgb(255, 99, 132)",
  },
  {
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgb(54, 162, 235)",
  },
  {
    backgroundColor: "rgba(1, 107, 1, 1)",
    borderColor: "rgba(1, 107, 1, 1)",
  },
  {
    backgroundColor: "rgba(255, 205, 86, 0.2)",
    borderColor: "rgb(255, 205, 86)",
  },
  {
    backgroundColor: "rgba(75, 192, 192, 0.2)",
    borderColor: "rgb(75, 192, 192)",
  },
  {
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    borderColor: "rgb(153, 102, 255)",
  },
];
const LineChart0to100: React.FC<Props> = ({
  perf,
  selectedImprovement,
  color,
}) => {
  const [data, setData] = useState<any>({ datasets: [] });
  const [renderKey, setRenderKey] = useState(0);
  const [days, setDays] = useState(90);

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDays(value === "all" ? Object.keys(perf).length : Number(value));
  };
  const generateDatasets = (improvement: string, dates: string[]) => {
    return [
      {
        label: improvement,
        data: dates.map((date) => {
          const value = perf[date]?.[improvement];
          if (typeof value === "string") {
            const valueCheck = value.replace(",", ".");
            return !isNaN(Number(valueCheck)) ? valueCheck : value;
          } else {
            return value;
          }
        }),
        fill: false,
        hidden: false,
        spanGaps: true,
        // Use the first color for the line
        backgroundColor: colors[color].backgroundColor,
        borderColor: colors[color].borderColor,
      },
    ];
  };
  useEffect(() => {
    if (perf && selectedImprovement) {
      const lastNDays = [...Array(days)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const month = (d.getMonth() + 1).toString().padStart(2, "0"); // zero-pad months
          const day = d.getDate().toString().padStart(2, "0");
          return `${d.getFullYear()}-${month}-${day}`;
        })
        .reverse();
      const labels = lastNDays.map((date) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}-${d.getDate()}`;
      });
      const datasets = generateDatasets(selectedImprovement, lastNDays);
      setData({ labels, datasets });
    }
  }, [days]);

  return (
    <>
      {perf && Object.keys(perf).length > 0 && (
        <div className="line-chart-and-options">
          <div className="title-select">
            <h3>Unit : {selectedImprovement}</h3>
            <select name="" id="" onChange={handleSelectChange} value={days}>
              <option value="7">Last week</option>
              <option value="30">Last month</option>
              <option value="90">Last 3 months</option>
              <option value="all">All</option>
            </select>
          </div>
          <Line data={data} options={options} key={renderKey} />
        </div>
      )}
    </>
  );
};

export default LineChart0to100;

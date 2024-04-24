import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

type DatasetType = {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  hidden?: boolean;
};
const last30Days = [...Array(30)]
  .map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.getDate();
  })
  .reverse();

interface Chall {
  selectedImprovement: string[];
  details: string;
  id: string;
  name: string;
  kg: string;
  reps: string;
  perf: Record<string, any>;
}

interface Props {
  thisChall: Chall;
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
const LineChart: React.FC<Props> = ({ thisChall }) => {
  const [data, setData] = useState<any>({ datasets: [] });
  const [renderKey, setRenderKey] = useState(0);
  const [days, setDays] = useState(90);
  const [unit, setUnit] = useState("");
  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDays(
      value === "all" ? Object.keys(thisChall.perf).length : Number(value)
    );
  };
  const generateDatasets = (improvements: string[], dates: string[]) => {
    if (!improvements || !dates || !thisChall.perf) {
      return [];
    }
    return improvements.map((improvement, index) => ({
      label: improvement,
      data: dates.map((date) => {
        const value = thisChall.perf[date]?.[improvement];
        if (typeof value === "string") {
          const valueCheck = value.replace(",", ".");
          return !isNaN(Number(valueCheck)) ? Number(valueCheck) : value;
        }
        return value;
      }),
      fill: false,
      hidden: false,
      spanGaps: true,
      // Use the colors array to set the colors for each line
      backgroundColor: colors[index % colors.length].backgroundColor,
      borderColor: colors[index % colors.length].borderColor,
    }));
  };
  useEffect(() => {
    if (thisChall.perf && thisChall.selectedImprovement) {
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
      const datasets = generateDatasets(
        thisChall.selectedImprovement,
        lastNDays
      );

      setData({ labels, datasets });
    }
  }, [thisChall, days]);

  const toggleDataset = (index: number) => {
    setData((currentData: any) => ({
      ...currentData,
      datasets: currentData.datasets.map(
        (dataset: any, datasetIndex: number) => {
          if (datasetIndex === index) {
            return { ...dataset, hidden: !dataset.hidden };
          }
          return dataset;
        }
      ),
    }));
  };
  return (
    <>
      {thisChall.perf && Object.keys(thisChall.perf).length > 0 && (
        <div className="line-chart-and-options">
          <h3>All your selected improvements in a chart : </h3>
          <select name="" id="" onChange={handleSelectChange} value={days}>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
            <option value="90">Last 3 months</option>
            <option value="all">All</option>
          </select>
          <Line data={data} options={options} key={renderKey} />

          <div className="container-show-hide-lines">
            {data.datasets.map((dataset: any, index: number) => (
              <button key={index} onClick={() => toggleDataset(index)}>
                {dataset.hidden ? "Show " : "Hide "} {dataset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default LineChart;

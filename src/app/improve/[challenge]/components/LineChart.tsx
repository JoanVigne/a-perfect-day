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

const initialData = {
  labels: last30Days,
  datasets: [
    {
      label: "Dataset 1",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      label: "Dataset 2",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "rgb(54, 162, 235)",
      borderColor: "rgba(54, 162, 235, 0.2)",
    },
  ] as DatasetType[],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

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
const LineChart: React.FC<Props> = ({ thisChall }) => {
  const [data, setData] = useState<any>({ datasets: [] });
  const [renderKey, setRenderKey] = useState(0);
  const [days, setDays] = useState(30); // new state variable for the number of days

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDays(
      value === "all" ? Object.keys(thisChall.perf).length : Number(value)
    );
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
      const datasets = thisChall.selectedImprovement.map((improvement) => ({
        label: improvement,
        data: lastNDays.map(
          (date) => thisChall.perf[date]?.[improvement] || null
        ),
        fill: false,
        hidden: false,
        spanGaps: true,
      }));

      setData({ labels, datasets });
    }
  }, [thisChall, days]); // add days as a dependency

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
      <div className=""></div>
      {thisChall.perf && Object.keys(thisChall.perf).length > 0 && (
        <>
          <select name="" id="" onChange={handleSelectChange}>
            <option value="all">All</option>
            <option value="90">The last 3 months</option>
            <option value="30">The last month</option>
            <option value="7">The last week</option>
          </select>
          <Line data={data} options={options} key={renderKey} />
          {data.datasets.map((dataset: any, index: number) => (
            <button key={index} onClick={() => toggleDataset(index)}>
              {dataset.hidden ? "Show " : "Hide "} {dataset.label}
            </button>
          ))}
        </>
      )}
    </>
  );
};
export default LineChart;

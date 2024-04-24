import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

interface DatasetType {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  hidden?: boolean;
}

interface ChartLineProps {
  data: any;
  task: any;
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  formatDate: (date: Date) => string;
  generateDatasets: (improvements: string[], dates: string[]) => DatasetType[];
  toggleDataset: (index: number) => void;
  tileClassName: ({ date }: { date: Date }) => string;
  days: string;
}

const ChartLine: React.FC<ChartLineProps> = ({
  data,
  task,
  onSelectChange,
  formatDate,
  generateDatasets,
  toggleDataset,
  tileClassName,
  days,
}) => {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  useEffect(() => {
    if (data && task) {
      const maxDays = days === "all" ? Object.keys(data).length : Number(days);
      const lastNDays = [...Array(maxDays)]
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
      const datasets = generateDatasets(task, lastNDays);

      setChartData({ labels, datasets });
    }
  }, [data, task, days, generateDatasets]);
  return (
    <div>
      <h3>{task}</h3>
      <select name="" id="" onChange={onSelectChange} value={days}>
        <option value="7">Last week</option>
        <option value="30">Last month</option>
        <option value="90">Last 3 months</option>
        <option value="365">Last year</option>
      </select>
      <Line data={chartData} options={options} />
      <div className="container-show-hide-lines">
        {chartData.datasets.map((dataset: any, index: number) => (
          <button key={index} onClick={() => toggleDataset(index)}>
            {dataset.hidden ? "Show " : "Hide "} {dataset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartLine;

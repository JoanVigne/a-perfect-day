import React, { useEffect, useState } from "react";
import LineChart from "../../../components/ui/LineChart";
import LineChart0to100 from "../../../components/ui/LineChart0to100";
import LineChart0to60 from "../../../components/ui/LineChart0to60";
import ChartLine from "@/components/ui/ChartLine";

interface Perf {
  [key: string]: any;
}
interface Chall {
  selectedImprovement: string[];
  details: string;
  id: string;
  name: string;
  kg: string;
  reps: string;
  perf: Record<string, Perf>;
}
interface Props {
  thisChall: Chall;
}

const ShowPerfs: React.FC<Props> = ({ thisChall }) => {
  const [latestPerformance, setLatestPerformance] = useState<Perf | null>(null);

  const [data, setData] = useState<any>({ datasets: [] });
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
  useEffect(() => {
    if (thisChall.perf) {
      const performances = Object.values(thisChall.perf);
      setLatestPerformance(getLatestPerformance(performances));
    }
  }, [thisChall]);

  function getLatestPerformance(perfs: Perf[]) {
    return perfs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }
  // functions for ChartLine :
  const [days, setDays] = useState("90");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDays(value === "all" ? "365" : value);
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
      backgroundColor: colors[index % colors.length].backgroundColor,
      borderColor: colors[index % colors.length].borderColor,
    }));
  };

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
    <div>
      {thisChall.selectedImprovement &&
      thisChall.perf &&
      Object.keys(thisChall.perf).length > 0 ? (
        <ul>
          <h3>Your last performances :</h3>
          <span>
            {thisChall.selectedImprovement.map((improvement, index) => {
              return (
                <div key={index}>
                  <h4></h4>

                  {latestPerformance && latestPerformance[improvement] !== ""
                    ? `${latestPerformance[improvement]} ${improvement}`
                    : `no data last time about ${improvement}`}
                </div>
              );
            })}
          </span>
        </ul>
      ) : (
        <p>Here will be your performances in charts.</p>
      )}
      <ul>
        <ChartLine
          data={thisChall.perf}
          task={thisChall.selectedImprovement}
          onSelectChange={handleSelectChange}
          formatDate={(date) => `${date.getMonth() + 1}-${date.getDate()}`}
          generateDatasets={generateDatasets}
          toggleDataset={toggleDataset}
          tileClassName={() => ""}
          days={days}
        />
        <LineChart thisChall={thisChall} />
        {thisChall &&
          thisChall.perf &&
          thisChall.selectedImprovement.map((improvement, index) => {
            const timeUnits = [
              "mn",
              "m",
              "min",
              "minutes",
              "minute",
              "s",
              "sec",
              "secondes",
              "seconde",
              "h",
              "heures",
              "heure",
              "hour",
              "hours",
            ];
            if (timeUnits.includes(improvement)) {
              return (
                <li key={improvement}>
                  <LineChart0to60
                    perf={thisChall.perf}
                    selectedImprovement={improvement}
                    color={index}
                  />
                </li>
              );
            } else {
              return (
                <li key={improvement}>
                  <LineChart0to100
                    perf={thisChall.perf}
                    selectedImprovement={improvement}
                    color={index}
                  />
                </li>
              );
            }
          })}

        {thisChall.perf &&
          Object.entries(thisChall.perf)
            .sort(
              ([dateA], [dateB]) =>
                new Date(dateB).getTime() - new Date(dateA).getTime()
            )
            .map(([date, performance]) => (
              <li key={date}>
                <span>{date} :</span>
                {Object.entries(performance).map(([key, value]) => {
                  if (key !== "date") {
                    return (
                      <span key={key}>
                        {value}
                        {key}
                        {" / "}
                      </span>
                    );
                  } else {
                    return null;
                  }
                })}
              </li>
            ))}
      </ul>
    </div>
  );
};

export default ShowPerfs;

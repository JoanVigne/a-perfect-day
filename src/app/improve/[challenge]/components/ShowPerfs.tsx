import React, { useEffect, useState } from "react";
import "./lineChart.css";
import LineChart from "./LineChart";
import LineChart0to100 from "./LineChart0to100";
import LineChart0to60 from "./LineChart0to60";

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

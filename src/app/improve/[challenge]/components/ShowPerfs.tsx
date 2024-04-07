import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";

interface Perf {
  reps: string;
  kg: string;
  date: string;
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

  function renderImprovement(improvement: string, index: number) {
    return (
      <li key={index}>
        {Object.entries(thisChall).map(([key, value]) => {
          if (key === improvement) {
            return (
              <div key={key}>
                {latestPerformance?.[improvement as keyof Perf]}
                {key}
              </div>
            );
          }
          return null;
        })}
      </li>
    );
  }
  return (
    <div>
      {thisChall.selectedImprovement &&
      thisChall.perf &&
      Object.keys(thisChall.perf).length > 0 ? (
        <ul>
          <h3>Last time, you did </h3>
          <span>{thisChall.selectedImprovement.map(renderImprovement)}</span>
        </ul>
      ) : (
        <p>
          Here will be your performances in a chart when you are gonna add them.
        </p>
      )}
      <ul>
        <LineChart thisChall={thisChall} />

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

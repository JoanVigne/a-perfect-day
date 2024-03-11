import React, { useEffect, useState } from "react";
import { findTask } from "../utils/utils";

const HighestScore = ({ data, taskName }: { data: any; taskName: string }) => {
  const [highest, setHighest] = useState<number | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [highestDate, setHighestDate] = useState<string | null>(null);
  const [imgOrText, setImgOrText] = useState(false);

  useEffect(() => {
    findHighestScore(taskName);
  }, [data]);

  function findHighestScore(taskName: string) {
    const idOfTask = findTask(data, taskName);
    if (!idOfTask) {
      console.log(idOfTask);
      return;
    }

    let highestCount = 0;
    let unitValue = null;
    let highestScoreDate = null;
    data.forEach((day: any) => {
      if (day.hasOwnProperty(idOfTask)) {
        const thisDayCount = Number(day[idOfTask].count);
        if (thisDayCount > highestCount) {
          highestCount = thisDayCount;
          unitValue = day[idOfTask].unit;
          highestScoreDate = day.date.split("T")[0].substring(2);
        }
      }
    });
    setUnit(unitValue);
    setHighest(highestCount);
    setHighestDate(highestScoreDate);
  }

  return (
    <h4
      className="img-explication-score"
      onClick={() => {
        setImgOrText(!imgOrText);
      }}
    >
      {imgOrText ? (
        "Best ever "
      ) : (
        <img
          className="icon-bigger"
          src="./number-one.png"
          alt="best performance"
        />
      )}
      <div className="score">
        <div className="number">{highest}</div>
        <div>{unit}</div>
        <div className="img-explication">
          <img className="icon" src="./location.png" alt="when" />
          <span>{highestDate}</span>
        </div>
      </div>
    </h4>
  );
};

export default HighestScore;

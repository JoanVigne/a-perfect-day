import React, { useEffect, useState } from "react";
import { findTask } from "../../../app/historic/utils/utils";
import Icon from "@/components/ui/Icon";

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
          highestScoreDate = day.date.split("T")[0].substring(5);
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
        <Icon nameImg="number-one" onClick={() => {}} />
      )}
      <div className="score">
        <div className="number">{highest}</div>
        <div>{unit}</div>
        <div className="img-explication">
          <Icon nameImg="location" onClick={() => {}} />

          <span>{highestDate}</span>
        </div>
      </div>
    </h4>
  );
};

export default HighestScore;

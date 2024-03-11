import React, { useEffect, useState } from "react";
import { findTask } from "../utils/utils";

const Streak = ({ data, taskName }: { data: any; taskName: string }) => {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    if (data) {
      countConsecutiveDays(data, taskName);
    }
  }, [data]);

  function countConsecutiveDays(data: any, taskName: string) {
    const idOfTask = findTask(data, taskName);
    if (!idOfTask) {
      console.log("Task not found");
      return;
    }
    let consecutiveDays = 0;
    let highestScore = 0;
    data.forEach((day: any) => {
      if (day.hasOwnProperty(idOfTask)) {
        consecutiveDays++;
      } else {
        if (consecutiveDays > highestScore) {
          highestScore = consecutiveDays;
        }
        consecutiveDays = 0;
      }
    });
    if (consecutiveDays > highestScore) {
      highestScore = consecutiveDays;
    }
    console.log("highest score : ", highestScore);
    setStreak(highestScore);
    return highestScore;
  }

  return <span>{streak}</span>;
};

export default Streak;

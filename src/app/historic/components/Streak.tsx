import React, { useEffect, useState } from "react";
import { findTask } from "../utils/utils";
import Icon from "@/components/Icon";

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
    setStreak(highestScore);
    return highestScore;
  }
  const [imgOrText, setImgOrText] = useState(false);

  return (
    <h4
      className="img-explication"
      onClick={() => {
        setImgOrText(!imgOrText);
      }}
    >
      {" "}
      {imgOrText ? (
        "Streak: "
      ) : (
        <>
          <Icon
            nameImg="fire"
            onClick={() => {
              setImgOrText(!imgOrText);
            }}
          />
        </>
      )}
      <span className="number">{streak}x</span>
    </h4>
  );
};

export default Streak;

import React, { useEffect, useState } from "react";
import { findTask } from "../utils/utils";

const Count = ({ data, taskName }: { data: any; taskName: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (data) {
      countHowManyTimes(data, taskName);
    }
  });
  function countHowManyTimes(data: any, taskName: string) {
    const idOfTask = findTask(data, taskName);
    if (!idOfTask) {
      console.log("Task not found");
      return;
    }
    let times = 0;
    data.forEach((day: any) => {
      if (day.hasOwnProperty(idOfTask)) {
        times++;
      }
    });
    console.log("count : ", times);
    setCount(times);
    return times;
  }
  return <span>{count}</span>;
};

export default Count;

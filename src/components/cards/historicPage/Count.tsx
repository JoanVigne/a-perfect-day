import React, { useEffect, useState } from "react";
import { findTask } from "../../../app/historic/utils/utils";
import Icon from "@/components/ui/Icon";

const Count = ({ data, taskName }: { data: any; taskName: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (data) {
      countHowManyTimes(data, taskName);
    }
  }, [data]);
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
    setCount(times);
    return times;
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
      {imgOrText ? "Total: " : <Icon nameImg="infinit" onClick={() => {}} />}
      <span className="number">{count}x</span>
    </h4>
  );
};

export default Count;

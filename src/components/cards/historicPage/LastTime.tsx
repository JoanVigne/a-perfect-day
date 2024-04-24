import React, { useEffect, useState } from "react";
import { findTask } from "../../../app/historic/utils/utils";
import Icon from "@/components/ui/Icon";

const LastTime = ({ data, taskName }: { data: any; taskName: string }) => {
  const [lasttime, setLastTime] = useState<string | null>(null);

  useEffect(() => {
    findLastTimePerformed(taskName);
  }, [data]);
  function findLastTimePerformed(taskName: string) {
    const idTask = findTask(data, taskName);
    if (!idTask) {
      console.log(idTask);
      return;
    }

    let lastTimePerformed: string | null = null;

    // Parcourir les jours historiques, en partant du plus récent
    for (let i = data.length - 1; i >= 0; i--) {
      const historicDay = data[i];
      // Vérifier si la tâche est présente dans ce jour historique
      if (historicDay.hasOwnProperty(idTask)) {
        const dateSplit = historicDay.date.split("T")[0];
        if (isYesterday(dateSplit)) {
          lastTimePerformed = "yesterday";
        } else {
          lastTimePerformed = dateSplit.substring(5);
        }
        break; // Sortir de la boucle une fois que la dernière date est trouvée
      }
    }

    setLastTime(lastTimePerformed);
    return lastTimePerformed;
  }
  function isYesterday(date: string): boolean {
    const yesterday = new Date(new Date().getTime() - 86400000); // 86400000 ms dans un jour
    const formattedYesterday = yesterday.toISOString().split("T")[0];
    return date === formattedYesterday;
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
        "Last time: "
      ) : (
        <>
          <Icon
            nameImg="last24-green"
            onClick={() => {
              setImgOrText(!imgOrText);
            }}
          />
        </>
      )}
      <span className="date"> {lasttime}</span>
    </h4>
  );
};

export default LastTime;

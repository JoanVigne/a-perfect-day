import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./cardWorkout.css";
import Icon from "../ui/Icon";

interface Props {
  workout: WorkoutType;
  index: number;
}
interface WorkoutType {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
  perf: Array<any> | null;
}

const CardWorkout: React.FC<Props> = ({ workout, index }) => {
  const [lastTime, setLastTime] = useState<string | null>(null);
  const colorClass = `color-${index % 2}`;
  useEffect(() => {
    if (workout.perf) {
      const dates = Object.keys(workout.perf);
      const lastDate = dates.sort()[dates.length - 1];
      if (lastDate) {
        setLastTime(lastDate);
      }
    }
  }, []);
  return (
    <div className={`workout-container ${colorClass}`}>
      <div className="infos">
        <h3
          onClick={() => {
            window.location.href = `/workout/${workout.id}/stats`;
          }}
        >
          {workout.name}{" "}
          <Icon
            nameImg="question"
            onClick={() => {
              window.location.href = `/workout/${workout.id}/stats`;
            }}
          />
        </h3>
        <p>{workout.description}</p>
      </div>
      <div className="perf">
        <Link href={`/workout/${workout.id}`}>Train now</Link>

        <h4>{workout.perf ? <>Last time : {lastTime}</> : <>no data yet</>}</h4>
      </div>
    </div>
  );
};

export default CardWorkout;

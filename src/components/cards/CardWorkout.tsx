import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  workout: WorkoutType;
}
interface WorkoutType {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
  perf: Array<any> | null;
}

const CardWorkout: React.FC<Props> = ({ workout }) => {
  const [lastTime, setLastTime] = useState<string | null>(null);
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
    <div className="workout-container">
      <div className="infos">
        <h3>{workout.name}</h3>
        <p>{workout.description}</p>
      </div>
      <div className="perf">
        <h4>{workout.perf ? <>Last time : {lastTime}</> : <>no data yet</>}</h4>
        <Link href={`/workout/${workout.id}`}>Train now</Link>
        <Link href={`/workout/${workout.id}/stats`}>See more</Link>
      </div>
    </div>
  );
};

export default CardWorkout;

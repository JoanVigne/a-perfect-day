import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./cardWorkout.css";
import Icon from "../ui/Icon";

import Image from "next/image";

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
        const formattedDate = new Date(lastDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        setLastTime(formattedDate);
      }
    }
  }, []);
  return (
    <div className={`workout-container ${colorClass}`}>
      <div className="infos">
        <div>
          <Icon
            nameImg="exclamation"
            onClick={() => {
              window.location.href = `/workout/${workout.id}/stats`;
            }}
          />
          <h3
            onClick={() => {
              window.location.href = `/workout/${workout.id}/stats`;
            }}
          >
            {workout.name}
          </h3>
        </div>
        <p>{workout.description}</p>
      </div>
      <div className="perf">
        {/*         <Link href={`/workout/${workout.id}`}>Train now</Link> */}
        <Link href={`/workout/${workout.id}`}>
          <Image
            src="/icon/dumbell4.png"
            alt="Dumbell Icon"
            width={50}
            height={50}
          />
        </Link>

        <h4>{workout.perf ? <>Last: {lastTime}</> : <>no data yet</>}</h4>
      </div>
    </div>
  );
};

export default CardWorkout;

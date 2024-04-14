import Link from "next/link";
import React from "react";

interface Props {
  workout: WorkoutType;
}
interface WorkoutType {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
}

const Workout: React.FC<Props> = ({ workout }) => {
  return (
    <div className="workout-container">
      <div className="infos">
        <h3>{workout.name}</h3>
        <p>{workout.description}</p>
      </div>
      <div className="perf">
        <h4>Last time : date</h4>
        <Link href={`/workout/${workout.id}`}>Train now</Link>
      </div>
    </div>
  );
};

export default Workout;

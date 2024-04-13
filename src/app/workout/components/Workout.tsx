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
  return <>{workout.name}</>;
};

export default Workout;

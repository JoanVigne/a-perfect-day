"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FormWorkoutCreate from "../../components/forms/FormWorkoutCreate";
import "./workout.css";
import { useEffect, useState } from "react";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import CardWorkout from "../../components/cards/CardWorkout";

interface WorkoutType {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
  perf: Array<any> | null;
}
interface Workouts {
  [key: string]: WorkoutType;
}
export default function Page() {
  const [workouts, setWorkouts] = useState<Workouts>({});
  useEffect(() => {
    const localstorage = getItemFromLocalStorage("workouts");
    if (!localstorage) {
      let dbworkouts = fetchDataFromDBToLocalStorage("workouts");
      setWorkouts(dbworkouts as unknown as Workouts);
    }
    if (localstorage) {
      setWorkouts(localstorage);
    }
    console.log("workouts", workouts);
  }, []);
  return (
    <>
      <Header />
      <h1>Workout</h1>
      <div className="container">
        {workouts && Object.values(workouts as Workouts).length > 0 ? (
          <>
            {console.log("workouts", workouts)}
            {Object.values(workouts).map((workout: WorkoutType) => (
              <div key={workout.id}>
                <CardWorkout workout={workout as WorkoutType} />
              </div>
            ))}
          </>
        ) : (
          <p>No workout</p>
        )}
      </div>
      <FormWorkoutCreate />
      <Footer />
    </>
  );
}

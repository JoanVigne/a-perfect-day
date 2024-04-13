"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FormWorkout from "./components/FormWorkout";
import "./workout.css";
import { useEffect, useState } from "react";
import { get } from "http";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import { set } from "firebase/database";
import { uid } from "chart.js/helpers";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import Workout from "./components/Workout";

interface WorkoutType {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
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
                <Workout workout={workout as WorkoutType} />
              </div>
            ))}
          </>
        ) : (
          <p>No workout</p>
        )}
      </div>
      <FormWorkout />
      <Footer />
    </>
  );
}

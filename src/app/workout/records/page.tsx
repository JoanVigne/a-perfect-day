"use client";
import Header from "@/components/Header";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import "./recordPage.css";
import IconOpen from "@/components/ui/IconOpen";
import { Libre_Caslon_Display } from "next/font/google";
interface UserData {
  email: string;
  uid: string;
}
interface Exercice {
  name: string;
  exoOrder: number;
}

interface PerfData {
  [key: string]: string | number;
}

interface WorkoutType {
  exercices: Record<string, Exercice>;
  perf?: Record<string, Record<string, PerfData>>;
}

interface BestPerf {
  [exerciseName: string]: {
    name: string;
    maxWeight: { date: string; weight: number; reps: number };
    maxReps: { date: string; weight: number; reps: number };
  };
}

interface Workouts {
  [key: string]: WorkoutType;
}
export default function Page() {
  const { user } = useAuthContext() as { user: UserData };
  const [workouts, setWorkouts] = useState<Workouts>({});
  const [bestPerf, setBestPerf] = useState<BestPerf>({});
  const [showRecord, setShowRecord] = useState<{
    [exerciseId: string]: boolean;
  }>({});
  useEffect(() => {
    const fetchWorkouts = async () => {
      const localstorage = getItemFromLocalStorage("workouts");
      if (!localstorage) {
        let dbworkouts = await fetchOnlyThisIdToLocalStorage(
          "workouts",
          user.uid
        );
        setWorkouts(dbworkouts as unknown as Workouts);
      } else {
        setWorkouts(localstorage);
      }
    };

    fetchWorkouts();
  }, [user.uid]);

  useEffect(() => {
    for (let workoutKey in workouts) {
      const workout = workouts[workoutKey];
      if (workout) {
        getBestPerf(workout);
      }
    }
  }, [workouts]);

  const getBestPerf = (workout: WorkoutType): void => {
    if (!workout.perf || !Object.entries(workout.perf).length) return;
    const bestPerf: BestPerf = {};

    Object.entries(workout.perf).forEach(([date, perfData]) => {
      Object.entries(perfData)
        .filter(([key]) => key !== "noteExo")
        .forEach(([exerciseId, exerciseData]) => {
          const exercise = workout.exercices[exerciseData.exoOrder];
          if (!exercise) return;

          Object.keys(exerciseData)
            .filter((key) => key.startsWith("weight") || key.startsWith("reps"))
            .forEach((key) => {
              const type = key.startsWith("weight") ? "weight" : "reps";
              const index = key.match(/\d+/)?.[0];
              const weight = Number(exerciseData[`weight${index}`]);
              const reps = Number(exerciseData[`reps${index}`]);

              if (!bestPerf[exercise.name]) {
                bestPerf[exercise.name] = {
                  name: exercise.name,
                  maxWeight: { date: "", weight: 0, reps: 0 },
                  maxReps: { date: "", weight: 0, reps: 0 },
                };
              }

              if (
                type === "weight" &&
                weight > bestPerf[exercise.name].maxWeight.weight
              ) {
                bestPerf[exercise.name].maxWeight = { date, weight, reps };
              }
              if (
                type === "reps" &&
                reps > bestPerf[exercise.name].maxReps.reps
              ) {
                bestPerf[exercise.name].maxReps = { date, weight, reps };
              }
            });
        });
    });

    setBestPerf((prevBestPerf) => ({ ...prevBestPerf, ...bestPerf }));
  };

  return (
    <div className="record-page">
      <Header />
      <h1>PAGE DES RECORDS</h1>
      <ul>
        {Object.entries(bestPerf).map(([exerciseName, data]) => (
          <li key={exerciseName}>
            <h2>{data.name}</h2>
            <h3> Max Weight:</h3>
            <p>
              {data.maxWeight.weight} kg for {data.maxWeight.reps} reps
            </p>
            <small>{data.maxWeight.date}</small>
            <h3> Max Reps:</h3>
            <p>
              {data.maxReps.reps} reps with {data.maxReps.weight} kg
            </p>
            <small>{data.maxReps.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

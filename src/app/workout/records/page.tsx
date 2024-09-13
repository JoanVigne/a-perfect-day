"use client";
import Header from "@/components/Header";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
interface UserData {
  email: string;
  uid: string;
}
interface Workouts {
  [key: string]: WorkoutType;
}
interface Exercice {
  name: string;
}
interface WorkoutType {
  name: string;
  id: string;
  description: string;
  duration: { [date: string]: any };
  creationDate: string;
  exercices: Record<string, Exercice>;
  perf?: Array<any> | null;
}
export default function Page() {
  const { user } = useAuthContext() as { user: UserData };
  const [workouts, setWorkouts] = useState<Workouts>({});
  const [exercices, setExercices] = useState<string[]>([]);

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
    console.log("workouts", workouts);
  }, [user.uid]);

  useEffect(() => {
    if (workouts) {
      getAllExercices();
    }
  }, [workouts]);

  function getAllExercices() {
    let allExercices: string[] = [];
    for (let workout in workouts) {
      for (let exerciceId in workouts[workout].exercices) {
        if (!workouts[workout].perf) {
          // don't push those exercices because no perf
        } else {
          const exercice = workouts[workout].exercices[exerciceId].name;
          if (!allExercices.includes(exercice)) {
            allExercices.push(exercice);
          }
        }
      }
    }
    setExercices(allExercices);
  }
  const [showRecord, setShowRecord] = useState<{
    [exerciseId: string]: boolean;
  }>({});
  /* const getBestPerf = (workout: any): void => {
    if (!workout.perf || !Object.entries(workout.perf).length) return;
    const bestPerf: any = {};
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
    setBestPerf(bestPerf);
  }; */
  const [bestPerf, setBestPerf] = useState({});

  return (
    <>
      <Header />
      <h1>PAGE DES RECORDS</h1>
      <ul>
        {exercices.map((exercice, index) => (
          <li key={index}>{exercice}</li>
        ))}
      </ul>
    </>
  );
}

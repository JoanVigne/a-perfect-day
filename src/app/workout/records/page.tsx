"use client";
import Header from "@/components/Header";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import "./recordPage.css";
import IconOpen from "@/components/ui/IconOpen";
import Image from "next/image";
import { exerciseNameGroups } from "./exercices";
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
    [exerciseName: string]: boolean;
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
        getBestPerformance(workout);
      }
    }
  }, [workouts]);

  const updateBestPerf = (
    exercise: PerfData,
    exerciseData: PerfData,
    date: string,
    bestPerf: BestPerf
  ) => {
    const best = bestPerf[exercise.name] || {
      name: exercise.name,
      maxWeight: { date: "", weight: 0, reps: 0 },
      maxReps: { date: "", weight: 0, reps: 0 },
    };

    Object.keys(exerciseData).forEach((key) => {
      const index = key.match(/\d+/)?.[0];
      if (!index) return;

      const weight = Number(exerciseData[`weight${index}`]);
      const reps = Number(exerciseData[`reps${index}`]);

      if (
        weight > best.maxWeight.weight ||
        (weight === best.maxWeight.weight && reps > best.maxWeight.reps)
      ) {
        best.maxWeight = { date, weight, reps };
      }

      if (
        reps > best.maxReps.reps ||
        (reps === best.maxReps.reps && weight > best.maxReps.weight)
      ) {
        best.maxReps = { date, weight, reps };
      }
    });

    bestPerf[exercise.name] = best;
  };

  const mergeExercisesPerf = (
    sameExercises: string[][],
    bestPerf: BestPerf,
    originalNamesMap: Record<string, string>
  ) => {
    sameExercises.forEach((group) => {
      const mergedName = group
        .map((name) => originalNamesMap[name])
        .join(" / "); // Merged name using original names
      let mergedPerf = {
        name: mergedName,
        maxWeight: { date: "", weight: 0, reps: 0 },
        maxReps: { date: "", weight: 0, reps: 0 },
      };

      // Loop through each exercise in the group and find the best maxWeight and maxReps
      group.forEach((normalizedName) => {
        const originalName = originalNamesMap[normalizedName];
        const perf = bestPerf[originalName];
        if (!perf) return;

        // Update the merged maxWeight
        if (
          perf.maxWeight.weight > mergedPerf.maxWeight.weight ||
          (perf.maxWeight.weight === mergedPerf.maxWeight.weight &&
            perf.maxWeight.reps > mergedPerf.maxWeight.reps)
        ) {
          mergedPerf.maxWeight = perf.maxWeight;
        }

        // Update the merged maxReps
        if (
          perf.maxReps.reps > mergedPerf.maxReps.reps ||
          (perf.maxReps.reps === mergedPerf.maxReps.reps &&
            perf.maxReps.weight > mergedPerf.maxReps.weight)
        ) {
          mergedPerf.maxReps = perf.maxReps;
        }

        // Remove individual exercises after merging
        delete bestPerf[originalName];
      });

      // Add the merged performance to bestPerf
      bestPerf[mergedName] = mergedPerf;
    });
  };

  const getBestPerformance = (workout: WorkoutType): void => {
    if (!workout.perf) return;

    const bestPerf: BestPerf = {};
    const originalNamesMap: Record<string, string> = {}; // Map normalized name to original name

    // Step 1: Calculate the best performance for individual exercises
    Object.entries(workout.perf).forEach(([date, perfData]) => {
      Object.values(perfData).forEach((exerciseData: PerfData) => {
        const exercise: any = workout.exercices[exerciseData.exoOrder];
        if (exercise) {
          const normalizedName = normalizeString(exercise.name);
          originalNamesMap[normalizedName] = exercise.name; // Store the original name
          updateBestPerf(exercise, exerciseData, date, bestPerf);
        }
      });
    });

    // Step 2: Find exercises that belong to the same group
    const sameExercises = findExercisesInSameGroup(
      bestPerf,
      exerciseNameGroups,
      originalNamesMap
    );

    // Step 3: Merge exercises in the same group and remove individual entries
    if (sameExercises) {
      mergeExercisesPerf(sameExercises, bestPerf, originalNamesMap);
    }

    // Step 4: Update the state with the new bestPerf including merged exercises
    setBestPerf((prev) => ({ ...prev, ...bestPerf }));
  };

  const normalizeString = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[éèê]/g, "e")
      .replace(/[à]/g, "a")
      .toLowerCase();

  const findExercisesInSameGroup = (
    bestPerf: BestPerf,
    groups: string[][],
    originalNamesMap: Record<string, string>
  ) => {
    const normalizedBestPerf = Object.keys(bestPerf).map(normalizeString);

    return groups
      .map((group) => group.map(normalizeString))
      .flatMap((group) => {
        const matchingExercises = normalizedBestPerf.filter((exo) =>
          group.includes(exo)
        );
        return matchingExercises.length > 1 ? [matchingExercises] : [];
      });
  };

  const sortByDate = (a: any, b: any) => {
    const dateA = new Date(a[1].maxWeight.date || a[1].maxReps.date).getTime();
    const dateB = new Date(b[1].maxWeight.date || b[1].maxReps.date).getTime();
    return dateB - dateA;
  };
  const sortedBestPerf = Object.entries(bestPerf).sort(sortByDate);
  return (
    <div className="record-page">
      <Header />
      <h1>PAGE DES RECORDS</h1>
      <ul>
        {sortedBestPerf.map(([exerciseName, data]) => (
          <li
            className={showRecord[exerciseName] ? "opened" : ""}
            key={exerciseName}
          >
            <h2>
              {data.name}{" "}
              <IconOpen
                show={showRecord[exerciseName] || false}
                setShow={(show: boolean) =>
                  setShowRecord((prev) => ({
                    ...prev,
                    [exerciseName]: show,
                  }))
                }
              />
            </h2>
            <div className="container-weight-reps">
              <div className="weight-reps">
                <h3>Weight:</h3>
                <p>
                  {isNaN(data.maxWeight.weight) ||
                  data.maxWeight.weight === 0 ? (
                    "no weight"
                  ) : (
                    <strong>
                      {data.maxWeight.weight}{" "}
                      <Image
                        src="/icon/kettlebell2.png"
                        alt="kettlebell Icon"
                        width={17}
                        height={17}
                      />
                    </strong>
                  )}{" "}
                  <small>
                    with{" "}
                    {isNaN(data.maxWeight.reps) || data.maxWeight.reps === 0
                      ? "nothing"
                      : `${data.maxWeight.reps} reps`}
                  </small>
                </p>
                <small>
                  {data.maxWeight.date === "" ? "nothing" : data.maxWeight.date}
                </small>
              </div>
              <div className="weight-reps">
                <h3>Reps:</h3>
                <p>
                  {isNaN(data.maxReps.reps) || data.maxReps.reps === 0 ? (
                    "nothing"
                  ) : (
                    <strong>{data.maxReps.reps} reps </strong>
                  )}{" "}
                  {isNaN(data.maxReps.weight) || data.maxReps.weight === 0 ? (
                    "no weight"
                  ) : (
                    <small>
                      {" "}
                      with {data.maxReps.weight}
                      <Image
                        src="/icon/kettlebell2.png"
                        alt="kettlebell Icon"
                        width={17}
                        height={17}
                      />
                    </small>
                  )}
                </p>
                <small>{data.maxReps.date} </small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

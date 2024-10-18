"use client";
import Header from "@/components/Header";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import "./recordPage.css";
import IconOpen from "@/components/ui/IconOpen";
import Image from "next/image";
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
const exerciseNameGroups = [
  [
    "bench",
    "bench press",
    "benchpress",
    "bp",
    "développé couché barre",
    "développé couché",
    "dc",
  ],
  ["squat", "squats"],
  [
    "overhead press",
    "overheadpress",
    "overhead press barre",
    "overheadpress barre",
    "développé militaire barre",
    "ohp",
  ],
  [
    "développé militaire dumbell",
    "développé militaire haltères",
    "développé militaire haltère",
    "overheadpress dumbell",
    "overhead press dumbell",
    "overheadpress dumbell",
    "overheadpress haltères",
    "overhead press haltères",
    "overheadpress haltères",
    "overheadpress haltère",
    "overhead press haltère",
    "overheadpress haltère",
    "ohp",
  ],
  [
    "deadlift",
    "dead lift",
    "dl",
    "soulevé de terre",
    "deadlift barre",
    "dead lift barre",
    "dl barre",
    "soulevé de terre barre",
  ],
  ["shoulder press", "shoulderpress", "sp"],
  ["pull-up", "pullup", "pull up"],
  ["dip", "dips"],
  ["curl"],
  ["tricep extension", "tricepextension", "tricep ext"],
  ["leg press", "legpress", "lp"],
  ["leg curl", "legcurl", "lc"],
  ["leg extension", "legextension", "le"],
  ["leg raise", "legraise", "lr"],
  ["calf raise", "calfraise", "cr"],
  ["lateral raise", "lateralraise", "lr"],
  ["front raise", "frontraise", "fr"],
  ["rear delt raise", "reardeltraise", "rdr"],
  ["shrug"],
  ["bent-over row", "bentoverrow", "bor"],
  ["row"],
  ["pull-over", "pullover", "po"],
  ["pulldown", "pull down", "pd"],
  ["lat pulldown", "latpulldown", "lat pd"],
  ["seated row", "seatedrow", "sr"],
  ["face pull", "facepull", "fp"],
  ["reverse fly", "reversefly", "rf"],
  ["chest fly", "chestfly", "cf"],
  ["pec fly", "pecfly", "pf"],
  ["cable fly", "cablefly", "cf"],
  ["cable crossover", "cablecrossover", "cc"],
  ["push-up", "pushup", "push up", "pompe", "pompes"],
  ["dumbbell press", "dumbbellpress", "dbp"],
  ["dumbbell fly", "dumbbellfly", "dbf"],
  ["dumbbell bench press", "dumbbellbenchpress", "dbbp"],
  ["dumbbell curl", "dumbbellcurl", "dbc"],
  ["dumbbell tricep extension", "dumbbelltricepextension", "dbte"],
  ["dumbbell row", "dumbbellrow", "dbr"],
  ["dumbbell pullover", "dumbbellpullover", "dbpo"],
  ["dumbbell lateral raise", "dumbbelllateralraise", "dblr"],
  ["dumbbell front raise", "dumbbellfrontraise", "dbfr"],
];
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
                (weight > bestPerf[exercise.name].maxWeight.weight ||
                  (weight === bestPerf[exercise.name].maxWeight.weight &&
                    reps >= bestPerf[exercise.name].maxWeight.reps))
              ) {
                bestPerf[exercise.name].maxWeight = { date, weight, reps };
              }
              if (
                type === "reps" &&
                (reps > bestPerf[exercise.name].maxReps.reps ||
                  (reps === bestPerf[exercise.name].maxReps.reps &&
                    weight >= bestPerf[exercise.name].maxReps.weight))
              ) {
                bestPerf[exercise.name].maxReps = { date, weight, reps };
              }
            });
        });
    });

    setBestPerf((prevBestPerf) => ({ ...prevBestPerf, ...bestPerf }));
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

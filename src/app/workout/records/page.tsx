"use client";
import Header from "@/components/Header";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import IconOpen from "@/components/ui/IconOpen";
interface UserData {
  email: string;
  uid: string;
}
interface Workouts {
  [key: string]: WorkoutType;
}
interface Exercice {
  name: string;
  id: string;
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
  const [exercices, setExercices] = useState<Exercice[]>([]);

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
    if (workouts) {
      getAllExercices();
    }
  }, [workouts]);

  function getAllExercices() {
    let allExercices: any[] = [];
    for (let workout in workouts) {
      for (let exerciceId in workouts[workout].exercices) {
        if (!workouts[workout].perf) {
          // don't push those exercices because no perf
        } else {
          const exercice = workouts[workout].exercices[exerciceId];
          if (!allExercices.some((e) => e.id === exerciceId)) {
            allExercices.push(exercice);
          }
        }
      }
    }
    //! FIND DIRECTLY THE BEST PERF IN HERE
    console.log("allExercices", allExercices);
    setExercices(allExercices);
  }

  const [showRecord, setShowRecord] = useState<{
    [exerciseId: string]: boolean;
  }>({});

  const [bestPerf, setBestPerf] = useState<any>({});

  return (
    <>
      <Header />
      <h1>PAGE DES RECORDS</h1>
      <ul>
        {exercices.map((exercice, index) => (
          <li key={index} className={showRecord[exercice.name] ? "opened" : ""}>
            {exercice.name}{" "}
            <IconOpen
              show={showRecord[exercice.name] || false}
              setShow={(show: boolean) =>
                setShowRecord((prev) => ({
                  ...prev,
                  [exercice.name]: show,
                }))
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}

"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FormWorkoutCreate from "../../components/forms/FormWorkoutCreate";
import "./workout.css";
import React, { useEffect, useState } from "react";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import CardWorkout from "../../components/cards/CardWorkout";
import { useAuthContext } from "@/context/AuthContext";
import Icon from "@/components/ui/Icon";
import ModalHelp from "@/components/modals/ModalHelp";
interface UserData {
  email: string;
  uid: string;
}
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
  const { user } = useAuthContext() as { user: UserData };
  const [workouts, setWorkouts] = useState<Workouts>({});
  const [openHelp, setOpenHelp] = useState(false);
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
  }, [setWorkouts]);
  return (
    <>
      <Header />
      <h1>
        Workout <Icon nameImg="question" onClick={() => setOpenHelp(true)} />
        <ModalHelp
          isVisible={openHelp}
          close={() => setOpenHelp(false)}
          messagehelp="This is the workout page. You can create a new workout in the form. You can also click on the question mark of a workout to see its details and past performances"
        />
      </h1>
      <div className="container">
        {workouts && Object.values(workouts as Workouts).length > 0 ? (
          <>
            {Object.values(workouts).map((workout: WorkoutType, index) => (
              <div key={workout.id}>
                <CardWorkout workout={workout as WorkoutType} index={index} />
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

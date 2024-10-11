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
import Link from "next/link";
import { useRouter } from "next/navigation";
interface UserData {
  email: string;
  uid: string;
}
interface WorkoutType {
  name: string;
  id: string;
  description: string;
  duration: { [date: string]: any };
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
  const router = useRouter();
  useEffect(() => {
    if (!user || !user.uid) {
      router.push("/connect");
    }
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
    workouts;

    fetchWorkouts();
  }, [setWorkouts]);
  const getMostRecentDate = (duration: { [date: string]: any }) => {
    const dates = Object.keys(duration);
    return dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : null;
  };

  const sortedWorkouts = workouts
    ? Object.values(workouts as Workouts).sort(
        (a: WorkoutType, b: WorkoutType) => {
          const dateA =
            a.duration && Object.keys(a.duration).length > 0
              ? getMostRecentDate(a.duration) ??
                new Date().toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0];
          const dateB =
            b.duration && Object.keys(b.duration).length > 0
              ? getMostRecentDate(b.duration) ??
                new Date().toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0];

          return dateB.localeCompare(dateA);
        }
      )
    : [];
  return (
    <div className="page-workouts">
      <Header />
      <h1>
        My workouts{" "}
        <Icon nameImg="question" onClick={() => setOpenHelp(true)} />
        <ModalHelp
          isVisible={openHelp}
          close={() => setOpenHelp(false)}
          messagehelp="This is the workout page. You can create a new workout in the form. You can also click on the question mark of a workout to see its details and past performances"
        />
      </h1>
      <div className="container">
        <div className="container-titles">
          <h2>Last time</h2>
        </div>
        {workouts && Object.values(workouts as Workouts).length > 0 ? (
          <>
            {Object.values(sortedWorkouts).map(
              (workout: WorkoutType, index) => (
                <div key={workout.id}>
                  <CardWorkout workout={workout as WorkoutType} index={index} />
                </div>
              )
            )}
          </>
        ) : (
          <p>No workout</p>
        )}
      </div>
      <section>
        <h2>Check all your exercice personal records down bellow!</h2>
        <Link href={`/workout/records`}>
          <div className="personal-record-link">
            <Icon
              nameImg="kettlebell2"
              onClick={() => {
                console.log("kettlebell!");
              }}
            />

            <h3>All my records</h3>

            <Icon
              nameImg="kettlebell2"
              onClick={() => {
                console.log("kettlebell!");
              }}
            />
          </div>
        </Link>
      </section>
      <FormWorkoutCreate />
      <Footer />
    </div>
  );
}

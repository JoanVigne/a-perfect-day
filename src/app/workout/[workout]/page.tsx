"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import "./workoutpage.css";
import ExoDisplay from "./components/ExoDisplay";
import Timer from "./components/Timer";
import TimeTotal from "./components/TimeTotal";
import Chronometer from "./components/Chronometer";
import { sendToWorkout } from "@/firebase/db/workout";
import { useAuthContext } from "@/context/AuthContext";

interface UserData {
  email: string;
  uid: string;
}
const Page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);

  const [chronoOrTimer, setChronoOrTimer] = useState(true);

  useEffect(() => {
    const pathslug = window.location.pathname.split("/").pop();
    if (pathslug) {
      setSlug(pathslug);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      getThisWorkout();
    }
  }, [slug]);

  const getThisWorkout = () => {
    const dataWorkouts = getItemFromLocalStorage("workouts");
    Object.values(dataWorkouts).map((workout: any) => {
      if (workout.id === slug) {
        setThisWorkout(workout);
      }
    });
  };
  function perfSubmit(data: any) {
    const date = new Date();
    const dateStr = date.toISOString().substring(0, 10);
    console.log("dateStr", dateStr);
    const perfData = {
      [dateStr]: data,
    };
    console.log("perfData", perfData);
    const dataWorkout = thisWorkout;
    console.log("dataWorkout", dataWorkout);
    if (dataWorkout && dataWorkout.perf) {
      dataWorkout.perf = { ...dataWorkout.perf, ...perfData };
    } else {
      dataWorkout.perf = perfData;
    }
    console.log("updated dataWorkout", dataWorkout);
    const dataWorkouts = getItemFromLocalStorage("workouts");
    if (!dataWorkouts) return console.log("no workouts in LS");
    dataWorkouts[dataWorkout.id] = dataWorkout;
    console.log("RESULT ::: ", dataWorkouts);
    const mess = sendToWorkout(dataWorkout, user.uid);
    console.log("mess", mess);
  }
  return (
    <div>
      {thisWorkout && (
        <>
          <header>
            <TimeTotal />
          </header>

          <h1>{thisWorkout.name}</h1>
          <h2>{thisWorkout.description}</h2>

          <p>
            int = the time you rest between series. rest = time you rest between
            exercices. Both are in minutes. exemple 1.2 for 80seconds.
          </p>
          <div className="container-time">
            <button
              className="switch"
              onClick={() => {
                setChronoOrTimer(!chronoOrTimer);
              }}
            >
              {chronoOrTimer ? (
                <>
                  Chrono / <strong>timer?</strong>
                </>
              ) : (
                <>
                  <strong>Chrono</strong> / timer?
                </>
              )}
            </button>

            {chronoOrTimer && <Timer />}
            {!chronoOrTimer && <Chronometer />}
          </div>

          <ExoDisplay exo={thisWorkout.exercices} onSubmit={perfSubmit} />
        </>
      )}
    </div>
  );
};

export default Page;

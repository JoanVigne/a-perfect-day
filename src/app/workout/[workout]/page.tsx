"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import "./workoutpage.css";
import FormTraining from "../../../components/forms/FormTraining";
import Timer from "../../../components/ui/Timer";
import TimeTotal from "../../../components/ui/TimeTotal";
import Chronometer from "../../../components/ui/Chronometer";
import { sendToWorkout } from "@/firebase/db/workout";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

interface UserData {
  email: string;
  uid: string;
}
const Page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);
  const [durationWorkout, setDurationWorkout] = useState<string>("");

  const [chronoOrTimer, setChronoOrTimer] = useState(true);
  const [finished, setFinished] = useState(false);
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
  async function perfSubmit(data: any) {
    const date = new Date();
    const dateStr = date.toISOString().substring(0, 10);
    const perfData = {
      [dateStr]: data,
    };
    const dataWorkout = thisWorkout;
    if (dataWorkout && dataWorkout.perf) {
      dataWorkout.perf = { ...dataWorkout.perf, ...perfData };
    } else {
      dataWorkout.perf = perfData;
    }
    const duration = {
      [dateStr]: durationWorkout,
    };
    if (dataWorkout && dataWorkout.duration) {
      dataWorkout.duration = { ...dataWorkout.duration, ...duration };
    } else {
      dataWorkout.duration = duration;
    }
    console.log("updated dataWorkout", dataWorkout);
    const dataWorkouts = getItemFromLocalStorage("workouts");
    if (!dataWorkouts) return console.log("no workouts in LS");
    dataWorkouts[dataWorkout.id] = dataWorkout;
    console.log("RESULT ::: ", dataWorkouts);

    const mess = sendToWorkout(dataWorkout, user.uid);
    console.log("mess", mess);
    setFinished(true);
  }

  return (
    <div>
      {thisWorkout && (
        <>
          <header>
            <TimeTotal
              stopOnFinish={finished}
              onTimeFinish={(time) => {
                setDurationWorkout(time);
              }}
            />
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
          {finished ? (
            <div className="containerLinks">
              <h2>Workout performances saved ! </h2>
              <Link href={`/workout/${thisWorkout.id}/stats`}>
                Check the statistic about this workout
              </Link>
              <Link href={`/workout`}>Back to the main page</Link>
            </div>
          ) : (
            <FormTraining exo={thisWorkout.exercices} onSubmit={perfSubmit} />
          )}
        </>
      )}
    </div>
  );
};

export default Page;

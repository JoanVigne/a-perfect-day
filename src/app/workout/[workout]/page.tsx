"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import "../workout.css";
import FormTraining from "../../../components/forms/FormTraining";
import Timer from "../../../components/ui/Timer";
import TimeTotal from "../../../components/ui/TimeTotal";
import Chronometer from "../../../components/ui/Chronometer";
import { sendToWorkout } from "@/firebase/db/workout";

import Link from "next/link";

const Page = () => {
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
            <FormTraining
              exo={thisWorkout.exercices}
              thisWorkout={thisWorkout}
              durationWorkout={durationWorkout}
              setFinished={setFinished}
            />
            /*  <FormTraining exo={thisWorkout.exercices} onSubmit={perfSubmit} /> */
          )}
        </>
      )}
    </div>
  );
};

export default Page;

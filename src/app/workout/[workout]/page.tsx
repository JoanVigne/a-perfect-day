"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import "./workoutpage.css";
import ExoDisplay from "./components/ExoDisplay";
import Timer from "./components/Timer";
import TimeTotal from "./components/TimeTotal";
import Chronometer from "./components/Chronometer";

const Page = () => {
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
    const workoutsLS = getItemFromLocalStorage("workouts");
    Object.values(workoutsLS).map((workout: any) => {
      if (workout.id === slug) {
        setThisWorkout(workout);
      }
    });
  };
  function perfSubmit(data: any) {
    console.log("inside page :", data);
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
          <button className="save">I finished my workout</button>
        </>
      )}
    </div>
  );
};

export default Page;

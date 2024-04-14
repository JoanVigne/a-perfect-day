"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import "./workoutpage.css";
import ExoDisplay from "./components/ExoDisplay";

const Page = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);

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
  return (
    <div>
      {thisWorkout && (
        <>
          <header>
            <button>end workout</button>total timer and/or chrono{" "}
          </header>
          <h1>{thisWorkout.name}</h1>
          <h2>{thisWorkout.description}</h2>
          <p>
            int = the time you rest between series. rest = time you rest between
            exercices. Both are in minutes. exemple 1.2 for 80seconds.
          </p>
          <ExoDisplay exo={thisWorkout.exercices} />
        </>
      )}
    </div>
  );
};

export default Page;

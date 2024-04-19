"use client";
import { useEffect, useState } from "react";
import FormTraining from "../../../components/forms/FormTraining";

import { getItemFromLocalStorage } from "@/utils/localstorage";
import Link from "next/link";
import TimeChronometer from "@/components/ui/TimeChronometer";
import Timer from "@/components/ui/Timer";

const Page = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);
  const [finished, setFinished] = useState(false);
  const [chornoTimer, setChronoTimer] = useState(false);
  useEffect(() => {
    const pathslug = window.location.pathname.split("/").pop();
    setSlug(pathslug || null);
  }, []);

  useEffect(() => {
    if (slug) {
      const dataWorkouts = getItemFromLocalStorage("workouts");
      const workout = Object.values(dataWorkouts).find(
        (workout: any) => workout.id === slug
      );
      setThisWorkout(workout);
    }
  }, [slug]);

  const handleFinished = (callback: () => void) => {
    setFinished(true);
    callback();
  };

  return (
    <div>
      {thisWorkout && (
        <>
          <h1>{thisWorkout.name}</h1>
          <h2>{thisWorkout.description}</h2>

          {finished ? (
            <div
              className="containerLinks"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h2>Workout performances saved ! </h2>
              <Link href={`/workout/${thisWorkout.id}/stats`} className="link">
                Check the statistic about this workout
              </Link>
              <Link href={`/workout`} className="link">
                Back to the main page
              </Link>
            </div>
          ) : (
            <FormTraining
              exo={thisWorkout.exercices}
              thisWorkout={thisWorkout}
              setFinished={handleFinished}
            />
          )}
        </>
      )}
      <footer>
        <button
          type="button"
          onClick={() => {
            setChronoTimer(!chornoTimer);
          }}
        >
          {chornoTimer ? "Chrono" : "Timer"}
        </button>
        {chornoTimer ? <TimeChronometer /> : <Timer />}
      </footer>
    </div>
  );
};

export default Page;

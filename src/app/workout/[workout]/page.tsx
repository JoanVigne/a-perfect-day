"use client";
import { useEffect, useState } from "react";
import FormTraining from "../../../components/forms/FormTraining";

import { getItemFromLocalStorage } from "@/utils/localstorage";
import Link from "next/link";
import Footer from "@/components/Footer";
import TimeTotal from "@/components/ui/TimeTotal";
import TimeChronometer from "@/components/ui/TimeChronometer";
import Timer from "@/components/ui/Timer";
import "@/components/header.css";

const Page = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);
  const [chornoTimer, setChronoTimer] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [finalTime, setFinalTime] = useState("");
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
      <header className="HeaderTraining">
        <TimeTotal
          isActive={isTimerActive}
          stopOnFinish={!isTimerActive}
          onTimeFinish={setFinalTime}
        />
        {finished ? (
          ""
        ) : (
          <div className="row-two">
            <div className="buttons">
              <button
                type="button"
                className={chornoTimer ? "active" : ""}
                onClick={() => {
                  setChronoTimer(true);
                }}
              >
                Chrono
              </button>
              <button
                type="button"
                className={!chornoTimer ? "active" : ""}
                onClick={() => {
                  setChronoTimer(false);
                }}
              >
                Timer
              </button>
            </div>

            {chornoTimer ? <TimeChronometer /> : <Timer />}
          </div>
        )}
      </header>

      {thisWorkout && (
        <>
          {finished ? (
            <div
              className="containerLinks"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h2>
                Performances of <strong>{thisWorkout.name} have been</strong>{" "}
                saved !{" "}
              </h2>
              <Link href={`/workout/${thisWorkout.id}/stats`} className="link">
                Check the statistic about this workout
              </Link>
              <Link href={`/workout`} className="link">
                Back to the main page
              </Link>
              <Footer />
            </div>
          ) : (
            <>
              <h1>{thisWorkout.name}</h1>
              <h2>{thisWorkout.description}</h2>
              <FormTraining
                exo={thisWorkout.exercices}
                thisWorkout={thisWorkout}
                setFinished={handleFinished}
                isTimerActive={isTimerActive}
                setIsTimerActive={setIsTimerActive}
                finalTime={finalTime}
                setFinalTime={setFinalTime}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Page;

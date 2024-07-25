"use client";
import { useEffect, useState } from "react";

import { getItemFromLocalStorage } from "@/utils/localstorage";
import Link from "next/link";
import Footer from "@/components/Footer";
import TimeChronometer from "@/components/ui/TimeChronometer";
import Timer from "@/components/ui/Timer";
import "@/components/header.css";
import FormTrain from "@/components/forms/workout-training/FormTrain";
import Icon from "@/components/ui/Icon";
import ModalModifyWorkout from "@/components/modals/ModalModifyWorkout";
import nosleep from "nosleep.js";

const Page = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);
  const [chornoTimer, setChronoTimer] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [finalTime, setFinalTime] = useState("");
  const [modalModify, setModalModify] = useState(false);

  // to ensure screen doesn't sleep
  const noSleep = new nosleep();
  useEffect(() => {
    if (!finished) {
      noSleep.enable();
    } else {
      noSleep.disable();
    }
  }, [finished]);
  //
  const [timerKey, setTimerKey] = useState(0);
  const [timerValue, setTimerValue] = useState<number | null>(null);
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

  const handleStartTimer = (value: number, placeholder: string) => {
    let newTimerValue = 0;
    if (value) {
      newTimerValue = Number(value);
    } else if (placeholder) {
      newTimerValue = Number(placeholder);
    }
    // Wrap the timer value in an object
    setTimerValue(newTimerValue);
    setTimerKey((prevKey) => prevKey + 1);
  };

  const handleChronoClick = () => {
    setChronoTimer(true);
  };

  const handleTimerClick = () => {
    setChronoTimer(false);
  };

  const handleFinished = (callback: () => void) => {
    setFinished(true);
    callback();
  };

  return (
    <div>
      <header className="HeaderTraining">
        {finished ? (
          ""
        ) : (
          <div className="row-two">
            <div className="buttons">
              <button
                type="button"
                className={chornoTimer ? "active-button" : ""}
                onClick={handleChronoClick}
              >
                Chrono
              </button>
              <button
                type="button"
                className={!chornoTimer ? "active-button" : ""}
                onClick={handleTimerClick}
              >
                Timer
              </button>
            </div>

            {chornoTimer ? (
              <TimeChronometer />
            ) : (
              <Timer timerKey={timerKey} timerValue={timerValue} />
            )}
          </div>
        )}
      </header>
      <main>
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
                <Link
                  href={`/workout/${thisWorkout.id}/stats`}
                  className="link"
                >
                  Check the statistic about this workout
                </Link>
                <Link href={`/workout`} className="link">
                  Back to the main page
                </Link>
                <Footer />
              </div>
            ) : (
              <>
                <h1>
                  <ModalModifyWorkout
                    modalOpen={modalModify}
                    setModalOpen={setModalModify}
                    workoutToModify={thisWorkout}
                    duringTraining={true}
                  />
                  <Icon nameImg="modify" onClick={() => setModalModify(true)} />
                  {thisWorkout.name}
                </h1>
                <h2>{thisWorkout.description}</h2>
                <FormTrain
                  exo={thisWorkout.exercices}
                  thisWorkout={thisWorkout}
                  setFinished={handleFinished}
                  setIsTimerActive={setIsTimerActive}
                  finalTime={finalTime}
                  onStartTimer={handleStartTimer}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Page;

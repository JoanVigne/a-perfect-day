"use client";
import { useEffect, useState } from "react";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import TimeChronometer from "@/components/ui/TimeChronometer";
import Timer from "@/components/ui/Timer";
import "@/components/header.css";
import "@/app/workout/workout.css";
import FormTrain from "@/components/forms/workout-training/FormTrain";
import nosleep from "nosleep.js";
import ContainerEndWorkout from "@/components/ContainerEndWorkout";

const Page = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [thisWorkout, setThisWorkout] = useState<any>(null);
  const [chornoTimer, setChronoTimer] = useState(false);
  const [finished, setFinished] = useState(false);

  const [finalTime, setFinalTime] = useState("");
  const [modalModify, setModalModify] = useState(false);
  // check the slug to get the workout
  useEffect(() => {
    const pathslug = window.location.pathname.split("/").pop();
    setSlug(pathslug || null);
  }, [modalModify]);
  // get the workout from the localstorage
  useEffect(() => {
    if (slug) {
      updateDataFromLocalStorage();
    }
  }, [slug, modalModify]);
  // to ensure screen doesn't sleep
  const noSleep = new nosleep();
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !finished) {
        noSleep.enable();
      } else {
        noSleep.disable();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      noSleep.disable();
    };
  }, [finished]);
  // to know if we can leave the page or not
  const [canLeave, setCanLeave] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!finished && !canLeave) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const handlePopState = () => {
      if (!finished && !canLeave) {
        window.history.pushState(null, "", window.location.href);
      }
    };
    if (!finished && !canLeave) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      window.history.pushState(null, "", window.location.href);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [canLeave]);

  //
  const [timerKey, setTimerKey] = useState(0);
  const [timerValue, setTimerValue] = useState<number | null>(null);

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
    setCanLeave(true);
    setFinished(true);
    callback();
  };
  function updateDataFromLocalStorage() {
    const dataWorkouts = getItemFromLocalStorage("workouts");
    const workout = Object.values(dataWorkouts).find(
      (workout: any) => workout.id === slug
    );
    setThisWorkout(workout);
  }
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
              <ContainerEndWorkout propsWorkout={thisWorkout} />
            ) : (
              <>
                <h2>{thisWorkout.description}</h2>
                <FormTrain
                  thisWorkout={thisWorkout}
                  setFinished={handleFinished}
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

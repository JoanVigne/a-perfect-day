"use client";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./finished.css";

export default function Page() {
  const pathname = usePathname();
  const getCurrentDateFormatted = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [numberOfImprovementsToday, setNumberOfImprovementsToday] = useState<
    string | null
  >(null);

  useEffect(() => {
    const localstorage = getItemFromLocalStorage("workouts");
    const thisWorkoutStat = localstorage[isolateWorkoutID()];
    function isolateWorkoutID() {
      const firstSlash = pathname.indexOf("/", 1);
      const secondSlash = pathname.indexOf("/", firstSlash + 1);
      let workoutID = pathname.slice(firstSlash + 1, secondSlash);
      return workoutID;
    }
    setNumberOfImprovementsToday(
      thisWorkoutStat.numbImprovement[getCurrentDateFormatted()]
    );
  }, []);
  return (
    <div className="container-end-of-training">
      <h2>Performances are saved ! </h2>

      {numberOfImprovementsToday && Number(numberOfImprovementsToday) !== 0 ? (
        <>
          <h3>Number of improvement today </h3>
          <h3>
            {[...Array(Math.min(Number(numberOfImprovementsToday), 6))].map(
              (_, index) => (
                <Icon
                  key={index}
                  nameImg="fire"
                  onClick={() => console.log("fire")}
                />
              )
            )}

            {numberOfImprovementsToday}

            {[...Array(Math.min(Number(numberOfImprovementsToday), 6))].map(
              (_, index) => (
                <Icon
                  key={index}
                  nameImg="fire"
                  onClick={() => console.log("fire")}
                />
              )
            )}
          </h3>
        </>
      ) : (
        <h3>
          We didn't record any improvement for today, but next time YOU WILL!
        </h3>
      )}
      <h3>Well done !</h3>
      <div className="container-gif">
        <iframe
          src="https://giphy.com/embed/pHb82xtBPfqEg"
          width="100%"
          height="100%"
          style={{ position: "absolute" }}
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        ></iframe>
      </div>

      <div className="container-links">
        <Link href={`/workout`} className="link">
          Main page
        </Link>
      </div>

      <Footer />
    </div>
  );
}

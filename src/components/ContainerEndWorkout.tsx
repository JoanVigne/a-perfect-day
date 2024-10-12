import Link from "next/link";
import Footer from "./Footer";
import "./containerEndWorkout.css";
import { useEffect, useState } from "react";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import Icon from "./ui/Icon";
interface WorkoutType {
  name: string;
  id: string;
  description: string;
  duration: { [date: string]: any };
  creationDate: string;
  exercices: string[];
  perf: Array<any> | null;
}
interface ContainerEndWorkoutProps {
  propsWorkout: WorkoutType;
}
const ContainerEndWorkout: React.FC<ContainerEndWorkoutProps> = ({
  propsWorkout,
}) => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentDate = getCurrentDateFormatted();
      console.log(currentDate);
      console.log(propsWorkout);

      let workouts;
      let thisWorkoutNumbOfImp;
      let retryCount = 0;
      const maxRetries = 4;

      // Retry mechanism
      while (
        (thisWorkoutNumbOfImp === undefined || thisWorkoutNumbOfImp === null) &&
        retryCount < maxRetries
      ) {
        workouts = await getItemFromLocalStorage("workouts");
        if (!workouts || !propsWorkout || !propsWorkout.id) {
          console.error("Invalid workouts data or propsWorkout");
          setLoading(false);
          return;
        }

        thisWorkoutNumbOfImp =
          workouts?.[propsWorkout.id]?.numbImprovement?.[currentDate];

        if (
          thisWorkoutNumbOfImp === undefined ||
          thisWorkoutNumbOfImp === null
        ) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5 second before retrying
        }
      }
      // If still undefined or null after retries, set to 0
      if (thisWorkoutNumbOfImp === undefined || thisWorkoutNumbOfImp === null) {
        thisWorkoutNumbOfImp = 0;
      }
      setNumberOfImprovementsToday(thisWorkoutNumbOfImp);
      setLoading(false);
    };

    fetchData();
  }, [propsWorkout]);

  useEffect(() => {
    console.log("numberOfImprovementsToday", numberOfImprovementsToday);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-end-of-training">
      <h2>Performances are saved ! </h2>
      <h3>All the exercices : </h3>
      <ul className="list-of-done-exercices">
        {propsWorkout.exercices.map((exercice: any, index: number) => {
          const isLast = index === propsWorkout.exercices.length - 1;
          const isSecondLast = index === propsWorkout.exercices.length - 2;
          return (
            <li key={exercice.id}>
              {exercice.name}
              {!isLast && (
                <span className="separator">
                  {isSecondLast ? " and " : ","}
                </span>
              )}
              {isLast && "."}
            </li>
          );
        })}
      </ul>
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
        <h3>See you soon.</h3>
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
        <Link href={`/workout/${propsWorkout.id}/stats`} className="link">
          Statistics of "{propsWorkout.name}"
        </Link>
        <Link href={`/workout`} className="link">
          Main page
        </Link>
      </div>

      <Footer />
    </div>
  );
};
export default ContainerEndWorkout;

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
      let thisWorkoutNumbOfImp = "";

      // Retry mechanism
      while (!thisWorkoutNumbOfImp) {
        workouts = await getItemFromLocalStorage("workouts");

        if (!workouts || !propsWorkout || !propsWorkout.id) {
          console.error("Invalid workouts data or propsWorkout");
          setLoading(false);
          return;
        }

        thisWorkoutNumbOfImp =
          workouts?.[propsWorkout.id]?.numbImprovement?.[currentDate] || "";

        if (!thisWorkoutNumbOfImp) {
          console.log("Retrying to fetch thisWorkoutNumbOfImp...");
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 1 second before retrying
        }
      }

      setNumberOfImprovementsToday(thisWorkoutNumbOfImp);
      setLoading(false);
    };

    fetchData();
  }, [propsWorkout]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-end-of-training">
      <h2>Performances are saved ! </h2>
      <h3>You did all those exercices : </h3>
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
      {numberOfImprovementsToday && (
        <h3>
          And you improved {numberOfImprovementsToday} things
          <Icon nameImg="fire" onClick={() => console.log("fire")} />
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

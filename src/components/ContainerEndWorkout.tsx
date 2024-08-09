import Link from "next/link";
import Footer from "./Footer";
import "./containerEndWorkout.css";
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

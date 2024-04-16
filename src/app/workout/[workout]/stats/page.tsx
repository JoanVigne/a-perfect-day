"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import "../workoutpage.css";

interface Exercise {
  name: string;
  equipment: string;
  description: string;
  id: string;
}

interface PerfData {
  exoOrder: number;
  [key: string]: string | number;
}

interface Workout {
  name: string;
  id: string;
  description: string;
  exercices: Exercise[];
  perf: {
    [date: string]: {
      [exerciseId: string]: PerfData;
    };
  };
}
const page = () => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  useEffect(() => {
    const pathArray = window.location.pathname.split("/");
    const pathslug = pathArray[pathArray.length - 2];
    if (pathslug) {
      const workoutls = getItemFromLocalStorage("workouts");
      if (!workoutls) return;
      const workout = workoutls[pathslug];
      setWorkout(workout);
    }
  }, []);

  return (
    <div>
      {workout ? (
        <div>
          <h1>{workout.name}</h1>
          <h2>{workout.description}</h2>
          <div className="container-exo">
            <h3>Performance:</h3>
            {Object.entries(workout.perf).map(([date, perfData], index) => (
              <div key={index}>
                <h4>{date}</h4>
                {Object.entries(perfData)
                  .sort((a, b) => a[1].exoOrder - b[1].exoOrder)
                  .map(([exerciseId, exerciseData], index) => {
                    const exercise = workout.exercices[exerciseData.exoOrder];
                    return (
                      <div key={index}>
                        <h4>{exercise.name}</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Serie</th>
                              <th>Weight</th>
                              <th>Reps</th>
                              <th>Rest</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{exerciseData[`weight${i}`]}</td>
                                <td>{exerciseData[`reps${i}`]}</td>
                                <td>{exerciseData[`int${i}`]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>No stats yet in this workout</>
      )}
    </div>
  );
};

export default page;
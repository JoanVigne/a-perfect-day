"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import ModalModifyWorkout from "../../../../components/modals/ModalModifyWorkout";
import Link from "next/link";
import ModalConfirmSend from "@/components/modals/ModalConfirmSend";
import { useAuthContext } from "@/context/AuthContext";
import { removeFromWorkouts } from "@/firebase/db/workout";
import IconOpen from "@/components/ui/IconOpen";
import "./statspage.css";
import { formatDate } from "@/utils/date";

interface Exercise {
  name: string;
  equipment: string;
  description: string;
  id: string;
}
interface UserData {
  email: string;
  uid: string;
}
interface PerfData {
  exoOrder: number;
  [key: string]: string | number;
}

interface BestPerfData {
  name: string;
  maxWeight: { date: string; weight: number; reps: number };
  maxReps: { date: string; weight: number; reps: number };
}

interface BestPerf {
  [exerciseName: string]: {
    name: string;
    maxWeight: { date: string; weight: number; reps: number };
    maxReps: { date: string; weight: number; reps: number };
  };
}
interface Workout {
  name: string;
  id: string;
  description: string;
  exercices: Exercise[];
  numbImprovement: any;
  perf: {
    [date: string]: {
      [exerciseId: string]: PerfData;
    };
  };
}
const Page = () => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const { user } = useAuthContext() as { user: UserData };
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
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showPerf, setShowPerf] = useState<{ [date: string]: boolean }>({});

  async function removeWorkout(workout: Workout) {
    const ls = getItemFromLocalStorage("workouts");
    if (workout && workout.id !== undefined) {
      const workoutUpdated = { ...ls };
      Object.keys(workoutUpdated).forEach((key) => {
        const taskKey = key as keyof typeof workoutUpdated;
        if (taskKey === workout?.id) {
          delete workoutUpdated[taskKey];
        }
      });
      const mess = await removeFromWorkouts(workoutUpdated, user.uid);
      console.log(mess);
      window.location.href = "/workout";
    }
  }
  const [showRecord, setShowRecord] = useState<{
    [exerciseId: string]: boolean;
  }>({});
  const getBestPerf = (workout: Workout): void => {
    if (!workout.perf || !Object.entries(workout.perf).length) return;
    const bestPerf: BestPerf = {};
    Object.entries(workout.perf).forEach(([date, perfData]) => {
      Object.entries(perfData)
        .filter(([key]) => key !== "noteExo")
        .forEach(([exerciseId, exerciseData]) => {
          const exercise = workout.exercices[exerciseData.exoOrder];
          if (!exercise) return;

          Object.keys(exerciseData)
            .filter((key) => key.startsWith("weight") || key.startsWith("reps"))
            .forEach((key) => {
              const type = key.startsWith("weight") ? "weight" : "reps";
              const index = key.match(/\d+/)?.[0];
              const weight = Number(exerciseData[`weight${index}`]);
              const reps = Number(exerciseData[`reps${index}`]);

              if (!bestPerf[exercise.name]) {
                bestPerf[exercise.name] = {
                  name: exercise.name,
                  maxWeight: { date: "", weight: 0, reps: 0 },
                  maxReps: { date: "", weight: 0, reps: 0 },
                };
              }

              if (
                type === "weight" &&
                weight > bestPerf[exercise.name].maxWeight.weight
              ) {
                bestPerf[exercise.name].maxWeight = { date, weight, reps };
              }
              if (
                type === "reps" &&
                reps > bestPerf[exercise.name].maxReps.reps
              ) {
                bestPerf[exercise.name].maxReps = { date, weight, reps };
              }
            });
        });
    });
    setBestPerf(bestPerf);
  };
  const [bestPerf, setBestPerf] = useState({});
  useEffect(() => {
    if (workout) {
      getBestPerf(workout);
    }
  }, [workout]);

  return (
    <div>
      <Header />

      <ModalConfirmSend
        isVisible={isModalVisible}
        onConfirm={() => {
          removeWorkout(workout as Workout);
          setIsModalVisible(false);
        }}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        message={
          workout ? `Are you sure you want to remove ${workout.name}?` : ""
        }
      />
      {workout ? (
        <div className="container-stats-page">
          <h1>
            <Icon
              nameImg="red-bin"
              onClick={() => {
                setIsModalVisible(true);
              }}
            />
            {workout.name}
            <Icon nameImg="modify" onClick={() => setModalOpen(true)} />
          </h1>
          <ModalModifyWorkout
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            workoutToModify={workout}
            duringTraining={false}
            updateDataFromLocalStorage={() => {}}
          />

          <h2>Description :</h2>
          <p className="description">{workout.description}</p>
          <h2>Actual exercices :</h2>
          <ul className="list-exos">
            {workout.exercices &&
              workout.exercices.map((exo, index) => (
                <li key={index}>
                  <span className="index">{index + 1}</span> {exo.name}
                </li>
              ))}
          </ul>
          <div className="container-performances">
            <h2>Personal records in this training</h2>
            <div className="container-best-perf">
              {workout.perf &&
                Object.entries(bestPerf).map(
                  ([exerciseId, data]: [string, any]) => (
                    <div
                      key={exerciseId}
                      className={
                        showRecord[exerciseId]
                          ? "container-record opened"
                          : "container-record"
                      }
                    >
                      <div
                        className={
                          showRecord[exerciseId] ? "title opened" : "title"
                        }
                      >
                        <IconOpen
                          show={showRecord[exerciseId] || false}
                          setShow={(show: boolean) =>
                            setShowRecord((prev) => ({
                              ...prev,
                              [exerciseId]: show,
                            }))
                          }
                        />
                        <h3>{data.name} </h3>
                      </div>
                      <div className="container-data">
                        <h4>Max Weight : {data.maxWeight.weight}</h4>

                        <p>with {data.maxWeight.reps} reps</p>
                        <i>the {formatDate(data.maxWeight.date, false)}</i>

                        <h4>Max Reps {data.maxReps.reps}</h4>

                        <p>with weight: {data.maxReps.weight}</p>
                        <i>the {formatDate(data.maxReps.date, false)}</i>
                      </div>
                    </div>
                  )
                )}
            </div>
            <h2>By date</h2>
            {workout.perf ? (
              Object.entries(workout.perf)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .map(([date, perfData], index) => {
                  const formattedDate = formatDate(date, true);
                  return (
                    <>
                      <div
                        key={index}
                        className={
                          showPerf[date]
                            ? "container-date-perf opened"
                            : "container-date-perf"
                        }
                      >
                        <h3>
                          <div>
                            <IconOpen
                              show={showPerf[date] || false}
                              setShow={(show: boolean) =>
                                setShowPerf((prev) => ({
                                  ...prev,
                                  [date]: show,
                                }))
                              }
                            />
                            {formattedDate}
                          </div>
                          {workout.numbImprovement[date] > 0 && (
                            <div className="improvementContainer">
                              <Icon nameImg="fire" onClick={() => {}} />
                              {workout.numbImprovement[date]}
                            </div>
                          )}
                        </h3>
                        <div className="container-perf">
                          {Object.entries(perfData)
                            .filter(([key]) => key !== "noteExo")
                            .sort((a, b) => a[1].exoOrder - b[1].exoOrder)
                            .map(([exerciseId, exerciseData], index) => {
                              const exercise =
                                workout.exercices[exerciseData.exoOrder];
                              if (!exercise) {
                                return null;
                              }
                              return (
                                <div key={index} className="container-exo">
                                  <h4>{exercise.name}</h4>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Wei</th>
                                        <th>Reps</th>
                                        <th>Rest</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.keys(exerciseData)
                                        .filter((key) => key.startsWith("reps"))
                                        .map((key, i) => (
                                          <tr key={i}>
                                            <td>
                                              {exerciseData[`weight${i}`] || ""}
                                            </td>
                                            <td>{exerciseData[`reps${i}`]}</td>
                                            <td>
                                              {exerciseData[`int${i}`] ||
                                                exerciseData[`interval${i}`] ||
                                                ""}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                  {perfData.noteExo &&
                                    perfData.noteExo[exerciseId] && (
                                      <p>
                                        Note : {perfData.noteExo[exerciseId]}
                                      </p>
                                    )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  );
                })
            ) : (
              <>
                <h4>No performances yet, go train ? </h4>
                <Link href={`/workout/${workout.id}`}>Train now</Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Workout not found</p>
      )}

      <Footer />
    </div>
  );
};

export default Page;

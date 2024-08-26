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
          <div className="description">
            <h3>{workout.description}</h3>
          </div>
          <h2>Exercices :</h2>
          <ul className="list-exos">
            {workout.exercices &&
              workout.exercices.map((exo, index) => (
                <li key={index}>
                  <span className="index">{index + 1}</span> {exo.name}
                </li>
              ))}
          </ul>
          <div className="container-performances">
            <h2>Performances:</h2>
            {workout.perf ? (
              Object.entries(workout.perf)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .map(([date, perfData], index) => {
                  const formattedDate = new Date(date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                    }
                  );
                  return (
                    <div
                      key={index}
                      className={
                        showPerf[date]
                          ? "container-date-perf opened"
                          : "container-date-perf"
                      }
                    >
                      <h3>
                        <IconOpen
                          show={showPerf[date] || false}
                          setShow={(show: boolean) =>
                            setShowPerf((prev) => ({ ...prev, [date]: show }))
                          }
                        />{" "}
                        {formattedDate}{" "}
                      </h3>
                      <div className="container-perf">
                        {
                          /* showPerf[date] && */
                          Object.entries(perfData)
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
                            })
                        }
                      </div>
                    </div>
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

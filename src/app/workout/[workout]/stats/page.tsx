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
const page = () => {
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
      console.log("workout", workout);
    }
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showPerf, setShowPerf] = useState<{ [date: string]: boolean }>({});

  async function removeWorkout(workout: Workout) {
    console.log("remove workout", workout);
    const ls = getItemFromLocalStorage("workouts");
    if (workout && workout.id !== undefined) {
      const workoutUpdated = { ...ls };
      Object.keys(workoutUpdated).forEach((key) => {
        const taskKey = key as keyof typeof workoutUpdated;
        if (taskKey === workout?.id) {
          delete workoutUpdated[taskKey];
        }
      });
      console.log("workoutUpdated", workoutUpdated);
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
        <div>
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
          />
          <h2>{workout.description}</h2>
          <h3>Exos :</h3>
          <ul>
            {workout.exercices &&
              workout.exercices.map((exo, index) => (
                <li key={index} style={{ display: "inline-flex" }}>
                  {exo.name}
                  {index !== workout.exercices.length - 1 && (
                    <span>,&nbsp;</span>
                  )}
                </li>
              ))}
          </ul>
          <div className="">
            <h3>Performances:</h3>
            <h4>by date :</h4>
            {workout.perf ? (
              Object.entries(workout.perf)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .map(([date, perfData], index) => (
                  <div key={index} className="container-date-perf">
                    <h4
                      style={{
                        marginLeft: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconOpen
                        show={showPerf[date] || false}
                        setShow={(show: boolean) =>
                          setShowPerf((prev) => ({ ...prev, [date]: show }))
                        }
                      />{" "}
                      {date}{" "}
                    </h4>
                    <div className="container-perf">
                      {showPerf[date] &&
                        Object.entries(perfData)
                          .filter(([key]) => key !== "noteExo")
                          .sort((a, b) => a[1].exoOrder - b[1].exoOrder)
                          .map(([exerciseId, exerciseData], index) => {
                            const exercise =
                              workout.exercices[exerciseData.exoOrder];
                            return (
                              <div key={index} className="container-exo">
                                <h4>{exercise.name}</h4>
                                <table>
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>Wei.</th>
                                      <th>Reps</th>
                                      <th>Rest</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[...Array(3)].map((_, i) => (
                                      <tr key={i}>
                                        <td>{i + 1}-</td>
                                        <td>
                                          {exerciseData[`weight${i}`]}
                                          {exerciseData[
                                            `weight-unilateral${i}`
                                          ] && (
                                            <>
                                              -
                                              {
                                                exerciseData[
                                                  `weight-unilateral${i}`
                                                ]
                                              }
                                            </>
                                          )}
                                        </td>
                                        <td>
                                          {exerciseData[`reps${i}`]}
                                          {exerciseData[
                                            `reps-unilateral${i}`
                                          ] && (
                                            <>
                                              -
                                              {
                                                exerciseData[
                                                  `reps-unilateral${i}`
                                                ]
                                              }
                                            </>
                                          )}
                                        </td>
                                        <td>{exerciseData[`int${i}`]}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {perfData.noteExo && (
                                  <p>Note : {perfData.noteExo[exerciseId]}</p>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                ))
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

export default page;

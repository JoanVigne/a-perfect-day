import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { sendToWorkout } from "@/firebase/db/workout";
import ModalConfirmSend from "../modals/ModalConfirmSend";
import Button from "../ui/Button";
import "./formTraining.css";
import TimeTotal from "../ui/TimeTotal";
interface Props {
  exo: any[];
  thisWorkout: any;
  setFinished: (callback: () => void) => void;
}

interface UserData {
  email: string;
  uid: string;
}

const FormTraining: React.FC<Props> = ({ exo, thisWorkout, setFinished }) => {
  const [formData, setFormData] = useState<any>({});
  const { user } = useAuthContext() as { user: UserData };
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [finalTime, setFinalTime] = useState("");

  const handleInputChange =
    (exerciseId: string, seriesIndex: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prevFormData: any) => {
        const newFormData = { ...prevFormData };
        if (!newFormData[exerciseId]) {
          newFormData[exerciseId] = {
            exoOrder: Object.keys(prevFormData).length,
          };
        }
        newFormData[exerciseId][`${field}${seriesIndex}`] = e.target.value;
        return newFormData;
      });
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    perfSubmit(formData, finalTime);
  };

  async function perfSubmit(data: any, finalTime: string) {
    const date = new Date();
    const dateStr = date.toISOString().substring(0, 10);
    const perfData = { [dateStr]: data };
    const duration = { [dateStr]: finalTime };

    const updatedWorkout = {
      ...thisWorkout,
      perf: { ...thisWorkout.perf, ...perfData },
      duration: { ...thisWorkout.duration, ...duration },
    };
    console.log("duration workout :", finalTime);
    console.log("updated workout :", updatedWorkout);
    console.log("duration : ", duration);
    setFinished(() => {
      const dataWorkouts = getItemFromLocalStorage("workouts");
      if (!dataWorkouts) return console.log("no workouts in LS");
      dataWorkouts[updatedWorkout.id] = updatedWorkout;
      sendToWorkout(updatedWorkout, user.uid);
    });
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  return (
    <form onSubmit={handleSubmit} className="form-training">
      <div className="smaller-container">
        <TimeTotal
          isActive={isTimerActive}
          stopOnFinish={!isTimerActive}
          onTimeFinish={setFinalTime}
        />
      </div>
      <p>Rest is in minutes. exemple 1.2 for 80seconds.</p>
      {exo.map((exercise) => {
        const [numberOfSeries, setNumberOfSeries] = useState<number>(3);
        return (
          <div key={exercise.id} className="container-exo">
            <h3>{exercise.name}</h3>
            {exercise.equipmentt && <h3>equipment: {exercise.equipment}</h3>}
            <h3>
              Number of Series: {numberOfSeries}
              <div className="buttonsPlusMinusSeries">
                <button
                  type="button"
                  onClick={() =>
                    setNumberOfSeries((prevSeries) =>
                      prevSeries > 0 ? prevSeries - 1 : 0
                    )
                  }
                >
                  --
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNumberOfSeries((prevSeries) => prevSeries + 1)
                  }
                >
                  ++
                </button>
              </div>
            </h3>
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
                {Array.from({ length: numberOfSeries }).map(
                  (_, seriesIndex) => (
                    <tr key={seriesIndex}>
                      <td>{seriesIndex + 1}</td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          name={`weight${seriesIndex}`}
                          id={`weight${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "weight"
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          name={`reps${seriesIndex}`}
                          id={`reps${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "reps"
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          name={`interval${seriesIndex}`}
                          id={`interval${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "int"
                          )}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );
      })}
      <div className="buttons-in-line">
        <Button
          className="finish"
          type="button"
          value="Finish without saving"
          onClick={(e: any) => {
            e.preventDefault();
            setIsTimerActive(false);
            setIsModalVisible2(true);
          }}
        />
        <ModalConfirmSend
          isVisible={isModalVisible2}
          onConfirm={() => {
            setIsModalVisible2(false);
            window.location.href = "/workout";
            /*  perfSubmit(formData, finalTime); */
          }}
          onCancel={() => {
            setIsModalVisible2(false);
            setIsTimerActive(true);
          }}
          message="Are you sure you want to finish without saving your performances?"
        />
        <Button
          className="finish"
          type="button"
          value="Finish and save"
          onClick={(e: any) => {
            e.preventDefault();
            setIsTimerActive(false);
            setIsModalVisible(true);
          }}
        />
        <ModalConfirmSend
          isVisible={isModalVisible}
          onConfirm={() => {
            setIsModalVisible(false);
            perfSubmit(formData, finalTime);
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setIsTimerActive(true);
          }}
          message="Are you sure you want to finish your wokrout now and save the performances?"
        />
      </div>
    </form>
  );
};

export default FormTraining;

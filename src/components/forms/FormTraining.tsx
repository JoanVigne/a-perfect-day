import Icon from "@/components/ui/Icon";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { sendToWorkout } from "@/firebase/db/workout";
import ModalConfirmSend from "../modals/ModalConfirmSend";

interface Props {
  exo: any[];
  thisWorkout: any;
  durationWorkout: string;
  setFinished: (finished: boolean) => void;
}
interface UserData {
  email: string;
  uid: string;
}
const FormTraining: React.FC<Props> = ({
  exo,
  thisWorkout,
  durationWorkout,
  setFinished,
}) => {
  const [formData, setFormData] = useState<any>({});
  const { user } = useAuthContext() as { user: UserData };
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
    perfSubmit(formData);
  };
  async function perfSubmit(data: any) {
    const date = new Date();
    const dateStr = date.toISOString().substring(0, 10);
    const perfData = {
      [dateStr]: data,
    };
    const dataWorkout = thisWorkout;
    if (dataWorkout && dataWorkout.perf) {
      dataWorkout.perf = { ...dataWorkout.perf, ...perfData };
    } else {
      dataWorkout.perf = perfData;
    }
    const duration = {
      [dateStr]: durationWorkout,
    };
    if (dataWorkout && dataWorkout.duration) {
      dataWorkout.duration = { ...dataWorkout.duration, ...duration };
    } else {
      dataWorkout.duration = duration;
    }
    console.log("updated dataWorkout", dataWorkout);
    const dataWorkouts = getItemFromLocalStorage("workouts");
    if (!dataWorkouts) return console.log("no workouts in LS");
    dataWorkouts[dataWorkout.id] = dataWorkout;
    console.log("RESULT ::: ", dataWorkouts);

    const mess = sendToWorkout(dataWorkout, user.uid);
    console.log("mess", mess);
    setFinished(true);
  }
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <form onSubmit={handleSubmit}>
      {exo.map((exercise) => {
        const [numberOfSeries, setNumberOfSeries] = useState<number>(3);
        useEffect(() => {
          // if we got previous choice of serie for this exo, set from it
          // setNumberOfSeries(previousTime)
        }, []);
        return (
          <div key={exercise.id} className="container-exo">
            <h3>
              {exercise.name}{" "}
              <Icon nameImg="modify" onClick={() => console.log("modify")} />
            </h3>
            <h3>equipment: {exercise.equipment}</h3>
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
      {/*       <button type="submit">Finish workout</button> */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsModalVisible(true);
        }}
      >
        Finish workout
      </button>
      <ModalConfirmSend
        isVisible={isModalVisible}
        onConfirm={() => {
          setIsModalVisible(false);
          perfSubmit(formData);
        }}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      />
    </form>
  );
};

export default FormTraining;
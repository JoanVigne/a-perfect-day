import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { sendToWorkout } from "@/firebase/db/workout";
import ModalConfirmSend from "../modals/ModalConfirmSend";
import Button from "../ui/Button";
import "./formTraining.css";
import InputFormTraining from "./FormTrainingInput";
import Icon from "../ui/Icon";
import ModalCheckPerf from "../modals/ModalCheckPerf";

interface Props {
  exo: any[];
  thisWorkout: any;
  setFinished: (callback: () => void) => void;
  isTimerActive: boolean;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  finalTime: string;
  setFinalTime: React.Dispatch<React.SetStateAction<string>>;
  onStartTimer: (value: string | number, placeholder: string) => void;
}

interface UserData {
  email: string;
  uid: string;
}

const FormTraining: React.FC<Props> = ({
  exo,
  thisWorkout,
  setFinished,
  isTimerActive,
  setIsTimerActive,
  finalTime,
  setFinalTime,
  onStartTimer,
}) => {
  const [formData, setFormData] = useState<any>({});
  const { user } = useAuthContext() as { user: UserData };
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [noteExo, setNoteExo] = useState<{ [key: string]: string }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const handleNoteChange =
    (exerciseId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNoteExo((prevNoteExo) => ({
        ...prevNoteExo,
        [exerciseId]: event.target.value,
      }));
    };

  /*   const startTimer = (value: string | number, placeholder: string) => {
    console.log("start timer");
    console.log("value ", value);
    console.log("placeholder ", placeholder);
  }; */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    perfSubmit(formData, finalTime);
  };

  async function perfSubmit(data: any, finalTime: string) {
    const perfData = { [selectedDate]: { ...data, noteExo } };
    const duration = { [selectedDate]: finalTime };
    const updatedWorkout = {
      ...thisWorkout,
      perf: { ...thisWorkout.perf, ...perfData },
      duration: { ...thisWorkout.duration, ...duration },
    };
    setFinished(() => {
      const dataWorkouts = getItemFromLocalStorage("workouts");
      if (!dataWorkouts) return console.log("no workouts in LS");
      dataWorkouts[updatedWorkout.id] = updatedWorkout;
      sendToWorkout(updatedWorkout, user.uid);
    });
  }
  // placeholder with last perf :
  const previousworkouts = getItemFromLocalStorage("workouts");
  const [lastPerf, setLastPerf] = useState<any>({});
  function findLastPerf() {
    Object.values(previousworkouts).forEach((workout: any) => {
      if (workout.id === thisWorkout.id) {
        if (workout.perf) {
          const dates = Object.keys(workout.perf).map((dateStr) =>
            new Date(dateStr).getTime()
          );
          const maxDate = new Date(Math.max.apply(null, dates));
          const maxDateStr = maxDate.toISOString().substring(0, 10);
          const lastPerf = workout.perf[maxDateStr];
          setLastPerf(lastPerf);
          if (lastPerf.noteExo) {
            setNoteExo(lastPerf.noteExo);
          }
        }
      }
    });
  }

  useEffect(() => {
    findLastPerf();
  }, [thisWorkout]);

  return (
    <form onSubmit={handleSubmit} className="form-training">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {exo.map((exercise) => {
        const [numberOfSeries, setNumberOfSeries] = useState<number>(3);
        const [isSameWeightChecked, setIsSameWeightChecked] = useState(true);
        const [isSameRepsChecked, setIsSameRepsChecked] = useState(true);
        const [isSameRestChecked, setIsSameRestChecked] = useState(true);
        useEffect(() => {
          const numberOfSeriesInLastPerf =
            lastPerf && lastPerf[exercise.id]
              ? Object.keys(lastPerf[exercise.id]).filter((key) =>
                  key.startsWith("reps")
                ).length
              : 3;

          setNumberOfSeries(numberOfSeriesInLastPerf);
        }, [lastPerf, exercise.id]);
        const handleInputChange =
          (exerciseId: string, seriesIndex: number, field: string) =>
          (e: React.ChangeEvent<HTMLInputElement>) => {
            const key = `${exerciseId}-${field}${seriesIndex}`;
            let value = e.target.value;
            // Replace "," with "."
            value = value.replace(/,/g, ".");

            setInputValues((prevInputValues: any) => ({
              ...prevInputValues,
              [key]: value,
            }));

            setFormData((prevFormData: any) => {
              const newFormData = { ...prevFormData };
              if (!newFormData[exerciseId]) {
                newFormData[exerciseId] = {
                  exoOrder: Object.keys(prevFormData).length,
                };
              }
              newFormData[exerciseId][`${field}${seriesIndex}`] = value;
              return newFormData;
            });

            if (seriesIndex === 0) {
              if (
                (field === "weight" && isSameWeightChecked) ||
                (field === "reps" && isSameRepsChecked) ||
                (field === "int" && isSameRestChecked)
              ) {
                for (let i = 1; i < numberOfSeries; i++) {
                  const otherKey = `${exerciseId}-${field}${i}`;
                  setInputValues((prevInputValues: any) => ({
                    ...prevInputValues,
                    [otherKey]: value,
                  }));
                }
              }
            }
          };
        const [unilateral, setUnilateral] = useState<boolean>(false);
        const [showModalCheckPerf, setShowModalCheckPerf] = useState(false);
        useEffect(() => {
          if (
            lastPerf[exercise.id] &&
            lastPerf[exercise.id][`weight-unilateral0`]
          ) {
            setUnilateral(true);
          }
        }, [lastPerf, exercise.id]);
        const validatePlaceholder = (
          exerciseId: string,
          seriesIndex: number,
          field: string
        ) => {
          const key = `${exerciseId}-${field}${seriesIndex}`;
          const newValue =
            lastPerf[exerciseId] &&
            lastPerf[exerciseId][`${field}${seriesIndex}`]
              ? lastPerf[exerciseId][`${field}${seriesIndex}`]
              : "";
          if (!inputValues[key]) {
            setInputValues((prevInputValues: any) => ({
              ...prevInputValues,
              [key]: newValue,
            }));

            setFormData((prevFormData: any) => {
              const newFormData = { ...prevFormData };
              if (!newFormData[exerciseId]) {
                newFormData[exerciseId] = {
                  exoOrder: Object.keys(prevFormData).length,
                };
              }
              newFormData[exerciseId][`${field}${seriesIndex}`] = newValue;
              return newFormData;
            });
          }
        };

        return (
          <div key={exercise.id} className="container-exo">
            <ModalCheckPerf
              isVisible={showModalCheckPerf}
              close={() => setShowModalCheckPerf(false)}
              perf={showModalCheckPerf && exercise?.name}
              perfid={showModalCheckPerf && exercise?.id}
              workoutid={showModalCheckPerf && thisWorkout.id}
            />
            <h3>
              <button
                type="button"
                className="unilateral-button"
                onClick={() => setShowModalCheckPerf(true)}
              >
                previous perf
              </button>
              {exercise.name}
              <button
                className="unilateral-button"
                type="button"
                onClick={() => setUnilateral(!unilateral)}
              >
                uni lateral?
              </button>
            </h3>
            {exercise.equipmentt && <h3>equipment: {exercise.equipment}</h3>}
            <table>
              <thead>
                <tr>
                  <th>Serie </th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>Rest (ex:1.3)</th>
                </tr>
                <tr>
                  <th>
                    {" "}
                    <div className="buttonsPlusMinusSeries">
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfSeries((prevSeries) =>
                            prevSeries > 0 ? prevSeries - 1 : 0
                          )
                        }
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfSeries((prevSeries) => prevSeries + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </th>
                  <th>
                    <label htmlFor="same-weight" className="same-label"></label>
                    <input
                      type="checkbox"
                      name="same-weight"
                      id="same-weight"
                      className="same-checkbox"
                      checked={isSameWeightChecked}
                      onChange={(e) => setIsSameWeightChecked(e.target.checked)}
                    />
                  </th>
                  <th>
                    <label htmlFor="same-reps" className="same-label"></label>
                    <input
                      type="checkbox"
                      name="same-reps"
                      id="same-reps"
                      className="same-checkbox"
                      checked={isSameRepsChecked}
                      onChange={(e) => setIsSameRepsChecked(e.target.checked)}
                    />
                  </th>
                  <th>
                    <label htmlFor="same-rest" className="same-label"></label>
                    <input
                      type="checkbox"
                      name="same-rest"
                      id="same-rest"
                      className="same-checkbox"
                      checked={isSameRestChecked}
                      onChange={(e) => setIsSameRestChecked(e.target.checked)}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numberOfSeries }).map(
                  (_, seriesIndex) => (
                    <tr key={seriesIndex}>
                      <td>{seriesIndex + 1}</td>
                      <td className="container-input-unilateral">
                        <InputFormTraining
                          type="number"
                          step="0.01"
                          name={`weight${seriesIndex}`}
                          id={`weight${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "weight"
                          )}
                          value={
                            inputValues[
                              `${exercise.id}-weight${seriesIndex}`
                            ] || ""
                          }
                          placeholder={
                            lastPerf[exercise.id] &&
                            lastPerf[exercise.id][`weight${seriesIndex}`]
                          }
                          lastPerf={
                            lastPerf[exercise.id] &&
                            lastPerf[exercise.id][`weight${seriesIndex}`]
                          }
                          onClick={() =>
                            validatePlaceholder(
                              exercise.id,
                              seriesIndex,
                              "weight"
                            )
                          }
                          onStartTimer={onStartTimer}
                        />
                        {unilateral && (
                          <InputFormTraining
                            type="number"
                            step="0.01"
                            name={`weight${seriesIndex}-unilateral`}
                            id={`weight${seriesIndex}-unilateral`}
                            onChange={handleInputChange(
                              exercise.id,
                              seriesIndex,
                              "weight-unilateral"
                            )}
                            value={
                              inputValues[
                                `${exercise.id}-weight-unilateral${seriesIndex}`
                              ] || ""
                            }
                            placeholder={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][
                                `weight-unilateral${seriesIndex}`
                              ]
                            }
                            lastPerf={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][
                                `weight-unilateral${seriesIndex}`
                              ]
                            }
                            onClick={() =>
                              validatePlaceholder(
                                exercise.id,
                                seriesIndex,
                                "weight-unilateral"
                              )
                            }
                            onStartTimer={onStartTimer}
                          />
                        )}
                      </td>
                      <td className="container-input-unilateral">
                        <InputFormTraining
                          type="number"
                          step="0.01"
                          name={`reps${seriesIndex}`}
                          id={`reps${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "reps"
                          )}
                          value={
                            inputValues[`${exercise.id}-reps${seriesIndex}`] ||
                            ""
                          }
                          placeholder={
                            lastPerf[exercise.id] &&
                            lastPerf[exercise.id][`reps${seriesIndex}`]
                          }
                          lastPerf={
                            lastPerf[exercise.id] &&
                            lastPerf[exercise.id][`reps${seriesIndex}`]
                          }
                          onClick={() =>
                            validatePlaceholder(
                              exercise.id,
                              seriesIndex,
                              "reps"
                            )
                          }
                          onStartTimer={onStartTimer}
                        />
                        {unilateral && (
                          <InputFormTraining
                            type="number"
                            step="0.01"
                            name={`reps${seriesIndex}-unilateral`}
                            id={`reps${seriesIndex}-unilateral`}
                            onChange={handleInputChange(
                              exercise.id,
                              seriesIndex,
                              "reps-unilateral"
                            )}
                            value={
                              inputValues[
                                `${exercise.id}-reps-unilateral${seriesIndex}`
                              ] || ""
                            }
                            placeholder={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][
                                `reps-unilateral${seriesIndex}`
                              ]
                            }
                            lastPerf={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][
                                `reps-unilateral${seriesIndex}`
                              ]
                            }
                            onClick={() =>
                              validatePlaceholder(
                                exercise.id,
                                seriesIndex,
                                "reps-unilateral"
                              )
                            }
                            onStartTimer={onStartTimer}
                          />
                        )}
                      </td>
                      <td className="container-input-unilateral">
                        <InputFormTraining
                          type="number"
                          step="0.01"
                          name={`interval${seriesIndex}`}
                          id={`interval${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "int"
                          )}
                          value={
                            inputValues[`${exercise.id}-int${seriesIndex}`] ||
                            ""
                          }
                          placeholder={
                            lastPerf[exercise.id] &&
                            lastPerf[exercise.id][`int${seriesIndex}`]
                          }
                          lastPerf={
                            lastPerf[exercise.id] &&
                            lastPerf[exercise.id][`int${seriesIndex}`]
                          }
                          onClick={() =>
                            validatePlaceholder(exercise.id, seriesIndex, "int")
                          }
                          onStartTimer={onStartTimer}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="container-cleannote-note">
              <Icon
                nameImg="clean"
                onClick={() => {
                  setNumberOfSeries(3);
                  setNoteExo((prevNoteExo) => ({
                    ...prevNoteExo,
                    [exercise.id]: "",
                  }));
                }}
              />
              <input
                className="note-exo"
                placeholder={`Note about ${exercise.name}?`}
                value={
                  lastPerf[exercise.id] &&
                  lastPerf[exercise.id]["noteExo"] &&
                  lastPerf[exercise.id]["noteExo"][`exoPerso${exercise.name}`]
                    ? lastPerf[exercise.id]["noteExo"][
                        `exoPerso${exercise.name}`
                      ]
                    : noteExo[exercise.id] || ""
                }
                onChange={handleNoteChange(exercise.id)}
              />
            </div>
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
          message="Are you sure you want to finish your workout now and save the performances?"
        />
      </div>
    </form>
  );
};

export default FormTraining;

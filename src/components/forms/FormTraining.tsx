import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { sendToWorkout } from "@/firebase/db/workout";
import ModalConfirmSend from "../modals/ModalConfirmSend";
import Button from "../ui/Button";
import "./formTraining.css";
import TimeTotal from "../ui/TimeTotal";
import Icon from "../ui/Icon";
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
  const [noteExo, setNoteExo] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const handleNoteChange =
    (exerciseId: string) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNoteExo((prevNoteExo) => ({
        ...prevNoteExo,
        [exerciseId]: event.target.value,
      }));
    };
  const handleInputChange =
    (exerciseId: string, seriesIndex: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = `${exerciseId}-${field}${seriesIndex}`;
      const value = e.target.value;
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
      setInputValues((prevInputValues: any) => ({
        ...prevInputValues,
        [key]: value,
      }));
    };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    perfSubmit(formData, finalTime);
  };

  async function perfSubmit(data: any, finalTime: string) {
    const date = new Date();
    const dateStr = date.toISOString().substring(0, 10);
    const perfData = { [dateStr]: { ...data, noteExo } };
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
  // placeholder with last perf :
  const previousworkouts = getItemFromLocalStorage("workouts");
  const [lastPerf, setLastPerf] = useState<any>({});
  function findLastPerf() {
    console.log("previous workouts :", previousworkouts);
    console.log("thisWorkout :", thisWorkout);
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
          console.log("lastperf :", lastPerf);
        }
      }
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
      <button className="show-last-perf" type="button" onClick={findLastPerf}>
        show my last performance in the form
      </button>
      {lastPerf && (
        <p>
          If you did the same perf as it's written in the input, validate the
          value with the button
        </p>
      )}
      <p>Rest is in minutes. exemple 1.2 for 80seconds.</p>
      {exo.map((exercise) => {
        const [numberOfSeries, setNumberOfSeries] = useState<number>(3);
        const [unilateral, setUnilateral] = useState<boolean>(false);
        const validatePlaceholder = (
          exerciseId: string,
          seriesIndex: number,
          field: string
        ) => {
          const key = `${exerciseId}-${field}${seriesIndex}`;
          setInputValues((prevInputValues: any) => {
            const newInputValues = { ...prevInputValues };
            if (
              lastPerf[exerciseId] &&
              lastPerf[exerciseId][`${field}${seriesIndex}`]
            ) {
              newInputValues[key] =
                lastPerf[exerciseId][`${field}${seriesIndex}`];
            }
            return newInputValues;
          });
        };
        return (
          <div key={exercise.id} className="container-exo">
            <h3>
              {exercise.name}
              <button type="button" onClick={() => setUnilateral(!unilateral)}>
                unilateral?
              </button>
            </h3>
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
                  <th>Rest (ex:1.3)</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numberOfSeries }).map(
                  (_, seriesIndex) => (
                    <tr key={seriesIndex}>
                      <td>{seriesIndex + 1}</td>
                      <td className="container-input-unilateral">
                        <div className="input-validation">
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
                            value={
                              inputValues[
                                `${exercise.id}-weight${seriesIndex}`
                              ] === undefined ||
                              inputValues[
                                `${exercise.id}-weight${seriesIndex}`
                              ] === null
                                ? ""
                                : inputValues[
                                    `${exercise.id}-weight${seriesIndex}`
                                  ]
                            }
                            placeholder={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][`weight${seriesIndex}`]
                                ? lastPerf[exercise.id][`weight${seriesIndex}`]
                                : ""
                            }
                          />
                          {lastPerf[exercise.id] &&
                          lastPerf[exercise.id][`weight${seriesIndex}`] ? (
                            <Icon
                              nameImg={
                                inputValues[
                                  `${exercise.id}-weight${seriesIndex}`
                                ]
                                  ? "validation-white"
                                  : "validation"
                              }
                              onClick={() =>
                                validatePlaceholder(
                                  exercise.id,
                                  seriesIndex,
                                  "weight"
                                )
                              }
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        {unilateral && (
                          <div className="input-validation">
                            <input
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
                                  `${exercise.id}-weight${seriesIndex}-unilateral`
                                ] === undefined ||
                                inputValues[
                                  `${exercise.id}-weight${seriesIndex}-unilateral`
                                ] === null
                                  ? ""
                                  : inputValues[
                                      `${exercise.id}-weight${seriesIndex}-unilateral`
                                    ]
                              }
                              placeholder={
                                lastPerf[exercise.id] &&
                                lastPerf[exercise.id][
                                  `weight${seriesIndex}-unilateral`
                                ]
                                  ? lastPerf[exercise.id][
                                      `weight${seriesIndex}-unilateral`
                                    ]
                                  : ""
                              }
                            />
                            {lastPerf[exercise.id] &&
                            lastPerf[exercise.id][
                              `weight${seriesIndex}-unilateral`
                            ] ? (
                              <Icon
                                nameImg={
                                  inputValues[
                                    `${exercise.id}-weight-unilateral${seriesIndex}`
                                  ]
                                    ? "validation-white"
                                    : "validation"
                                }
                                onClick={() =>
                                  validatePlaceholder(
                                    exercise.id,
                                    seriesIndex,
                                    "weight-unilateral"
                                  )
                                }
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                      </td>
                      <td className="container-input-unilateral">
                        <div className="input-validation">
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
                            value={
                              inputValues[
                                `${exercise.id}-reps${seriesIndex}`
                              ] === undefined ||
                              inputValues[
                                `${exercise.id}-reps${seriesIndex}`
                              ] === null
                                ? ""
                                : inputValues[
                                    `${exercise.id}-reps${seriesIndex}`
                                  ]
                            }
                            placeholder={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][`reps${seriesIndex}`]
                                ? lastPerf[exercise.id][`reps${seriesIndex}`]
                                : ""
                            }
                          />
                          {lastPerf[exercise.id] &&
                          lastPerf[exercise.id][`reps${seriesIndex}`] ? (
                            <Icon
                              nameImg={
                                inputValues[`${exercise.id}-reps${seriesIndex}`]
                                  ? "validation-white"
                                  : "validation"
                              }
                              onClick={() =>
                                validatePlaceholder(
                                  exercise.id,
                                  seriesIndex,
                                  "reps"
                                )
                              }
                            />
                          ) : (
                            ""
                          )}
                        </div>

                        {unilateral && (
                          <div className="input-validation">
                            <input
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
                                  `${exercise.id}-reps${seriesIndex}-unilateral`
                                ] === undefined ||
                                inputValues[
                                  `${exercise.id}-reps${seriesIndex}-unilateral`
                                ] === null
                                  ? ""
                                  : inputValues[
                                      `${exercise.id}-reps${seriesIndex}-unilateral`
                                    ]
                              }
                              placeholder={
                                lastPerf[exercise.id] &&
                                lastPerf[exercise.id][
                                  `reps${seriesIndex}-unilateral`
                                ]
                                  ? lastPerf[exercise.id][
                                      `reps${seriesIndex}-unilateral`
                                    ]
                                  : ""
                              }
                            />
                            {lastPerf[exercise.id] &&
                            lastPerf[exercise.id][
                              `reps${seriesIndex}-unilateral`
                            ] ? (
                              <Icon
                                nameImg={
                                  inputValues[
                                    `${exercise.id}-reps-unilateral${seriesIndex}`
                                  ]
                                    ? "validation-white"
                                    : "validation"
                                }
                                onClick={() =>
                                  validatePlaceholder(
                                    exercise.id,
                                    seriesIndex,
                                    "reps-unilateral"
                                  )
                                }
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                      </td>
                      <td className="container-input-unilateral">
                        <div className="input-validation">
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
                            value={
                              inputValues[
                                `${exercise.id}-int${seriesIndex}`
                              ] === undefined ||
                              inputValues[
                                `${exercise.id}-int${seriesIndex}`
                              ] === null
                                ? ""
                                : inputValues[
                                    `${exercise.id}-int${seriesIndex}`
                                  ]
                            }
                            placeholder={
                              lastPerf[exercise.id] &&
                              lastPerf[exercise.id][`int${seriesIndex}`]
                                ? lastPerf[exercise.id][`int${seriesIndex}`]
                                : ""
                            }
                          />
                          {lastPerf[exercise.id] &&
                          lastPerf[exercise.id][`int${seriesIndex}`] ? (
                            <Icon
                              nameImg={
                                inputValues[`${exercise.id}-int${seriesIndex}`]
                                  ? "validation-white"
                                  : "validation"
                              }
                              onClick={() =>
                                validatePlaceholder(
                                  exercise.id,
                                  seriesIndex,
                                  "int"
                                )
                              }
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <textarea
              className="note-exo"
              placeholder="something to note about this exercice?"
              value={noteExo[exercise.id] || ""}
              onChange={handleNoteChange(exercise.id)}
            ></textarea>
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

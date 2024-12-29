import Icon from "@/components/ui/Icon";
import { useAuthContext } from "@/context/AuthContext";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { useEffect, useState } from "react";
import ModalCheckPerf from "@/components/modals/ModalCheckPerf";
import "./formTraining.css";
import InputNumbers from "./InputNumbers";
import { sendToWorkout } from "@/firebase/db/workout";
import ModalConfirmSend from "@/components/modals/ModalConfirmSend";
import ReactModal from "react-modal";
import IconOpen from "@/components/ui/IconOpen";
import TextAreaNoteExo from "./TextAreaNoteExo";
import ModalModifyRunningWorkout from "./ModalModifyRunningWorkout";

interface Props {
  thisWorkout: any;
  setFinished: (callback: () => void) => void;
  finalTime: string;
  onStartTimer: (value: number, placeholder: string) => void;
}
interface UserData {
  email: string;
  uid: string;
}
const FormTrain: React.FC<Props> = ({
  thisWorkout,
  setFinished,
  finalTime,
  onStartTimer,
}) => {
  const { user } = useAuthContext() as { user: UserData };
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [actualWorkout, setActualWorkout] = useState<any>(thisWorkout);

  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [noteExo, setNoteExo] = useState<{ [key: string]: string }>({});
  const handleNoteChange =
    (exerciseId: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setNoteExo((prevNoteExo) => ({
        ...prevNoteExo,
        [exerciseId]: value,
      }));
    };
  const [confirmation, setConfirmation] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  // placeholder with last perf :
  const previousworkouts = getItemFromLocalStorage("workouts");

  const [lastPerf, setLastPerf] = useState<any>({});
  function findLastPerf() {
    Object.values(previousworkouts).forEach((workout: any) => {
      if (workout.id === actualWorkout.id && workout.perf) {
        const dates = Object.keys(workout.perf).map((dateStr) =>
          new Date(dateStr).getTime()
        );
        const maxDate = new Date(Math.max.apply(null, dates));
        const maxDateStr = maxDate.toISOString().substring(0, 10);
        const lastPerf = workout.perf[maxDateStr];
        let adjustedLastPerf: { [key: string]: any } = {};
        for (const key in lastPerf) {
          if (key.startsWith("exoPerso")) {
            let newKey = key;
            adjustedLastPerf[newKey] = {
              ...lastPerf[key],
              exoOrder: lastPerf[key].exoOrder.toString(), // Convert exoOrder to a string
            };
          }
        }
        adjustedLastPerf.noteExo = lastPerf.noteExo;
        setLastPerf(adjustedLastPerf);
        if (adjustedLastPerf.noteExo) {
          setNoteExo(adjustedLastPerf.noteExo);
        }
      }
    });
  }
  useEffect(() => {
    findLastPerf();
  }, [thisWorkout]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!navigator.onLine) {
      alert(
        "No internet connection. Please check your connection and try again."
      );
      return;
    }
    const form = event.currentTarget;
    let data: { [key: string]: any } = {};
    let exoId = "";
    let exoOrder = "";

    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i] as HTMLInputElement;
      if (element.name === "exoId") {
        exoId = element.value;
        continue;
      }
      if (element.name === "exoOrder") {
        exoOrder = element.value;
        continue;
      }
      if (element.type !== "checkbox" && element.value) {
        //! modif !!
        const property = element.name;

        if (!data[exoId]) {
          data[exoId] = { exoOrder: exoOrder };
        }
        if (exoId) {
          data[exoId][property] = element.value;
        }
      }
    }
    // Remove empty objects
    for (const key in data) {
      if (!Object.values(data[key]).some((x) => x !== null && x !== "")) {
        delete data[key];
      }
    }
    // Check if there's at least one exercise for the selected date
    if (Object.keys(data).length > 0) {
      perfSubmit(data, finalTime);
    } else {
      console.log("No exercises for the selected date");
    }
  };

  async function perfSubmit(data: any, finalTime: string) {
    const fireIcons = document.getElementsByClassName("icon fire");
    const fireIconCount = fireIcons.length;
    const perfData = { [selectedDate]: { ...data, noteExo } };
    const duration = { [selectedDate]: finalTime };
    const updatedWorkout = {
      ...actualWorkout,
      perf: { ...actualWorkout.perf, ...perfData },
      numbImprovement: {
        ...actualWorkout.numbImprovement,
        ...{ [selectedDate]: fireIconCount },
      },
      duration: { ...actualWorkout.duration, ...duration },
    };

    console.log("Updated workout: ", updatedWorkout);
    setFinished(() => {
      const dataWorkouts = getItemFromLocalStorage("workouts");
      if (!dataWorkouts) return console.log("no workouts in LS");
      dataWorkouts[updatedWorkout.id] = updatedWorkout;
      localStorage.setItem("workouts", JSON.stringify(dataWorkouts));
      sendToWorkout(updatedWorkout, user.uid);
    });
  }
  const [numberOfSeries, setNumberOfSeries] = useState<{
    [key: string]: number;
  }>({});
  useEffect(() => {
    if (actualWorkout) {
      const seriesCount: { [key: string]: number } = {};
      actualWorkout.exercices.forEach((exercise: any) => {
        const numberOfSeriesInLastPerf =
          lastPerf && lastPerf[exercise.id]
            ? Object.keys(lastPerf[exercise.id]).filter(
                (key) => key.startsWith("reps") && !key.includes("unilateral")
              ).length
            : 3;
        seriesCount[exercise.id] =
          numberOfSeriesInLastPerf === 0 ? 1 : numberOfSeriesInLastPerf;
      });
      setNumberOfSeries(seriesCount);
    }
  }, [lastPerf, actualWorkout]);

  const [showModalCheckPerf, setShowModalCheckPerf] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const handleShowModal = (exercise: any) => {
    setSelectedExercise(exercise);
  };
  useEffect(() => {
    if (selectedExercise) {
      setShowModalCheckPerf(true);
    }
  }, [selectedExercise]);

  const [exoOpen, setExoOpen] = useState<{ [key: string]: boolean }>({});
  const handleExoOpen = (exerciseId: string) => {
    setExoOpen((prevState) => ({
      ...prevState,
      [exerciseId]: !prevState[exerciseId],
    }));
  };
  // maj du workout quand on modif le workout
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const dataWorkouts = getItemFromLocalStorage("workouts");
    if (!dataWorkouts) return console.log("no workouts in LS");
    setActualWorkout(dataWorkouts[thisWorkout.id]);
  }, [modalOpen]);
  return (
    <form onSubmit={submit} className="form-training">
      <h1 style={{ marginTop: "100px" }}>
        <Icon nameImg="modify" onClick={() => setModalOpen(true)} />
        {actualWorkout.name}
      </h1>
      <ModalModifyRunningWorkout
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        workoutToModify={actualWorkout}
      />
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* DEBUT EXOS  */}
      {actualWorkout &&
        actualWorkout.exercices.map((exercise: any, index: number) => {
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
            };

          const validatePlaceholder = (
            exerciseId: string,
            seriesIndex: number,
            field: string
          ) => {
            const isUnilateral = field.includes("unilateral");
            const adjustedField = isUnilateral
              ? field.replace("-unilateral", "")
              : field;
            const key = `${exerciseId}-${adjustedField}${seriesIndex}${
              isUnilateral ? "-unilateral" : ""
            }`;
            const newValue =
              lastPerf[exerciseId] &&
              lastPerf[exerciseId][
                `${adjustedField}${seriesIndex}${
                  isUnilateral ? "-unilateral" : ""
                }`
              ]
                ? lastPerf[exerciseId][
                    `${adjustedField}${seriesIndex}${
                      isUnilateral ? "-unilateral" : ""
                    }`
                  ]
                : "";
            if (!inputValues[key]) {
              setInputValues((prevInputValues: any) => ({
                ...prevInputValues,
                [key]: newValue,
              }));
            }
          };
          const isOpen = exoOpen[exercise.id] ?? true;
          return (
            <div
              key={exercise.id}
              className={isOpen ? "container-exo" : "container-exo closed"}
            >
              {showModalCheckPerf && selectedExercise && (
                <ModalCheckPerf
                  isVisible={showModalCheckPerf}
                  close={() => setShowModalCheckPerf(false)}
                  perf={selectedExercise.name}
                  perfid={selectedExercise.id}
                  workoutid={actualWorkout.id}
                  allWorkouts={previousworkouts}
                />
              )}
              <h3>
                <div>
                  <IconOpen
                    show={isOpen}
                    setShow={() => handleExoOpen(exercise.id)}
                  />
                  {exercise.name}
                </div>
                <button
                  type="button"
                  className="previous-perf"
                  onClick={() => handleShowModal(exercise)}
                >
                  previous perf
                </button>
                <input type="hidden" name="exoId" value={exercise.id} />
                <input type="hidden" name="exoOrder" value={index} />
              </h3>
              <div className="container-cleannote-note">
                <Icon
                  nameImg="clean"
                  onClick={() => {
                    setNoteExo((prevNoteExo) => ({
                      ...prevNoteExo,
                      [exercise.id]: "",
                    }));
                  }}
                />
                <TextAreaNoteExo
                  exercise={exercise}
                  noteExo={noteExo}
                  lastPerf={lastPerf}
                  handleNoteChange={handleNoteChange}
                />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Serie </th>
                    <th>Weight</th>
                    <th>Reps</th>
                    <th>Rest (ex:1.3)</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: numberOfSeries[exercise.id] ?? 3 }).map(
                    (_, seriesIndex) => {
                      const handleIncrement = (
                        seriesIndex: number,
                        field: string
                      ) => {
                        const isUnilateral = field.includes("unilateral");
                        const adjustedField = isUnilateral
                          ? field.replace("-unilateral", "")
                          : field;
                        const key = `${
                          exercise.id
                        }-${adjustedField}${seriesIndex}${
                          isUnilateral ? "-unilateral" : ""
                        }`;
                        const placeholder =
                          lastPerf[exercise.id] &&
                          lastPerf[exercise.id][
                            `${adjustedField}${seriesIndex}${
                              isUnilateral ? "-unilateral" : ""
                            }`
                          ];
                        const currentValue =
                          Number(inputValues[key]) || Number(placeholder) || 0;
                        const newValue = currentValue + 1;
                        setInputValues((prevInputValues) => ({
                          ...prevInputValues,
                          [key]: newValue,
                        }));
                      };
                      const weightFulfilled =
                        !!inputValues[
                          `${exercise.id}-weight${seriesIndex + 1}`
                        ];
                      const repsFulfilled =
                        !!inputValues[`${exercise.id}-reps${seriesIndex + 1}`];
                      const intervalFulfilled =
                        !!inputValues[
                          `${exercise.id}-interval${seriesIndex + 1}`
                        ];

                      const isNextSeriesFulfilled =
                        seriesIndex + 1 < (numberOfSeries[exercise.id] ?? 3) &&
                        ((weightFulfilled && repsFulfilled) ||
                          (weightFulfilled && intervalFulfilled) ||
                          (repsFulfilled && intervalFulfilled));
                      const isSeriesFulfilled =
                        isNextSeriesFulfilled ||
                        (inputValues[`${exercise.id}-weight${seriesIndex}`] &&
                          inputValues[`${exercise.id}-reps${seriesIndex}`] &&
                          inputValues[`${exercise.id}-interval${seriesIndex}`]);

                      return (
                        <tr
                          key={seriesIndex}
                          className={isSeriesFulfilled ? "fulfilled" : ""}
                        >
                          {seriesIndex === 0 && (
                            <td className="buttonsPlusMinusSeries">
                              <Icon
                                nameImg="plus-one"
                                onClick={() =>
                                  setNumberOfSeries((prevSeries) => ({
                                    ...prevSeries,
                                    [exercise.id]:
                                      prevSeries[exercise.id] > 0
                                        ? prevSeries[exercise.id] + 1
                                        : 0,
                                  }))
                                }
                              />
                            </td>
                          )}
                          {seriesIndex !== 0 &&
                            seriesIndex !==
                              (numberOfSeries[exercise.id] ?? 3) - 1 && (
                              <td></td>
                            )}
                          {(numberOfSeries[exercise.id] ?? 3) > 1 &&
                            seriesIndex ===
                              (numberOfSeries[exercise.id] ?? 3) - 1 && (
                              <td className="buttonsPlusMinusSeries">
                                <Icon
                                  nameImg="minus-one"
                                  onClick={() =>
                                    setNumberOfSeries((prevSeries) => ({
                                      ...prevSeries,
                                      [exercise.id]:
                                        prevSeries[exercise.id] > 0
                                          ? prevSeries[exercise.id] - 1
                                          : 0,
                                    }))
                                  }
                                />
                              </td>
                            )}

                          <td className="container-input-unilateral">
                            <InputNumbers
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
                                (lastPerf &&
                                  lastPerf[exercise.id] &&
                                  lastPerf[exercise.id][
                                    `weight${seriesIndex}`
                                  ]) ||
                                ""
                              }
                              onClick={() =>
                                validatePlaceholder(
                                  exercise.id,
                                  seriesIndex,
                                  "weight"
                                )
                              }
                              onStartTimer={onStartTimer}
                              onIncrement={() =>
                                handleIncrement(seriesIndex, "weight")
                              }
                            />
                          </td>
                          <td className="container-input-unilateral">
                            <InputNumbers
                              type="number"
                              step="0.5"
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
                                ] || ""
                              }
                              placeholder={
                                (lastPerf &&
                                  lastPerf[exercise.id] &&
                                  lastPerf[exercise.id][
                                    `reps${seriesIndex}`
                                  ]) ||
                                ""
                              }
                              onClick={() =>
                                validatePlaceholder(
                                  exercise.id,
                                  seriesIndex,
                                  "reps"
                                )
                              }
                              onStartTimer={onStartTimer}
                              onIncrement={() =>
                                handleIncrement(seriesIndex, "reps")
                              }
                            />
                          </td>
                          <td className="container-input-unilateral">
                            <InputNumbers
                              type="number"
                              step="0.01"
                              name={`interval${seriesIndex}`}
                              id={`interval${seriesIndex}`}
                              onChange={handleInputChange(
                                exercise.id,
                                seriesIndex,
                                "interval"
                              )}
                              value={
                                inputValues[
                                  `${exercise.id}-interval${seriesIndex}`
                                ] || ""
                              }
                              placeholder={
                                (lastPerf &&
                                  lastPerf[exercise.id] &&
                                  lastPerf[exercise.id][
                                    `interval${seriesIndex}`
                                  ]) ||
                                ""
                              }
                              onClick={() =>
                                validatePlaceholder(
                                  exercise.id,
                                  seriesIndex,
                                  "interval"
                                )
                              }
                              onStartTimer={onStartTimer}
                              onIncrement={() =>
                                handleIncrement(seriesIndex, "interval")
                              }
                            />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      {/* END EXOS  */}
      <div className="container-finish">
        <button
          className="finish"
          type="button"
          onClick={() => setConfirmQuit(true)}
        >
          Quit
        </button>
        <ModalConfirmSend
          isVisible={confirmQuit}
          onConfirm={() => (window.location.href = "/workout")}
          onCancel={() => setConfirmQuit(false)}
          message={"Are you sure you want to quit without saving?"}
        />
        <button
          className="finish"
          type="button"
          onClick={() => setConfirmation(true)}
        >
          Finish and save
        </button>
      </div>
      <ReactModal
        className="confirmModal"
        isOpen={confirmation}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <p>Do you wanna finish your workout and record what you achieved?</p>
        <form onSubmit={submit}>
          <button type="submit">Yes</button>
          <button type="button" onClick={() => setConfirmation(false)}>
            No
          </button>
        </form>
      </ReactModal>
    </form>
  );
};

export default FormTrain;

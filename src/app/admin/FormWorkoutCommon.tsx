import ModalDragDropExercices from "@/components/modals/ModalDragDropExercices";
import Icon from "@/components/ui/Icon";
import TemporaryMessage from "@/components/ui/TemporaryMessage";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import { sendToWorkout } from "@/firebase/db/workout";
import React, { useState } from "react";
interface Workout {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
}
const FormWorkoutCommon = () => {
  const idworkoutsToShareToAllUsers = "workoutsToShareToAllUsers";
  const [exoFromDb, setExoFromDb] = useState<any>(null);
  const [exoPerso, setExoPerso] = useState<any>([]);
  const [exercicesChosen, setExercicesChosen] = useState<any[]>([]);
  const [messageForm, setMessageForm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [workout, setWorkout] = useState<any>({});
  const [showForm, setShowForm] = useState(false);

  async function fetchExoFromDb() {
    const data = await fetchDataFromDBToLocalStorage("exercices");
    setExoFromDb(data);
  }
  function addPersoExo() {
    const persoExo = document.getElementById(
      "persoExercice"
    ) as HTMLInputElement;
    if (!persoExo.value) {
      return;
    }
    setExoPerso([...exoPerso, { name: persoExo.value }]);
    persoExo.value = "";
  }
  function submitRawWorkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name");
    if (!name) {
      setMessageForm("Name is required");
      return;
    }
    const description = formData.get("description");
    const exerciceIds = Array.from(formData.getAll("exercices")) as string[];
    const exercicesFromDb = Object.values(exoFromDb).filter((exo: any) =>
      exerciceIds.includes(exo.id)
    );
    const exoPersoSelected = exoPerso.filter((exo: any) =>
      exerciceIds.includes(exo.id)
    );
    const exercices = [...exercicesFromDb, ...exoPersoSelected];
    const id = "workout" + Math.random().toString(36);
    console.log(name, id, description, exercices);
    const rawWorkout = {
      name: name,
      id: id,
      description: description,
      exercices: exercices,
    };
    setWorkout(rawWorkout);
    setModalOpen(true);
  }
  async function submitWorkout() {
    let result = { ...(workout as Workout) };
    result.exercices = exercicesChosen;
    console.log("result", result);
    // send to db
    return;
    const mess = await sendToWorkout(result, idworkoutsToShareToAllUsers);
    console.log("mess after sendtoWokrout: ", mess);
  }
  // drag and drop
  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(exercicesChosen);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setExercicesChosen(items);
    console.log(items);
  }

  return (
    <div className="smaller-container">
      <h2>Create a common workout</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "hide form" : "show form"}
      </button>
      {showForm && (
        <form action="" onSubmit={submitRawWorkout}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description" />
          <fieldset>
            <label htmlFor="exercices">Select exercices</label>
            {exoFromDb && Object.values(exoFromDb).length <= 0 && (
              <button type="button" onClick={fetchExoFromDb}>
                See the database exercices
              </button>
            )}
            <div className="container-perso-exo">
              <label htmlFor="persoExercice">Personalyze exercice</label>
              <input type="text" name="persoExercice" id="persoExercice" />
              <Icon nameImg="add" onClick={addPersoExo} />
            </div>
            <ul className="list-exo">
              {exoFromDb &&
                [...Object.values(exoFromDb), ...exoPerso].map(
                  (exo: any, index: number) => {
                    return (
                      <li key={exo.name || index}>
                        <input
                          type="checkbox"
                          name="exercices"
                          id={exo.name || `tempExo${index}`}
                          value={exo.id || `tempExo${index}`}
                          defaultChecked={exercicesChosen.some(
                            (chosenExo: any) => chosenExo.id === exo.id
                          )}
                        />
                        <label htmlFor={exo.name || `tempExo${index}`}>
                          {exo.name || exo}
                        </label>
                      </li>
                    );
                  }
                )}
            </ul>
          </fieldset>
          <ModalDragDropExercices
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            exercicesChosen={exercicesChosen}
            handleOnDragEnd={handleOnDragEnd}
            handleContinue={submitWorkout}
          />
          <TemporaryMessage message={messageForm} timeInMS={2000} type="" />
          <button type="submit">Continue</button>
        </form>
      )}
    </div>
  );
};

export default FormWorkoutCommon;

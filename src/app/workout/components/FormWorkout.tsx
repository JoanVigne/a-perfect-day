"use client";
import TemporaryMessage from "@/components/TemporaryMessage";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FormExoOrderModal from "./FormExoOrderModal";
import { sendToWorkout } from "@/firebase/db/workout";
import { useAuthContext } from "@/context/AuthContext";

interface UserData {
  email: string;
  uid: string;
}
interface Exercice {
  name: string;
  id: string;
  description: string;
  creationDate: string;
}
interface Workout {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
}
const FormWorkout = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [exoFromDb, setExoFromDb] = useState({});
  // the workout shape :
  //workout =  randomid : { name, description, creation date, exercices: [id,id,id]. }

  async function fetchExoFromDb() {
    const data = await fetchDataFromDBToLocalStorage("exercices");
    setExoFromDb(data);
  }

  // form :
  const [messageForm, setMessageForm] = useState("");
  const [workout, setWorkout] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [exercicesChosen, setExercicesChosen] = useState([]); // [id,id,id
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
    const exercices = Object.values(exoFromDb).filter((exo: any) =>
      exerciceIds.includes(exo.id)
    );
    const id = "workout" + Math.random().toString(36);
    console.log(name, id, description, exercices);
    const rawWorkout = {
      name: name,
      id: id,
      description: description,
      exercices: exercices,
    };
    console.log("rawWorkout", rawWorkout);
    setWorkout(rawWorkout);
    setExercicesChosen(exercices as never[]);
    setModalOpen(true);
  }
  async function submitWorkout() {
    let result = { ...(workout as Workout) };
    result.exercices = exercicesChosen;
    console.log("result", result);
    // send to db
    sendToWorkout(result, user.uid);
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
    <div>
      <form action="" onSubmit={submitRawWorkout}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" />
        <label htmlFor="exercices">Select exercices</label>

        <button type="button" onClick={fetchExoFromDb}>
          {Object.values(exoFromDb).length > 0 ? "" : "See the exercices"}
        </button>

        <ul className="list-exo">
          {exoFromDb &&
            Object.values(exoFromDb).map((exo: any) => {
              return (
                <li key={exo.name}>
                  <input
                    type="checkbox"
                    name="exercices"
                    id={exo.name}
                    value={exo.id}
                  />
                  <label htmlFor={exo.name}>{exo.name}</label>
                </li>
              );
            })}
        </ul>
        <FormExoOrderModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          exercicesChosen={exercicesChosen}
          handleOnDragEnd={handleOnDragEnd}
          handleContinue={submitWorkout}
        />
        <TemporaryMessage message={messageForm} timeInMS={2000} type="" />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default FormWorkout;

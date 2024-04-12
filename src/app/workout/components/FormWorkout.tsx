"use client";
import TemporaryMessage from "@/components/TemporaryMessage";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useState } from "react";

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
    const exercices = formData.getAll("exercices");
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
  }
  function submitWorkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("workout", workout);
  }
  // drag and drop :
  let draggedExo: any;
  function dragStart(event: React.DragEvent<HTMLDivElement>) {
    draggedExo = event.currentTarget;
  }
  function dragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const closestExo = event.currentTarget;
    if (closestExo && closestExo.parentNode) {
      closestExo.parentNode.insertBefore(draggedExo, closestExo);
    }
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
        <TemporaryMessage message={messageForm} timeInMS={2000} type="" />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default FormWorkout;

"use client";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useState } from "react";

const FormWorkout = () => {
  const [exoFromDb, setExoFromDb] = useState({});
  // the workout shape :
  //workout =  randomid : { name, description, creation date, exercices: [id,id,id]. }

  async function fetchExoFromDb() {
    // fetch the exercices from the db
    const dataFromDb = await fetchDataFromDBToLocalStorage("exercices");
    console.log(dataFromDb);

    setExoFromDb(dataFromDb);
  }

  // form :
  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name");
    const description = formData.get("description");
    const exercices = formData.getAll("exercices");
    const id = "workout" + Math.random().toString(36);
    console.log(name, id, description, exercices);
  }
  return (
    <div>
      <form action="" onSubmit={submitForm}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" />
        <label htmlFor="exercices">Exercices</label>

        <button onClick={fetchExoFromDb}>
          {exoFromDb ? "" : "See the exercices"}
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

        <button type="submit">Create workout</button>
      </form>
    </div>
  );
};

export default FormWorkout;

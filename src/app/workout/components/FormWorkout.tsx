"use client";
import TemporaryMessage from "@/components/TemporaryMessage";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  // drag and drop
  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(exercicesChosen);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setExercicesChosen(items);
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
        <ReactModal
          isOpen={!!modalOpen}
          onRequestClose={() => setModalOpen(false)}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
        >
          <button onClick={() => setModalOpen(false)}>Close</button>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {exercicesChosen.map((exo: any, index: number) => (
                    <Draggable key={exo.id} draggableId={exo.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h3>{exo.name}</h3>

                          {exercicesChosen.length - 1 === index ? (
                            "End of training"
                          ) : (
                            <>
                              <label htmlFor="interval">
                                Time between series
                              </label>
                              <input
                                type="number"
                                name="interval"
                                id="interval"
                                placeholder="1.30"
                              />
                              <label htmlFor="rest">
                                Time before next exercice{" "}
                              </label>
                              <input
                                type="number"
                                name="rest"
                                id="rest"
                                placeholder="2.30"
                              />
                            </>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </ReactModal>
        <TemporaryMessage message={messageForm} timeInMS={2000} type="" />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default FormWorkout;

"use client";
import TemporaryMessage from "@/components/ui/TemporaryMessage";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { sendToWorkout } from "@/firebase/db/workout";
import { useAuthContext } from "@/context/AuthContext";
import Icon from "@/components/ui/Icon";
import "./formWorkoutCreate.css";
interface UserData {
  email: string;
  uid: string;
}
interface Exercice {
  name: string;
  id: string;
  description: string;
}
interface Workout {
  name: string;
  id: string;
  description: string;
  creationDate: string;
  exercices: string[];
}
const FormWorkoutCreate = () => {
  const { user } = useAuthContext() as { user: UserData };

  // form :
  const [messageForm, setMessageForm] = useState("");
  const [exercicesChosen, setExercicesChosen] = useState<any[]>([]);
  async function submitWorkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name");
    if (!name) {
      setMessageForm("Name is required");
      return;
    }
    const description = formData.get("description");
    const id = "workout" + Math.random().toString(36);
    const rawWorkout = {
      name: name,
      id: id,
      description: description,
      exercices: exercicesChosen,
    };

    /*     setModalOpen(true); */
    await sendToWorkout(rawWorkout, user.uid);
    window.location.reload();
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

  // perso exo :
  const [exoPerso, setExoPerso] = useState<Exercice[]>([]);
  function addPersoExo() {
    const input = document.getElementById("persoExercice") as HTMLInputElement;
    if (input.value) {
      const newExo = {
        name: input.value,
        id: `exoPerso${input.value.replace(/\s+/g, "")}${exoPerso.length}`,
        description: "Exercice created by me",
      };
      setExoPerso((prev) => [...prev, newExo]);
      setExercicesChosen((prevExos: any[]) => [...prevExos, newExo]);
      input.value = "";
    }
  }
  return (
    <div>
      <h2>Create a workout</h2>
      <form action="" onSubmit={submitWorkout}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" />
        <div>
          <div className="container-perso-exo">
            <label htmlFor="persoExercice">Add an exercice</label>
            <div className="input-and-icon">
              <input type="text" name="persoExercice" id="persoExercice" />
              <Icon nameImg="add" onClick={addPersoExo} />
            </div>
          </div>
        </div>
        <h3>Modify their order here </h3>
        <div className="drag-drop">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable
              mode="standard"
              type="DEFAULT"
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
              droppableId="exercises"
              direction="vertical"
            >
              {(provided) => (
                <>
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {exercicesChosen.map((exo: any, index: number) => (
                      <Draggable
                        key={exo.id}
                        draggableId={exo.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <span className="index">{index + 1}</span>
                            <h3>{exo.name}</h3>
                            <Icon
                              nameImg="drag"
                              onClick={() => console.log("oke")}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <TemporaryMessage message={messageForm} timeInMS={2000} type="" />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default FormWorkoutCreate;

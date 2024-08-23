import Icon from "@/components/ui/Icon";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactModal from "react-modal";
import ContainerExoList from "../../ContainerExoList";
import Button from "../../ui/Button";
import ModalConfirmSend from "@/components/modals/ModalConfirmSend";
import "./modalModifyRunningWorkout.css";

interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  workoutToModify: any;
}
interface Exercice {
  name: string;
  id: string;
  description: string;
}

const ModalModifyRunningWorkout: React.FC<Props> = ({
  modalOpen,
  setModalOpen,
  workoutToModify,
}) => {
  const [exercicesChosen, setExercicesChosen] = useState<Exercice[]>([]);
  const [exoFromDb, setExoFromDb] = useState({});
  const [name, setName] = useState(workoutToModify.name);
  const [description, setDescription] = useState(workoutToModify.description);
  const [messageCantModify, setMessageCantModify] = useState(false);
  async function fetchExoFromDb() {
    const data = await fetchDataFromDBToLocalStorage("exercices");
    setExoFromDb(data);
  }

  useEffect(() => {
    setExercicesChosen(workoutToModify.exercices);
  }, []);

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
      setExercicesChosen((prev) => [...prev, newExo]); // Add the new exercise to exercicesChosen
      input.value = "";
    }
  }
  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(exercicesChosen);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setExercicesChosen(items);
    console.log(items);
  }
  function handleExerciceCheck(exo: any, isChecked: boolean) {
    if (isChecked) {
      setExercicesChosen((prev) => [...prev, exo]);
    } else {
      setExercicesChosen((prev) => prev.filter((e) => e.id !== exo.id));
    }
  }
  function handleExerciceRemove(exo: any) {
    setExercicesChosen((prev) => prev.filter((e: Exercice) => e.id !== exo.id));
  }
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function submitModification() {
    const form = document.querySelector("form");
    if (!form) {
      console.error("Form not found");
      return;
    }
    const updatedWorkout = {
      ...workoutToModify,
      name: name,
      description: description,
      exercices: exercicesChosen,
    };
    console.log("updated workout", updatedWorkout);

    // mettre a jour le local storage
    const localstorage = JSON.parse(localStorage.getItem("workouts") || "{}");
    localstorage[updatedWorkout.id] = updatedWorkout;
    console.log("localstorage", localstorage);
    localStorage.setItem("workouts", JSON.stringify(localstorage));
    setModalOpen(false);
  }
  return (
    <ReactModal
      className="modify-workout-modal"
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <Icon nameImg="close" onClick={() => setModalOpen(false)} />
      <form onSubmit={submitModification}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        {messageCantModify ? <p>Can't modify this now</p> : ""}
        <label htmlFor="description">Description</label>
        <input
          type="text"
          value={description}
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <h3>Add more exercices ?</h3>
        <ContainerExoList
          exoFromDb={exoFromDb}
          fetchExoFromDb={fetchExoFromDb}
          exoPerso={exoPerso}
          addPersoExo={addPersoExo}
          exercicesChosen={exercicesChosen}
          onExerciceCheck={handleExerciceCheck}
        />
        <h3>Order of the exercices</h3>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="chosen-exercices"
              >
                {exercicesChosen &&
                  exercicesChosen.map((exo: any, index: number) => (
                    <Draggable key={exo.id} draggableId={exo.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {exo.name}

                          <Icon
                            nameImg="delete"
                            onClick={() => handleExerciceRemove(exo)}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="container-buttons">
          <button className="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <Button
            className="finish"
            type="button"
            value="Save modif"
            onClick={(e: any) => {
              e.preventDefault();
              setIsModalVisible(true);
            }}
          />
        </div>
      </form>

      <ModalConfirmSend
        isVisible={isModalVisible}
        onConfirm={() => {
          setIsModalVisible(false);
          submitModification();
        }}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        message="Are you sure you want to modify your workout?"
      />
    </ReactModal>
  );
};

export default ModalModifyRunningWorkout;

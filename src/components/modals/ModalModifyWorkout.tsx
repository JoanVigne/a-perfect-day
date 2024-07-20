import Icon from "@/components/ui/Icon";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactModal from "react-modal";
import ContainerExoList from "../ContainerExoList";
import "./modalModifyWorkout.css";
import ModalConfirmSend from "./ModalConfirmSend";
import Button from "../ui/Button";
import { sendToWorkout } from "@/firebase/db/workout";
import { useAuthContext } from "@/context/AuthContext";
interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  workoutToModify: any;
  duringTraining: boolean;
}
interface Exercice {
  name: string;
  id: string;
  description: string;
}
interface UserData {
  email: string;
  uid: string;
}
const ModalModifyWorkout: React.FC<Props> = ({
  modalOpen,
  setModalOpen,
  workoutToModify,
  duringTraining,
}) => {
  const { user } = useAuthContext() as { user: UserData };
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
    // send to db
    setModalOpen(false);
    const mess = await sendToWorkout(updatedWorkout, user.uid);
    console.log("mess", mess);
    //! DO I REALLY NEED THIS ?
    window.location.href = "/workout";
  }
  return (
    <ReactModal
      className="modify-workout-modal"
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <button onClick={() => setModalOpen(false)}>Close</button>
      <form onSubmit={submitModification}>
        <p>
          WARNING : If you modify something now, it is gonna restart your
          workout...
        </p>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
          readOnly={duringTraining}
          onClick={
            duringTraining
              ? () => setMessageCantModify(true)
              : () => setMessageCantModify(false)
          }
        />
        {messageCantModify ? <p>Can't modify this now</p> : ""}
        <label htmlFor="description">Description</label>
        <input
          type="text"
          value={description}
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          readOnly={duringTraining}
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
        <h3>drag and drop exercices to choose the order</h3>
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
                          {/*   <Icon
                            nameImg="drag"
                            onClick={() => console.log("dragging")}
                          /> */}
                          {exo.name}
                          {"  "}
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
        <Button
          className="finish"
          type="button"
          value="Save modif"
          onClick={(e: any) => {
            e.preventDefault();
            setIsModalVisible(true);
          }}
        />
        <button onClick={() => setModalOpen(false)}>Cancel</button>
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

export default ModalModifyWorkout;

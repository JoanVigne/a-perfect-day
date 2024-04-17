import Icon from "@/components/ui/Icon";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactModal from "react-modal";
import ContainerExoList from "../../components/ContainerExoList";

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
const ModalModifyWorkout: React.FC<Props> = ({
  modalOpen,
  setModalOpen,
  workoutToModify,
}) => {
  const [exercicesChosen, setExercicesChosen] = useState([]);
  const [exoFromDb, setExoFromDb] = useState({});
  // the workout shape :
  //workout =  randomid : { name, description, creation date, exercices: [id,id,id]. }

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
  return (
    <ReactModal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <button onClick={() => setModalOpen(false)}>Close</button>
      <form action="">
        <label htmlFor="name">Name</label>
        <input type="text" placeholder={workoutToModify.name} name="name" />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          placeholder={workoutToModify.description}
          name="description"
        />
        <h3>drag and drop exercices to chose the order</h3>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
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
                          {"  "}
                          <Icon
                            nameImg="delete"
                            onClick={() => console.log("remove")}
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
        <h3>Add more exercices ?</h3>
        <ContainerExoList />

        <button type="submit">Save modification</button>
        <button onClick={() => setModalOpen(false)}>Cancel</button>
      </form>
    </ReactModal>
  );
};

export default ModalModifyWorkout;

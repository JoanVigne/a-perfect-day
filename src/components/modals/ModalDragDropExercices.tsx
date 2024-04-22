import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactModal from "react-modal";
import "./modals.css";
import "./modalDragDropExercices.css";
interface ModalFormProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  exercicesChosen: any[];
  handleOnDragEnd: (result: any) => void;
  handleContinue: (result: any) => void;
}

const ModalDragDropExercices: React.FC<ModalFormProps> = ({
  modalOpen,
  setModalOpen,
  exercicesChosen,
  handleOnDragEnd,
  handleContinue,
}) => {
  return (
    <ReactModal
      className="drag-drop-modal"
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <button onClick={() => setModalOpen(false)}>Close</button>
      <h2>Move the exercices to choose the order</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="exercises">
          {(provided) => (
            <>
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
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
              <button onClick={handleContinue} className="finish">
                Continue
              </button>
            </>
          )}
        </Droppable>
      </DragDropContext>
    </ReactModal>
  );
};

export default ModalDragDropExercices;

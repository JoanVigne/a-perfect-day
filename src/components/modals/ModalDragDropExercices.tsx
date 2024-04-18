import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactModal from "react-modal";

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
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <button onClick={() => setModalOpen(false)}>Close</button>
      <h3>Move the exercices to chose the order</h3>
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
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button onClick={handleContinue}>Continue</button>
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </ReactModal>
  );
};

export default ModalDragDropExercices;

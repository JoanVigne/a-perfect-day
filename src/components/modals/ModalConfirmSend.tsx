import React from "react";
import ReactModal from "react-modal";

interface Props {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirmSend: React.FC<Props> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  return (
    <ReactModal
      isOpen={isVisible}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <p>Are you sure you want to finish the workout?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </ReactModal>
  );
};

export default ModalConfirmSend;

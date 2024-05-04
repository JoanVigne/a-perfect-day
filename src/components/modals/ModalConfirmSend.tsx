import React from "react";
import ReactModal from "react-modal";
import "./modals.css";

interface Props {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ModalConfirmSend: React.FC<Props> = ({
  isVisible,
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <ReactModal
      className="confirmModal"
      isOpen={isVisible}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <p>{message}</p>
      <button type="submit" onClick={onConfirm}>
        Yes
      </button>
      <button onClick={onCancel}>No</button>
    </ReactModal>
  );
};

export default ModalConfirmSend;

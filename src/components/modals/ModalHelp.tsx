import React from "react";
import ReactModal from "react-modal";
import "./modals.css";

interface Props {
  isVisible: boolean;
  close: () => void;
  messagehelp: string;
}
const ModalHelp: React.FC<Props> = ({ isVisible, close, messagehelp }) => {
  return (
    <ReactModal
      className="confirmModal"
      isOpen={isVisible}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <h2>Some explanations</h2>
      <p>{messagehelp}</p>
      <button onClick={close}>Okay</button>
    </ReactModal>
  );
};

export default ModalHelp;

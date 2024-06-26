import React, { useState } from "react";
import TemporaryMessage from "../ui/TemporaryMessage";
import Icon from "../ui/Icon";
import "./taskDisplay.css";
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  count: any;
  unit: any;
}
interface Props {
  task: Task; // task = data d'une task.
  inputCountUnit: boolean; // inputCountUnit = les entry pour changer les values
  inputAdd: boolean; // inputAdd = le button pour save ou add a une liste
  remove: boolean; // remove = display la petite corbeille
  theFunction: any; // thefunction = la functions rattaché a cette task
  removeConfirmation: any; // removeConfirmation = la fonction pour remove
  handleCountInputChange: any; // handleCountInputChange = pour changement les valeurs de counts
  handleTaskCompletionToggle: any; // handleTaskCompletionToggle = pour gerer true et false sur unit true/false
}
const TaskDisplay: React.FC<Props> = ({
  task,
  inputCountUnit,
  inputAdd,
  theFunction,
  remove,
  removeConfirmation,
  handleCountInputChange,
  handleTaskCompletionToggle,
}) => {
  const [messageAdded, setMessageAdded] = useState("");

  const [toggleDetails, settoggleDetails] = useState("hidden");
  function openDetails() {
    if (toggleDetails === "hidden") {
      settoggleDetails("active");
    } else {
      settoggleDetails("hidden");
    }
  }

  return (
    <li
      className={
        inputAdd
          ? "task"
          : task.unit === false || task.count === "0"
          ? "task"
          : "task task-done"
      }
    >
      <div className="title-inputs">
        <div className="title-details-message">
          <h4>{task.name}</h4>
          <Icon nameImg="question" onClick={() => openDetails()} />
          {/* <button onClick={openDetails} className="details">
            ?
          </button> */}
          <TemporaryMessage
            message={messageAdded}
            type="message-info"
            timeInMS={2000}
          />
        </div>
        {inputCountUnit && typeof task.unit !== "boolean" && (
          <div className="count">
            <div className="container-count-unit">
              <input
                type="number"
                id={"count-" + task.id}
                name={"count-" + task.id}
                placeholder={task.count}
                onChange={
                  (e) => handleCountInputChange(task.id, e.target.value) // Appel de la fonction à partir de la prop
                }
              />
              <p className="unit">{task.unit}</p>
            </div>
            <button
              className="save"
              onClick={() => {
                theFunction(), setMessageAdded("saved !");
              }}
            >
              save
            </button>
          </div>
        )}
        {inputCountUnit && typeof task.unit === "boolean" && (
          <div className="count">
            <button
              onClick={() => {
                handleTaskCompletionToggle(task.id);
              }}
              className={task.unit === false ? "save" : "undo"}
            >
              {task.unit === false ? "Done?" : "undo"}
            </button>
          </div>
        )}
        {inputAdd && (
          <Icon
            nameImg="add"
            onClick={() => {
              theFunction(task), setMessageAdded("added !");
            }}
          />
        )}
      </div>
      <div className={toggleDetails}>
        <h4>{task.description}</h4>
        <p>{task.details}</p>
        {remove && <Icon nameImg="red-bin" onClick={removeConfirmation} />}
      </div>
    </li>
  );
};

export default TaskDisplay;

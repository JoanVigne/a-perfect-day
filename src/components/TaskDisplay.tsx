import React, { useState } from "react";
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  count: any;
  unit: any;
}
interface Props {
  task: Task;
  inputCountUnit: boolean;
  inputSave: boolean;
  theFunction: any;
  remove: boolean;
  removeConfirmation: any;
}
const TaskDisplay: React.FC<Props> = ({
  task,
  inputCountUnit,
  inputSave,
  theFunction,
  remove,
  removeConfirmation,
}) => {
  // task = data d'une task.
  // functions = la ou les functions rattaché a cette task ?
  // inputCountUnit = les entry pour changer les values
  // inputSave = le button pour save ou add a une liste
  // remove = display la petite corbeille
  const [toggleDetails, settoggleDetails] = useState("hidden");
  function openDetails() {
    if (toggleDetails === "hidden") {
      settoggleDetails("active");
    } else {
      settoggleDetails("hidden");
    }
  }

  return (
    <li className="task">
      <div className="title-inputs">
        <h4>
          {task.name}{" "}
          <button onClick={openDetails} className="details">
            ?
          </button>
        </h4>
        {inputCountUnit && (
          <div className="count">
            <div className="container-count-unit">
              <input type="text" className="count" />
              <p className="unit">{task.unit}</p>
            </div>
            <button className="save" onClick={() => theFunction(task)}>
              save
            </button>
          </div>
        )}
        {inputSave && (
          <img
            src="/add.png"
            alt="add"
            className="add-button"
            onClick={() => theFunction(task)}
          />
        )}
      </div>
      <div className={toggleDetails}>
        <h4>{task.description}</h4>
        <p>{task.details}</p>
        {remove && (
          <span className="remove">
            <img src="/red-bin.png" alt="remove" onClick={removeConfirmation} />
          </span>
        )}
      </div>
    </li>
  );
};

export default TaskDisplay;

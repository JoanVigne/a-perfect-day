import { useAuthContext } from "@/context/AuthContext";
import { sendToCustom } from "@/firebase/db/custom";
import React, { useState } from "react";
import IconOpen from "./IconOpen";

interface FormCustomTaskProps {
  updateCustomTasks: (newCustomTasks: Task[]) => void;
}
interface Task {
  unit: boolean | string;
  details: string;
  description: string;
  count: number | string;
  name: string;
  id: string;
}
const FormCustomTask: React.FC<FormCustomTaskProps> = ({
  updateCustomTasks,
}) => {
  const { user } = useAuthContext() as { user: { uid: string } };
  const [message, setMessage] = useState("");
  const [task, setTask] = useState<Task>({
    unit: false,
    details: "",
    description: "",
    count: "",
    name: "",
    id: Math.random().toString(36),
  });
  const [isBooleanSelected, setIsBooleanSelected] = useState<boolean>(true);
  const [customValue, setCustomValue] = useState<string>("");
  // ouvrir et fermer le form :
  const [showForm, setShowForm] = useState(false);
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const updatedTask: Task = {
      ...task,
      unit: value === "false" ? false : "",
      count: value === "false" ? "" : "",
    };
    setTask(updatedTask);
    setIsBooleanSelected(value === "false" ? true : false);
    if (value !== "false") {
      setCustomValue("");
      document.getElementById("custom-value")?.setAttribute("value", "");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      (name === "unit" && value === "false") ||
      (name === "unit" && value === "true")
    ) {
      setTask({ ...task, unit: customValue });
    } else {
      setTask({ ...task, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // verifier dans local storage :
    const local = localStorage.getItem("custom");
    const parsed = local ? JSON.parse(local) : {};
    let alreadyInLocal = false;
    Object.values(parsed).map((ele: any) => {
      if (task.name === ele.name) {
        setMessage("Name already taken");
        alreadyInLocal = true;
        return;
      }
    });
    if (alreadyInLocal) {
      return;
    }
    console.log("unit : ", task.unit);
    console.log("Typeof ", typeof task.unit);
    if (task.unit !== false && task.count === "") {
      console.log("dedans ! ");
      task.count = "0";
    }
    console.log("taskname ", task.name);
    sendToCustom(task, user.uid);
    const newLocalStorage = {
      ...parsed,
      task,
    };
    console.log(newLocalStorage);
    localStorage.setItem("custom", JSON.stringify(newLocalStorage));
    updateCustomTasks(newLocalStorage);
    // reset form
    setTask({
      unit: false,
      details: "",
      description: "",
      count: "",
      name: "",
      id: Math.random().toString(36),
    });
    setIsBooleanSelected(true);
    setCustomValue("");
    setMessage("New task created !");
    setTimeout(() => {
      setShowForm(!showForm);
    }, 600);
  };

  return (
    <>
      <h3>
        Create a new task
        <IconOpen show={showForm} setShow={setShowForm} />
      </h3>

      <div className={showForm ? "cont-form active" : "cont-form hidden"}>
        <div className="container-form">
          <form className="add-custom-task" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={task.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
            />

            <label htmlFor="details">Details:</label>
            <textarea
              id="details"
              name="details"
              value={task.details}
              onChange={handleChange}
            />
            <label htmlFor="unit">Chose a unit (boolean or string):</label>
            <div className="container-options">
              <div className="option">
                <input
                  type="radio"
                  id="boolean"
                  name="unit"
                  value="false"
                  checked={isBooleanSelected}
                  onChange={handleOptionChange}
                />
                <label htmlFor="boolean">Done or not</label>
              </div>
              <div className="option">
                <input
                  type="radio"
                  id="other"
                  name="unit"
                  value=""
                  checked={!isBooleanSelected}
                  onChange={handleOptionChange}
                />
                <label htmlFor="other">Personalized</label>
              </div>
            </div>

            {!isBooleanSelected && (
              <div>
                <label htmlFor="unit">Unit of mesure</label>
                <input
                  type="text"
                  id="custom-value"
                  name="unit"
                  onChange={handleChange}
                  value={isBooleanSelected ? "" : (task.unit as string)}
                  placeholder="min, hours, reps..."
                />
                <label htmlFor="count">Count starting at</label>
                <input
                  type="text"
                  id="count"
                  name="count"
                  value={task.count}
                  onChange={handleChange}
                  placeholder="usually start at 0"
                />
              </div>
            )}

            <p className="message-info">{message}</p>
            <button type="submit">Create Task</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormCustomTask;

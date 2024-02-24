import { useAuthContext } from "@/context/AuthContext";
import { sendToCustom } from "@/firebase/db/db";
import React, { useState } from "react";
import "./form.css";

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
    console.log("taskname ", task.name);
    sendToCustom(task, user.uid);
    const newLocalStorage = {
      ...parsed,
      task,
    };
    console.log(newLocalStorage);
    localStorage.setItem("custom", JSON.stringify(newLocalStorage));
    updateCustomTasks(newLocalStorage);
  };

  return (
    <div className="container-form">
      <form className="add-custom-task" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={task.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="details">Details:</label>
          <textarea
            id="details"
            name="details"
            value={task.details}
            onChange={handleChange}
          />
        </div>
        <label htmlFor="unit">Unit (boolean or string):</label>
        <div>
          <input
            type="radio"
            id="boolean"
            name="unit"
            value="false"
            checked={isBooleanSelected}
            onChange={handleOptionChange}
          />
          <label htmlFor="boolean">Boolean</label>
        </div>
        <div>
          <input
            type="radio"
            id="other"
            name="unit"
            value=""
            checked={!isBooleanSelected}
            onChange={handleOptionChange}
          />
          <label htmlFor="other">Other</label>
          {!isBooleanSelected && (
            <input
              type="text"
              id="custom-value"
              name="unit"
              onChange={handleChange}
              value={isBooleanSelected ? "" : (task.unit as string)}
              placeholder="Enter custom value"
            />
          )}
        </div>

        {!isBooleanSelected && (
          <div>
            <label htmlFor="count">start Count:</label>
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

        <p className="message-error">{message}</p>
        <button className="add" type="submit">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default FormCustomTask;

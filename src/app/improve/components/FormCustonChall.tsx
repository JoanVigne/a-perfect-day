import { useAuthContext } from "@/context/AuthContext";
import { sendToCustom } from "@/firebase/db/custom";
import React, { useState } from "react";

interface Props {
  updateChallenges: any;
}

interface Task {
  unit: string;
  details: string;
  description: string;
  count: number | string;
  name: string;
  id: string;
  [key: string]: any; // Champ personnalisable
}

const FormCustonChall: React.FC<Props> = ({ updateChallenges }) => {
  const { user } = useAuthContext() as { user: { uid: string } };
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState<Task>({
    unit: "",
    details: "",
    description: "",
    count: "",
    name: "",
    id: Math.random().toString(36),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if customfieldX est vide alors on l'enleve
    console.log("task dans le handlesubmit de formCustomChall : ", task);

    /*  updateChallenges ? */
    // Envoyer les données à la fonction sendToCustom
    /*     sendToCustom(task, user.uid); */

    // Reset du formulaire, message, etc.
    setCustomFields([]);
    setTask({
      unit: "",
      details: "",
      description: "",
      count: "",
      name: "",
      id: Math.random().toString(36),
    });
    setMessage("New task created !");
  };

  // Définir un tableau de champs personnalisables
  const [customFields, setCustomFields] = useState<
    Array<{ label: string; name: string }>
  >([]);

  // Fonction pour ajouter un nouveau champ personnalisable
  const handleAddField = () => {
    const newFieldLabel = `Custom Field ${customFields.length + 1}`;
    const newFieldName = `customField${customFields.length + 1}`;
    setCustomFields([
      ...customFields,
      { label: newFieldLabel, name: newFieldName },
    ]);
    setTask({ ...task, [newFieldName]: "" });
  };

  return (
    <>
      <h3>
        Create a new task
        <img
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "icon" : "icon rotate"}
          src="./icon/arrow-down.png"
          alt="show"
        />
      </h3>

      <div className={showForm ? "cont-form active" : "cont-form hidden"}>
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
                required
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
            <div>
              <label htmlFor="unit">Unit of mesure</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={task.unit}
                onChange={handleChange}
                placeholder="Enter unit of measure"
              />
            </div>
            <div>
              <label htmlFor="count">Count starting at</label>
              <input
                type="text"
                id="count"
                name="count"
                value={task.count}
                onChange={handleChange}
                placeholder="Enter count"
              />
            </div>

            {/* Afficher dynamiquement les champs personnalisables */}
            {customFields.map((field, index) => (
              <div key={index}>
                <label htmlFor={field.name}>{field.label}:</label>
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={task[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}

            {/* Bouton pour ajouter un nouveau champ personnalisable */}
            <button className="add" type="button" onClick={handleAddField}>
              Add an other field
            </button>

            <p className="message-small">{message}</p>
            <button className="add" type="submit">
              Create Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormCustonChall;

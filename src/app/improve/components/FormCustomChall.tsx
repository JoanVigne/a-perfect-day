import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { sendToCustom } from "@/firebase/db/custom";
import React, { useState } from "react";

interface Props {
  updateChallenges: any;
}

interface Task {
  [key: string]: any; // Champ personnalisable
}

const FormCustomChall: React.FC<Props> = ({ updateChallenges }) => {
  const { user } = useAuthContext() as { user: { uid: string } };
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  // task
  const [task, setTask] = useState<Task>({
    id: Math.random().toString(36),
    name: "",
  });
  // Définir un tableau de champs personnalisables
  const [customFields, setCustomFields] = useState<
    Array<{ label: string; name: string }>
  >([]);
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
      id: Math.random().toString(36),
    });
    setMessage("New task created !");
  };

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
            {Object.keys(task).map((field, index) => {
              if (field === "id") return ""; // Exclure le champ "id" de l'affichage
              return (
                <div key={index}>
                  <label htmlFor={field}>{field}:</label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={task[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                  />
                </div>
              );
            })}

            {/* Bouton pour ajouter un autre champ personnalisé */}
            <button className="add" type="button" onClick={handleAddField}>
              Add an other input
            </button>
            <TemporaryMessage message={message} type="small-message" />

            {task && Object.keys(task).length > 2 && (
              <button className="add" type="submit">
                Create Task
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default FormCustomChall;

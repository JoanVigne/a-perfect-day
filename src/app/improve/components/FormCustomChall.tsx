import OpenIcon from "@/components/OpenIcon";
import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { sendToChall } from "@/firebase/db/chall";
import { set } from "firebase/database";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface Field {
  key: string;
  value: string;
}

interface Props {
  updateCustomChall: any;
}

const FormCustomChall: React.FC<Props> = ({ updateCustomChall }) => {
  const [fields, setFields] = useState<Field[]>([{ key: "", value: "" }]);
  const { user } = useAuthContext() as { user: { uid: string } };
  const [selectedImprovement, setSelectedImprovement] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...fields];
    if (event.target.name === "key") {
      values[index].key = event.target.value.replace(/\s+/g, "_"); // Remplacer les espaces par des underscores
    } else {
      values[index].value = event.target.value;
    }
    setFields(values);
  };

  const addField = () => {
    const values = [...fields];
    values.push({ key: "", value: "" });
    setFields(values);
  };

  const removeField = (index: number) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // add id: Math.random().toString(36), to an "id" field

    const result: { [key: string]: string } = {};
    if (selectedImprovement === "") {
      setMessage("Please select an improvement");
      return;
    }
    fields.forEach((field, index) => {
      if (index === 0) {
        result["name"] = field.value;
      } else {
        result[field.key] = field.value;
      }
    });
    result["id"] = Math.random().toString(36);
    result["selectedImprovement"] = selectedImprovement;
    console.log(result);
    // send to db
    sendToChall(result, user.uid);
    // Envoyer les données où vous en avez besoin
    updateCustomChall(result);
    // Reset fields
    setFields([{ key: "", value: "" }]);
    setMessage("New challenge created");
    setShowForm(false);
  };

  return (
    <div>
      <h3>
        Create a new challenge
        <OpenIcon show={showForm} setShow={setShowForm} />
      </h3>
      <div className={showForm ? "cont-form active" : "cont-form hidden"}>
        <form onSubmit={handleSubmit}>
          <div className="container-key-value">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter a name"
              value={fields[0].value}
              onChange={(e) => handleChange(0, e)}
              name="name"
            />
          </div>
          <p>
            Personnalise your challenge, and select the value you are gonna
            improve
          </p>
          {/* Rendu des autres entrées */}
          {fields.slice(1).map((field, index) => (
            <div key={index} className="container-key-value">
              <input
                type="text"
                placeholder="Enter key"
                value={field.key}
                onChange={(e) => handleChange(index + 1, e)}
                name="key"
              />
              <input
                type="text"
                placeholder="Enter value"
                value={field.value}
                onChange={(e) => handleChange(index + 1, e)}
                name="value"
              />
              <label htmlFor="selectedToImprove">improvement?</label>
              <input
                type="radio"
                name="selectedToImprove"
                id={`selectedToImprove_${index}`}
                value={field.key}
                onChange={(e) => setSelectedImprovement(e.target.value)}
              />
              <img
                src="/red-bin.png"
                alt="remove"
                onClick={() => removeField(index + 1)}
              />
            </div>
          ))}

          <div onClick={addField}>
            <img src="/add.png" alt="add" className="add-button" />
            Add Field
          </div>

          {fields.some((field) => fields[0].value !== "") && (
            <>
              <TemporaryMessage message={message} type="message-error" />
              <button type="submit" className="add">
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormCustomChall;

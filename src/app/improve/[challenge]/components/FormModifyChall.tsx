import OpenIcon from "@/components/OpenIcon";
import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { modifyChall, removeFromChall } from "@/firebase/db/chall";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface Fields {
  key: string;
  value: string;
}
interface UserData {
  email: string;
  uid: string;
}
interface Props {
  thisChall: any;
  inputChange: (key: string, value: string) => void;
  deleteInput: (key: string) => void;
}

const FormModifyChall: React.FC<Props> = ({
  thisChall,
  inputChange,
  deleteInput,
}) => {
  const { user } = useAuthContext() as { user: UserData };
  const [fields, setFields] = useState<Fields[]>(
    Object.entries(thisChall).map(([key, value]) => ({
      key,
      value: value as string,
    }))
  );
  const addField = () => {
    setFields((prevFields) => [...prevFields, { key: "", value: "" }]);
  };
  const [showForm, setShowForm] = useState(false);
  const [selectedImprovement, setSelectedImprovement] = useState<string[]>(
    thisChall.selectedImprovement || []
  );
  const [customChall, setCustomChall] = useState<any | null>(null);
  const [message, setMessage] = useState<string | null>("");

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...fields];
    if (event.target.name === "key") {
      values[index].key = event.target.value.replace(/\s+/g, "_");
    } else {
      values[index].value = event.target.value;
    }
    setFields(values);
  };
  const removeField = (index: number) => {
    const values = [...fields];
    const removedField = values.splice(index, 1)[0];
    setFields(values);
    deleteInput(removedField.key);
  };
  function formingDataToSend(fields: Fields[], selectedImprovement: string[]) {
    const result = {
      ...thisChall,
      ...fields.reduce((acc, field) => {
        if (field.key) {
          // Only add the field if the key is not empty
          acc[field.key as string] = field.value;
        }
        return acc;
      }, {} as { [key: string]: string }),
    };
    result.selectedImprovement = selectedImprovement;
    console.log("result", result);
    submitModify(result);
  }

  const [challToRemove, setChallToRemove] = useState<any | null>(null);
  async function deleteChall() {
    //
    setCustomChall(getItemFromLocalStorage("customChall"));
    if (challToRemove && challToRemove.id !== undefined) {
      const updatedChalls = { ...customChall };

      // Supprimer la tâche avec l'ID correspondant de la copie de customTasks
      Object.keys(updatedChalls).forEach((key) => {
        const taskKey = key as keyof typeof updatedChalls;
        if (taskKey === challToRemove?.id) {
          delete updatedChalls[taskKey];
        }
      });
      console.log("updated Task", updatedChalls);
      setChallToRemove(null);
      // envoi a la db customChall
      const mess = await removeFromChall(updatedChalls, user.uid);
      setMessage(mess);
      setCustomChall(updatedChalls);
      window.location.href = "/improve";
    }
  }
  function submitModify(data: any) {
    console.log("data dans submitModify", data);
    // control data
    // send to db
    modifyChall(data, user.uid);
    setMessage("Challenge modified");
    setTimeout(() => {
      setShowForm(false);
    }, 2000);
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  }
  return (
    <div>
      <h2>
        Modify this challenge <OpenIcon show={showForm} setShow={setShowForm} />
      </h2>
      <div className={showForm ? "active" : "hidden"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formingDataToSend(fields, selectedImprovement);
          }}
          className="modify-chall"
        >
          {fields
            .sort((a, b) => (a.key === "name" ? -1 : b.key === "name" ? 1 : 0))
            .map((field, index) => {
              if (field.key === "id" || field.key === "selectedImprovement") {
                return null;
              } else {
                return (
                  <div key={index} className="field">
                    <div className="inputs">
                      <input
                        type="text"
                        value={field.key}
                        placeholder="key"
                        disabled={field.key === "name" ? true : undefined}
                        onChange={(e) => handleChange(index, e)}
                        name="key"
                      />
                      <input
                        type="text"
                        value={field.value}
                        placeholder="value"
                        onChange={(e) => handleChange(index, e)}
                        name="value"
                      />
                    </div>
                    {field.key === "name" ? null : (
                      <>
                        <div className="improve">
                          <label htmlFor={`selectedToImprove_${index}`}>
                            value to improve?
                          </label>
                          <input
                            type="checkbox"
                            name="selectedToImprove"
                            id={`selectedToImprove_${index}`}
                            value={field.key}
                            checked={selectedImprovement.includes(
                              field.key ? field.key : index.toString()
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedImprovement((prev) => [
                                  ...prev,
                                  e.target.value,
                                ]);
                              } else {
                                setSelectedImprovement((prev) =>
                                  prev.filter(
                                    (value) => value !== e.target.value
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                        <span
                          onClick={() => removeField(index)}
                          className="remove"
                        >
                          <img src="./delet.png" alt="remove" />
                        </span>
                      </>
                    )}
                  </div>
                );
              }
            })}
          <button type="button" onClick={addField}>
            Add Field
          </button>
          <button type="submit" className="add">
            Submit
          </button>
          <TemporaryMessage
            message={message}
            type="message-error"
            timeInMS={3000}
          />
        </form>
        <p>Or</p>
        {challToRemove && (
          <div className="modal-remove">
            <div className="modal-content">
              <p>
                Are you sure you want to delete "{thisChall.name}" for ever?
              </p>
              <div className="modal-buttons">
                <button onClick={deleteChall} className="confirm">
                  Confirm
                </button>
                <button
                  onClick={() => setChallToRemove(null)}
                  className="cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="delete-button"
          onClick={() => setChallToRemove(thisChall)}
        >
          Delet this Challenge for ever
        </button>
      </div>
    </div>
  );
};

export default FormModifyChall;

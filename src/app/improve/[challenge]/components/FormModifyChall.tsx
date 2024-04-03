import OpenIcon from "@/components/OpenIcon";
import { useAuthContext } from "@/context/AuthContext";
import { removeFromChall } from "@/firebase/db/chall";
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
  submitModify: (data: any) => void;
}

const FormModifyChall: React.FC<Props> = ({
  thisChall,
  inputChange,
  deleteInput,
  submitModify,
}) => {
  const { user } = useAuthContext() as { user: UserData };
  const [fields, setFields] = useState<Fields[]>(
    Object.entries(thisChall).map(([key, value]) => ({
      key,
      value: value as string,
    }))
  );
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
    inputChange(values[index].key, values[index].value);
  };

  const removeField = (index: number) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
    deleteInput(values[index].key);
  };
  function formingDataToSend(fields: Fields[], selectedImprovement: string[]) {
    const result = {
      ...thisChall,
      ...fields.reduce((acc, field) => {
        acc[field.key as string] = field.value;
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
      /*       setForceUpdate((prev) => !prev); */
    }
  }

  return (
    <div>
      <h2>
        Modify this challenge <OpenIcon show={showForm} setShow={setShowForm} />
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          formingDataToSend(fields, selectedImprovement);
        }}
        className={showForm ? "modify-chall active" : "modify-chall hidden"}
      >
        {fields.map((field, index) => {
          if (field.key === "id" || field.key === "selectedImprovement") {
            return null;
          } else {
            return (
              <div key={index} className="field">
                <div className="inputs">
                  <input
                    type="text"
                    value={field.key}
                    disabled={field.key === "name" ? true : undefined}
                    onChange={(e) => handleChange(index, e)}
                    name="key"
                  />
                  <input
                    type="text"
                    value={field.value}
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
                        checked={selectedImprovement.includes(field.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedImprovement((prev) => [
                              ...prev,
                              e.target.value,
                            ]);
                          } else {
                            setSelectedImprovement((prev) =>
                              prev.filter((value) => value !== e.target.value)
                            );
                          }
                        }}
                      />
                    </div>
                    <span onClick={() => removeField(index)} className="remove">
                      <img src="./delet.png" alt="remove" />
                    </span>
                  </>
                )}
              </div>
            );
          }
        })}
        <button type="submit" className="add">
          Submit
        </button>
      </form>
      <p>Or</p>
      {challToRemove && (
        <div className="modal-remove">
          <div className="modal-content">
            <p>Are you sure you want to delete "{thisChall.name}" for ever?</p>
            <div className="modal-buttons">
              <button onClick={deleteChall} className="confirm">
                Confirm
              </button>
              <button onClick={() => setChallToRemove(null)} className="cancel">
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
  );
};

export default FormModifyChall;

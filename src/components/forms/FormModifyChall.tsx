import Icon from "@/components/ui/Icon";
import IconOpen from "@/components/ui/IconOpen";
import TemporaryMessage from "@/components/ui/TemporaryMessage";
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
    // Filter selectedImprovement to only include keys that exist in fields
    result.selectedImprovement = selectedImprovement.filter((key) =>
      fields.some((field) => field.key === key)
    );
    console.log("result", result);
    submitModify(result);
  }

  const [challToRemove, setChallToRemove] = useState<any | null>(null);
  async function deleteChall() {
    //
    const currentCustomChall = getItemFromLocalStorage("customChall");
    setCustomChall(currentCustomChall);
    if (challToRemove && challToRemove.id !== undefined) {
      const updatedChalls = { ...currentCustomChall };
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
      window.location.href = "/improve";
    }, 2500);
  }
  return (
    <div>
      <h2 onClick={() => setShowForm(!showForm)}>
        <IconOpen show={showForm} setShow={setShowForm} /> Modify this challenge
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
              if (
                field.key === "id" ||
                field.key === "selectedImprovement" ||
                field.key === "perf"
              ) {
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
                          <label htmlFor={`selectedToImprove_${index}`}>
                            To improve?
                          </label>
                        </div>
                        <Icon
                          nameImg="delete"
                          onClick={() => removeField(index)}
                        />
                      </>
                    )}
                  </div>
                );
              }
            })}
          <button type="button" onClick={addField}>
            Add Field
          </button>
          <button type="submit">Submit</button>
          <TemporaryMessage
            message={message}
            type="message-error"
            timeInMS={3000}
          />
        </form>
        <form>
          <h3>Or maybe wanna modify past datas?</h3>
          les datas historicChall sur un calendrier
          <button type="submit">Submit</button>
        </form>

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
        <div
          className="smaller-container"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>Wanna get rid of this challenge ?</h3>
          <button
            className="delete-button"
            onClick={() => setChallToRemove(thisChall)}
          >
            Delet for ever
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModifyChall;

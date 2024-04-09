import Icon from "@/components/Icon";
import IconOpen from "@/components/IconOpen";
import TemporaryMessage from "@/components/TemporaryMessage";
import { sendToChall } from "@/firebase/db/chall";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface Field {
  key: string;
  value: string;
}

interface Props {
  updateCustomChall: any;
  userid: string;
}

const FormCustomChall: React.FC<Props> = ({ updateCustomChall, userid }) => {
  const [selectedImprovement, setSelectedImprovement] = useState<string[]>([]);
  const [fields, setFields] = useState<Field[]>([{ key: "", value: "" }]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
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
    const result: { [key: string]: string | string[] } = {};
    const filteredFields = fields.filter(
      (field) => !(field.key === "" && field.value === "")
    );
    filteredFields.forEach((field, index) => {
      if (index === 0) {
        result["name"] = field.value;
      } else {
        result[field.key] = field.value;
      }
    });

    result["id"] = Math.random().toString(36);
    result["selectedImprovement"] = selectedImprovement;
    // send to db
    sendToChall(result, userid);
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
        <IconOpen show={showForm} setShow={setShowForm} />
        Create a new challenge
      </h3>
      <div className={showForm ? "cont-form active" : "cont-form hidden"}>
        <form onSubmit={handleSubmit}>
          <div className="container-key-value">
            <label htmlFor="name">Name of the Challenge</label>
            <input
              type="text"
              placeholder="ex: Jogging ..."
              value={fields[0].value}
              onChange={(e) => handleChange(0, e)}
              name="name"
            />
          </div>
          <table>
            <tbody>
              <tr>
                <td>Personnalise your challenge by adding fields</td>
                <td>
                  Select the values you will improve. No need to add a value
                  now.
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  {/* Rendu des autres entrées */}
                  {fields.slice(1).map((field, index) => (
                    <div key={index} className="container-key-value">
                      <input
                        type="text"
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) => handleChange(index + 1, e)}
                        name="key"
                      />
                      <input
                        type="text"
                        // HERE I NEED HELP FOR THE
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => handleChange(index + 1, e)}
                        name="value"
                      />
                      <div className="improve">
                        <input
                          type="checkbox"
                          name="selectedToImprove"
                          id={`selectedToImprove_${index}`}
                          value={field.key}
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
                        <label htmlFor={`selectedToImprove_${index}`}>
                          {selectedImprovement.includes(field.key)
                            ? "I will improve!"
                            : "To improve?"}
                        </label>
                        <Icon
                          nameImg="delete"
                          onClick={() => removeField(index + 1)}
                        />
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>

          <Icon nameImg="add" onClick={() => addField()} />

          {fields.some((field) => fields[0].value !== "") && (
            <>
              <TemporaryMessage
                message={message}
                type="message-error"
                timeInMS={3000}
              />
              <button type="submit">Submit</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormCustomChall;

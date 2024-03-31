import React, { ChangeEvent, useState } from "react";

interface Props {
  thisChall: any;
  inputChange: (key: string, value: string) => void;
  deleteInput: (key: string) => void;
  submitModify: (e: any) => void;
}
interface Field {
  key: string;
  value: string;
}

const ModifyChallForm: React.FC<Props> = ({
  thisChall,
  inputChange,
  deleteInput,
  submitModify,
}) => {
  const [fields, setFields] = useState<Field[]>([]);
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

  const handleAddField = () => {
    const values = [...fields];
    values.push({ key: "", value: "" });
    setFields(values);
  };

  const handleRemoveField = (index: number) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
  };
  return (
    <form onSubmit={submitModify}>
      <div className="additional-properties">
        {Object.entries(thisChall).map(([key, value]) => {
          if (key === "id" || key === "selectedImprovement") {
            return null;
          }
          return (
            <div key={key}>
              <label className="label-delet">
                {key}{" "}
                {key !== "name" && (
                  <span className="remove">
                    {" "}
                    <img
                      src="/delet.png"
                      alt="remove"
                      onClick={() => deleteInput(key)}
                    />
                  </span>
                )}
              </label>
              <input
                type="text"
                value={value as string}
                onChange={(e) => inputChange(key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      {fields.map((field, index) => (
        <div key={index} className="container-key-value">
          <input
            type="text"
            placeholder="Enter key"
            value={field.key}
            onChange={(e) => handleChange(index, e)}
            name="key"
          />
          <input
            type="text"
            placeholder="Enter value"
            value={field.value}
            onChange={(e) => handleChange(index, e)}
            name="value"
          />
          <img
            src="/red-bin.png"
            alt="remove"
            onClick={() => handleRemoveField(index)}
          />
        </div>
      ))}

      <div onClick={handleAddField}>
        <img src="/add.png" alt="add" className="add-button" />
        Add Field
      </div>
      <input type="submit" value="Save modifiction" className="add" />
    </form>
  );
};

export default ModifyChallForm;

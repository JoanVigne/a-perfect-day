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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result: { [key: string]: string } = {};
    fields.forEach((field, index) => {
      if (index === 0) {
        // Utilisez field.key pour capturer le nom
        result["name"] = field.value;
      } else {
        result[field.key] = field.value;
      }
    });
    result["id"] = Math.random().toString(36);
    console.log(result);
    // Envoyer les données où vous en avez besoin
    updateCustomChall(result);
  };

  return (
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

          <img
            src="/red-bin.png"
            alt="remove"
            onClick={() => handleRemoveField(index + 1)}
          />
        </div>
      ))}

      <div onClick={handleAddField}>
        <img src="/add.png" alt="add" className="add-button" />
        Add Field
      </div>

      {fields.some((field) => fields[0].value !== "") && (
        <button type="submit" className="add">
          Submit
        </button>
      )}
    </form>
  );
};

export default FormCustomChall;

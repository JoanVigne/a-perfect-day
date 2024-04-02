import OpenIcon from "@/components/OpenIcon";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface Field {
  key: string;
  value: string;
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
  const [fields, setFields] = useState<Field[]>(
    Object.entries(thisChall).map(([key, value]) => ({
      key,
      value: value as string,
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedImprovement, setSelectedImprovement] = useState<string[]>(
    thisChall.selectedImprovement || []
  );

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
  function formingDataToSend(fields: Field[], selectedImprovement: string[]) {
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
  return (
    <div className="container">
      <h3>
        Modify this challenge <OpenIcon show={showForm} setShow={setShowForm} />
      </h3>

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
    </div>
  );
};

export default FormModifyChall;

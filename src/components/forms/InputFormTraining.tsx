import React from "react";
import Icon from "../ui/Icon";

interface Props {
  type: string;
  step: string;
  name: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  placeholder: string;
  lastPerf: any;
  onClick: () => void;
}

const InputFormTraining: React.FC<Props> = ({
  type,
  step,
  name,
  id,
  onChange,
  value,
  placeholder,
  lastPerf,
  onClick,
}) => {
  const getIconName = (
    value: string | number,
    lastPerf: any,
    placeholder: string
  ) => {
    if (value === "") {
      return "validation";
    } else if (value > lastPerf) {
      return "fire";
    } else if (value === lastPerf) {
      return "validation-white";
    } else if (value < lastPerf) {
      return "sad";
    }
    return "delete"; // default return value
  };
  return (
    <div className="input-validation">
      <input
        type={type}
        step={step}
        name={name}
        id={id}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
      {lastPerf ? (
        <Icon
          nameImg={getIconName(value, lastPerf, placeholder)}
          onClick={onClick}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default InputFormTraining;

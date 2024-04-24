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
    if (lastPerf) {
      if (value === "") {
        return "equal";
      } else if (value > lastPerf) {
        return "fire";
      } else if (value === lastPerf) {
        return "validation-white";
      } else if (value < lastPerf) {
        return "sad";
      }
    }
    if (!lastPerf) {
      if (value !== "") {
        return "validation-white";
      } else {
        return "null";
      }
    }
    return "null";
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

      <Icon
        nameImg={getIconName(value, lastPerf, placeholder)}
        onClick={onClick}
      />
    </div>
  );
};

export default InputFormTraining;

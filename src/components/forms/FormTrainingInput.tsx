import React, { useState } from "react";
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
  onStartTimer: (value: string | number, placeholder: string) => void;
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
  onStartTimer,
}) => {
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const handleBlur = () => {
    if (lastPerf) {
      if (value < lastPerf) {
        setComparisonResult("sad");
      } else if (value === lastPerf) {
        setComparisonResult("validation");
      } else if (value > lastPerf) {
        setComparisonResult("fire");
      } else {
        setComparisonResult("validation-white");
      }
    } else if (value !== "") {
      setComparisonResult("validation");
    } else {
      setComparisonResult("null");
    }
  };

  const icon = (comparisonResult: string | null) => {
    switch (comparisonResult) {
      case "sad":
        return <Icon nameImg="sad" onClick={onClick} />;
      case "validation":
        return <Icon nameImg="validation" onClick={onClick} />;
      case "fire":
        return <Icon nameImg="fire" onClick={onClick} />;
      case "null":
        return <Icon nameImg="null" onClick={onClick} />;
      case "validation-white":
        return <Icon nameImg="validation-white" onClick={onClick} />;
      case "equal":
        return <Icon nameImg="equal" onClick={onClick} />;
      default:
        return <Icon nameImg="null" onClick={onClick} />;
    }
  };

  return (
    <div className="input-validation">
      <input
        type={type}
        step={step}
        name={name}
        id={id}
        onChange={onChange}
        onBlur={handleBlur}
        value={value}
        placeholder={placeholder}
      />
      <div className="icons">
        {/* weight and reps : */}
        {!name.includes("interval") && (
          <>
            {comparisonResult
              ? icon(comparisonResult)
              : lastPerf && !value
              ? icon("equal")
              : ""}
            <div
              className="plus-one"
              onClick={() => console.log("add one to placeholder or 1")}
            >
              +
            </div>
          </>
        )}
        {/* REST: */}
        {name.includes("interval") && (
          <Icon
            nameImg={"play"}
            onClick={() => {
              onStartTimer(value, placeholder);
              onClick();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InputFormTraining;

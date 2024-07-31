import Icon from "@/components/ui/Icon";
import React, { useEffect, useState } from "react";
import "./inputNumbers.css";
interface Props {
  type: string;
  step: string;
  name: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  placeholder: string;
  onClick: () => void;
  onStartTimer: (value: number, placeholder: string) => void;
  onIncrement: () => void;
}
const InputNumbers: React.FC<Props> = ({
  type,
  step,
  name,
  id,
  onChange,
  value,
  placeholder,
  onClick,
  onStartTimer,
  onIncrement,
}) => {
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  useEffect(() => {
    let result = "null";
    if (placeholder) {
      const lastPerfNumber = Number(placeholder);
      const valueNumber = Number(value);
      if (!value) {
        result = "equal";
      } else if (valueNumber < lastPerfNumber) {
        result = "sad";
      } else if (valueNumber === lastPerfNumber) {
        result = "validation";
      } else if (valueNumber > lastPerfNumber) {
        result = "fire";
      } else {
        result = "validation-white";
      }
    } else if (value !== "") {
      result = "validation";
    }
    setComparisonResult(result);
  }, [value, placeholder]);

  const icon = (iconName: string | null) => {
    return <Icon nameImg={iconName || "null"} onClick={onClick} />;
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      // Add your validation logic here
      console.log("Enter or Next key pressed, input validated");
    }
  };
  return (
    <div className="input-validation">
      <div className="icons">
        {/* weight and reps : */}
        {!name.includes("interval") && (
          <>
            {icon(comparisonResult || (placeholder && !value ? "equal" : ""))}
            <input
              type={type}
              step={step}
              name={name}
              id={id}
              onChange={onChange}
              value={value}
              placeholder={placeholder}
            />
            <Icon nameImg={"plus-one"} onClick={onIncrement} />
            {/*  <div className="plus-one" onClick={onIncrement}>
              +
            </div> */}
          </>
        )}
        {/* REST: */}
        {name.includes("interval") && (
          <>
            <input
              type={type}
              step={step}
              name={name}
              id={id}
              onChange={onChange}
              value={value}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
            />
            <Icon
              nameImg={"play"}
              onClick={() => {
                onStartTimer(Number(value), placeholder);
                onClick();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InputNumbers;

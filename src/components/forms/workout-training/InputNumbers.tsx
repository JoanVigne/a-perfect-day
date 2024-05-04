import Icon from "@/components/ui/Icon";
import React, { useEffect, useState } from "react";
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
  lastPerf,
  onClick,
  onStartTimer,
  onIncrement,
}) => {
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  useEffect(() => {
    let result = "null";
    if (lastPerf) {
      const lastPerfNumber = Number(lastPerf);
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
  }, [value, lastPerf]);

  const icon = (iconName: string | null) => {
    return <Icon nameImg={iconName || "null"} onClick={onClick} />;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i] as HTMLInputElement;
      if (element.type !== "checkbox" && element.value) {
        console.log(`${element.name}: ${element.value}`);
      }
    }
    console.log("SUBMIT");
  };
  return (
    <form onSubmit={submit}>
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
        <div className="icons">
          {/* weight and reps : */}
          {!name.includes("interval") && (
            <>
              {icon(comparisonResult || (lastPerf && !value ? "equal" : ""))}
              <div className="plus-one" onClick={onIncrement}>
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
    </form>
  );
};

export default InputNumbers;

import Icon from "@/components/ui/Icon";
import React, { useState, useEffect } from "react";

interface Props {
  timerValue: string | number;
  keyToRestart: number;
  shouldStartTimer: boolean;
  onInputChange: (value: string) => void;
}
const Timer: React.FC<Props> = ({
  timerValue,
  keyToRestart,
  shouldStartTimer,
}) => {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("1");
  const minutes = seconds
    ? Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")
    : "00";
  const remainingSeconds = seconds
    ? (seconds % 60).toString().padStart(2, "0")
    : "00";
  useEffect(() => {
    if (timerValue) {
      setInputValue(timerValue.toString());
    }
  }, [timerValue, keyToRestart]);

  useEffect(() => {
    if (shouldStartTimer) {
      handleStart();
    }
  }, [shouldStartTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds !== null && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) =>
          prevSeconds !== null ? prevSeconds - 1 : null
        );
      }, 1000);
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const convertToDecimalTime = (time: string) => {
    if (time === null || time === undefined) return null;
    const timeWithPoint = time.includes(",") ? time.replace(",", ".") : time;
    const timeNumber = parseFloat(timeWithPoint);
    const integerPart = Math.floor(timeNumber);
    const fractionalPart = timeNumber - integerPart;
    let decimalFractionalPart = 0;
    if (fractionalPart >= 0.6 && fractionalPart < 1) {
      decimalFractionalPart = fractionalPart;
    } else {
      decimalFractionalPart = fractionalPart * (100 / 60);
    }

    return integerPart + decimalFractionalPart;
  };

  const handleStart = () => {
    setIsActive(true);
    const timeInSeconds = Math.round(parseFloat(inputValue) * 60);
    setSeconds(timeInSeconds);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(null);
  };
  function increment() {
    setInputValue((prevValue) => {
      let newValue = parseFloat(prevValue) + 0.1;
      let integerPart = Math.floor(newValue);
      let decimalPart = newValue - integerPart;

      if (decimalPart >= 0.6) {
        integerPart += 1;
        decimalPart = 0;
      }
      newValue = integerPart + decimalPart;
      return newValue.toFixed(2);
    });
  }
  function decrement() {
    setInputValue((prevValue) => {
      let newValue = parseFloat(prevValue) - 0.1;
      if (newValue <= 0) return "0";
      let integerPart = Math.floor(newValue);
      let decimalPart = newValue - integerPart;

      if (decimalPart >= 0.6) {
        decimalPart = 0.5;
      }

      newValue = integerPart + decimalPart;
      return newValue.toFixed(2);
    });
  }
  return (
    <div className="timer">
      <div className="time">
        {!isActive ? (
          <>
            <div className="buttonsPlusAndMinus">
              <button onClick={() => increment()}>+10s</button>
              <button onClick={() => decrement()}>-10s</button>
            </div>
            <input
              className="secondes"
              type="number"
              value={inputValue}
              onChange={handleInputChange}
            />
          </>
        ) : (
          <div className="time-chrono">
            {minutes}: {remainingSeconds}
          </div>
        )}
      </div>
      <div className="buttons">
        <Icon nameImg="reset" onClick={handleReset} />
        {!isActive && <Icon nameImg="play" onClick={handleStart} />}
      </div>
    </div>
  );
};

export default Timer;

import Icon from "@/components/ui/Icon";
import React, { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("1.3");
  const [lastInputValue, setLastInputValue] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  const remainingSeconds = seconds ? seconds % 60 : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds !== null && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) =>
          prevSeconds !== null ? prevSeconds - 1 : null
        );
      }, 1000);
    } else if (!isResetting && seconds === 0) {
      const audio = new Audio("/ring.mp3");
      audio.play();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, isResetting]);

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
    if (isActive) {
      setIsActive(false);
    } else {
      let timeValue = lastInputValue;
      if (inputValue) {
        setLastInputValue(inputValue);
        timeValue = inputValue;
      }

      if (!timeValue || isNaN(parseFloat(timeValue))) {
        alert("Please enter a valid number.");
        return;
      }
      const timeInMinutes: number | null = convertToDecimalTime(timeValue);
      if (timeInMinutes === null) {
        return;
      }
      const timeInSeconds = Math.round(timeInMinutes * 60);
      setSeconds(timeInSeconds);
      setIsActive(true);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleReset = () => {
    setIsResetting(true);
    setSeconds(null);
    setIsActive(false);
    setInputValue(lastInputValue || "1.3");
    setIsResetting(false);
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
            {minutes}m {remainingSeconds}s
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

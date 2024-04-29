import Icon from "@/components/ui/Icon";
import React, { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("1.3");
  const [lastInputValue, setLastInputValue] = useState("");
  const [isReset, setIsReset] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
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

      setSeconds((prevSeconds) => prevSeconds || timeInSeconds);
      setIsActive(true);
      setIsReset(false);
      setInputValue("1.3");
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
    setIsReset(true);
    setInputValue(lastInputValue || "1.3");
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

      if (decimalPart > 0.6) {
        integerPart -= 1;
        decimalPart = 0.5;
      }

      newValue = integerPart + decimalPart;
      console.log("newValue", newValue);
      return newValue.toFixed(2);
    });
  }
  return (
    <div className="timer">
      <div className="time">
        {isReset ? (
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
          <div className="time-chrono">{seconds}sec</div>
        )}
      </div>
      <Icon
        nameImg="reset"
        onClick={() => {
          handleReset();
        }}
      />
      {isActive ? (
        <Icon
          nameImg="pause"
          onClick={() => {
            handleStart();
          }}
        />
      ) : (
        <Icon
          nameImg="play"
          onClick={() => {
            handleStart();
          }}
        />
      )}
    </div>
  );
};

export default Timer;

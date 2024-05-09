import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import "./time.css";

interface Props {
  timerKey: number;
  timerValue: number | null;
}

const Timer: React.FC<Props> = ({ timerKey, timerValue }) => {
  const [seconds, setSeconds] = useState<number | null>(
    timerValue ? Number(timerValue) : null
  );
  const [isActive, setIsActive] = useState(false);
  const [inputPlaceHolder, setInputPlaceHolder] = useState("1");
  const [inputValue, setInputValue] = useState("");
  const audio = new Audio("/ring.mp3");
  const [animate, setAnimate] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
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
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 1000);

      const minutes = Math.floor(timerValue);
      const seconds = Math.round((timerValue - minutes) * 100);
      setSeconds(minutes * 60 + seconds);
      setIsActive(true);
      setInputValue("");
      return () => clearTimeout(timer);
    }
  }, [timerKey]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds !== null && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds !== null && prevSeconds > 1) {
            return prevSeconds - 1;
          } else {
            if (interval) clearInterval(interval);
            // Play the audio
            audio.play();
            return null;
          }
        });
      }, 1000);
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds]);

  const handleReset = () => {
    setIsActive(false);
    setSeconds(null);
    setInputValue("");
  };
  const handleStart = () => {
    setIsActive(true);
    if (inputValue) {
      const minutes = Math.floor(parseFloat(inputValue));
      const seconds = Math.round((parseFloat(inputValue) - minutes) * 100);
      setSeconds(minutes * 60 + seconds);
    } else {
      const minutes = Math.floor(parseFloat(inputPlaceHolder));
      const seconds = Math.round(
        (parseFloat(inputPlaceHolder) - minutes) * 100
      );
      setSeconds(minutes * 60 + seconds);
    }
  };
  function increment() {
    setInputPlaceHolder((prevValue) => {
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
    setInputPlaceHolder((prevValue) => {
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
      <div className={`time ${animate ? "pulse" : ""}`}>
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
              placeholder={inputPlaceHolder}
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
      {/* <div className="timer">
      <div className="time">
        {minutes}:{remainingSeconds}
      </div>
    </div> */}
    </div>
  );
};

export default Timer;
/* import Icon from "@/components/ui/Icon";
import React, { useState, useEffect } from "react";

interface Props {
  timerValue: string | number;
  onInputChange: (value: string) => void;
}
const Timer: React.FC<Props> = ({ timerValue }) => {
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
  }, [timerValue]);

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
 */

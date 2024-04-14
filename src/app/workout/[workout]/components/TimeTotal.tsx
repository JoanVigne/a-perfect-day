import Icon from "@/components/Icon";
import React, { useState, useEffect, useRef } from "react";

const TimeTotal = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = () => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  function increment() {
    setSeconds((prevSeconds) => prevSeconds + 10);
  }

  function decrement() {
    setSeconds((prevSeconds) => (prevSeconds > 10 ? prevSeconds - 10 : 0));
  }

  return (
    <div className="timer">
      <h3>
        <Icon
          nameImg="reset"
          onClick={() => {
            handleReset();
          }}
        />
        <div className="buttonsPlusAndMinus">
          <button onClick={() => increment()}>+10s</button>
          <button onClick={() => decrement()}>-10s</button>
        </div>
        Total time: {formatTime()}{" "}
        {isActive ? (
          <Icon
            nameImg="pause"
            onClick={() => {
              handleStartStop();
            }}
          />
        ) : (
          <Icon
            nameImg="play"
            onClick={() => {
              handleStartStop();
            }}
          />
        )}
      </h3>
    </div>
  );
};

export default TimeTotal;

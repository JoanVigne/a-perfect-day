import Icon from "@/components/Icon";
import React, { useState, useEffect, useRef } from "react";

const Chronometer = () => {
  const [seconds, setSeconds] = useState(0);
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

  const increment = () => {
    setSeconds((prevSeconds) => prevSeconds + 10);
  };

  const decrement = () => {
    setSeconds((prevSeconds) => (prevSeconds > 10 ? prevSeconds - 10 : 0));
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="chronometer">
      <div className="time">
        {minutes}m {remainingSeconds}s
      </div>
      <div className="buttonsPlusAndMinus">
        <button onClick={increment}>+10s</button>
        <button onClick={decrement}>-10s</button>
      </div>
      {isActive ? (
        <Icon nameImg="pause" onClick={handleStartStop} />
      ) : (
        <Icon nameImg="play" onClick={handleStartStop} />
      )}
      <Icon nameImg="reset" onClick={handleReset} />
    </div>
  );
};

export default Chronometer;

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

  return (
    <div className="chronometer">
      <div className="secondes">{seconds}s</div>
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
      <Icon
        nameImg="reset"
        onClick={() => {
          handleReset();
        }}
      />
    </div>
  );
};

export default Chronometer;

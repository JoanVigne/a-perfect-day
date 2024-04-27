import Icon from "@/components/ui/Icon";
import React, { useEffect, useState, useRef } from "react";
import "./time.css";

interface Props {
  isActive: boolean;
  stopOnFinish: boolean;
  onTimeFinish: React.Dispatch<React.SetStateAction<string>>;
}

const TimeTotal: React.FC<Props> = ({
  isActive,
  stopOnFinish,
  onTimeFinish,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(
        () => setSeconds((prevSeconds) => prevSeconds + 1),
        1000
      );
    } else if (!isActive && seconds !== 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds]);

  useEffect(() => {
    if (stopOnFinish) {
      onTimeFinish && onTimeFinish(formatTime());
    }
  }, [stopOnFinish]);

  const formatTime = () => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  return (
    <div className="container-time-total">
      <h3>Total time</h3>
      <div className="container-without-title">
        <Icon
          nameImg="reset"
          onClick={() => {
            setSeconds(0);
          }}
        />
        <div className="buttonsPlusAndMinus">
          <button
            type="button"
            onClick={() => setSeconds((prevSeconds) => prevSeconds + 10)}
          >
            +10s
          </button>
          <button
            type="button"
            onClick={() =>
              setSeconds((prevSeconds) =>
                prevSeconds > 10 ? prevSeconds - 10 : 0
              )
            }
          >
            -10s
          </button>
        </div>
        <h3>{formatTime()} </h3>
      </div>
    </div>
  );
};

export default TimeTotal;

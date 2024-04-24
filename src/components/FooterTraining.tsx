import React, { useState } from "react";
import TimeChronometer from "./ui/TimeChronometer";
import Timer from "./ui/Timer";

const FooterTraining = () => {
  const [chornoTimer, setChronoTimer] = useState(false);
  return (
    <footer className="footerTraining">
      <button
        type="button"
        className={chornoTimer ? "active" : ""}
        onClick={() => {
          setChronoTimer(true);
        }}
      >
        Chrono
      </button>
      <button
        type="button"
        className={!chornoTimer ? "active" : ""}
        onClick={() => {
          setChronoTimer(false);
        }}
      >
        Timer
      </button>
      {chornoTimer ? <TimeChronometer /> : <Timer />}
    </footer>
  );
};

export default FooterTraining;

import React, { useState } from "react";
import TimeChronometer from "./ui/TimeChronometer";
import Timer from "./ui/Timer";

const FooterTraining = () => {
  const [chornoTimer, setChronoTimer] = useState(false);
  return (
    <footer className="footerTraining">
      <button
        type="button"
        onClick={() => {
          setChronoTimer(!chornoTimer);
        }}
      >
        {chornoTimer ? "Chrono" : "Timer"}
      </button>
      {chornoTimer ? <TimeChronometer /> : <Timer />}
    </footer>
  );
};

export default FooterTraining;

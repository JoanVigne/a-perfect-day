import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
interface Props {
  isVisible: boolean;
  close: () => void;
  perf: string;
  perfid: string;
  workoutid: string;
}

const ModalCheckPerf: React.FC<Props> = ({
  isVisible,
  close,
  perf,
  perfid,
  workoutid,
}) => {
  const [perfOfThisExo, setPerfOfThisExo] = useState<any>(null);

  useEffect(() => {
    const previousworkouts = getItemFromLocalStorage("workouts");

    Object.values(previousworkouts).forEach((workout: any) => {
      if (workoutid !== workout.id) {
        return;
      }
      if (!workout.perf) {
        console.log("No performance data");
        return;
      }
      Object.values(workout.perf).forEach((allexo: any) => {
        Object.keys(allexo).forEach((exoid) => {
          if (exoid === perfid) {
            setPerfOfThisExo(allexo[exoid]);
          }
        });
      });
    });
  }, [workoutid, perfid]);

  if (!isVisible) {
    return null;
  }

  return (
    <ReactModal
      className="confirmModal"
      isOpen={isVisible}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <button onClick={close}>Close</button>
      <h2>Performance for {perf}</h2>
      {perfOfThisExo &&
        Object.entries(perfOfThisExo).map(([key, value]) => {
          if (key === "exoOrder") {
            return null;
          }
          return (
            <p key={key}>
              {key}:{/*  {value} */}
            </p>
          );
        })}
      <button onClick={close}>Close</button>
    </ReactModal>
  );
};

export default ModalCheckPerf;

import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import "./modalCheckPerf.css";

interface Props {
  isVisible: boolean;
  close: () => void;
  perf: string;
  perfid: string;
  workoutid: string;
}

interface PerfData {
  date: string;
  data: Record<string, string>;
}

interface Workout {
  id: string;
  perf: Record<string, Record<string, Record<string, string>>>;
}
const ModalCheckPerf: React.FC<Props> = ({
  isVisible,
  close,
  perf,
  perfid,
  workoutid,
}) => {
  const [perfOfThisExo, setPerfOfThisExo] = useState<PerfData[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  // all perf modal =>
  const [openAllPerfModal, setOpenAllPerfModal] = useState(true);
  useEffect(() => {
    const previousworkouts = getItemFromLocalStorage("workouts");
    setWorkouts(previousworkouts);
    console.log("workouts", workouts);
    const perfData: PerfData[] = [];
    Object.values(workouts).forEach((workout: any) => {
      if (workoutid !== workout.id) {
        return;
      }
      if (!workout.perf) {
        console.log("No performance data");
        return;
      }
      Object.entries(workout.perf).forEach(([date, allexo]: any) => {
        if (allexo[perfid]) {
          perfData.push({ date, data: allexo[perfid] });
        }
      });
    });
    perfData.sort((a, b) => b.date.localeCompare(a.date));
    setPerfOfThisExo(perfData);
  }, [workoutid, perfid]);

  if (!isVisible) {
    return null;
  }

  return (
    <ReactModal
      className="modal-perf-exo"
      isOpen={isVisible}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <div className="close-and-openmodal">
        <button onClick={close}>Close</button>
      </div>

      <h2>Performances for "{perf}"</h2>
      <div className="container-perf-exo">
        {perfOfThisExo.map(({ date, data }, index) => (
          <div key={index} className="container-date-exo">
            <h3>Date: {date}</h3>
            <table>
              <thead>
                <tr>
                  <th>Wei.</th>
                  <th>Reps</th>
                  <th>Rest</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(data)
                  .filter((key) => key.startsWith("weight"))
                  .map((key, i) => (
                    <tr key={i}>
                      <td>
                        {data[`weight${i}`]}
                        {data[`weight-unilateral${i}`] && (
                          <>-{data[`weight-unilateral${i}`]}</>
                        )}
                      </td>
                      <td>
                        {data[`reps${i}`]}
                        {data[`reps-unilateral${i}`] && (
                          <>-{data[`reps-unilateral${i}`]}</>
                        )}
                      </td>
                      <td>{data[`int${i}`]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </ReactModal>
  );
};

export default ModalCheckPerf;

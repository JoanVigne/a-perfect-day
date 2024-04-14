import React, { use, useEffect, useState } from "react";

interface Props {
  exo: any[];
}

const ExoDisplay: React.FC<Props> = ({ exo }) => {
  return (
    <>
      {exo.map((exercise, index) => {
        const [numberOfSeries, setNumberOfSeries] = useState<number>(3);
        useEffect(() => {
          // if we got previous choice of serie for this exo, set from it
          // setNumberOfSeries(previousTime)
        }, []);
        return (
          <div key={index} className="container-exo">
            <h3>{exercise.name}</h3>
            <h3>equipment: {exercise.equipment}</h3>
            <h3>
              Number of Series:
              <select
                name="series"
                id="series"
                onChange={(e) => setNumberOfSeries(Number(e.target.value))}
                value={numberOfSeries}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </h3>
            {Array.from({ length: numberOfSeries }).map((_, index) => (
              <div className="serie" key={index}>
                <label htmlFor={`weight${index}`}>
                  kg:
                  <input
                    type="number"
                    name={`weight${index}`}
                    id={`weight${index}`}
                  />
                </label>
                <label htmlFor={`reps${index}`}>
                  reps:
                  <input
                    type="number"
                    name={`reps${index}`}
                    id={`reps${index}`}
                  />
                </label>
                <label htmlFor={`interval${index}`}>
                  {index === numberOfSeries - 1 ? "rest" : "int"}:
                  <input
                    type="number"
                    name={`interval${index}`}
                    id={`interval${index}`}
                  />
                </label>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

export default ExoDisplay;

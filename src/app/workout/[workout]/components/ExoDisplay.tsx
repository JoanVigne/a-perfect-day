import Icon from "@/components/Icon";
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
            <h3>
              {exercise.name}{" "}
              <Icon nameImg="modify" onClick={() => console.log("modify")} />
            </h3>
            <h3>equipment: {exercise.equipment}</h3>
            <h3>
              Number of Series: {numberOfSeries}
              <div className="buttonsPlusAndMinus">
                {" "}
                <button
                  onClick={() =>
                    setNumberOfSeries((prevSeries) => prevSeries + 1)
                  }
                >
                  ++
                </button>
                <button
                  onClick={() =>
                    setNumberOfSeries((prevSeries) =>
                      prevSeries > 1 ? prevSeries - 1 : 1
                    )
                  }
                >
                  --
                </button>
              </div>
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

import Icon from "@/components/Icon";
import React, { useEffect, useState } from "react";

interface Props {
  exo: any[];
  onSubmit: (data: any) => void;
}

const ExoDisplay: React.FC<Props> = ({ exo, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});

  const handleInputChange =
    (exerciseId: string, seriesIndex: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prevFormData: any) => {
        const newFormData = { ...prevFormData };
        if (!newFormData[exerciseId]) {
          newFormData[exerciseId] = {
            exoOrder: Object.keys(prevFormData).length,
          };
        }
        newFormData[exerciseId][`${field}${seriesIndex}`] = e.target.value;
        return newFormData;
      });
    };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {exo.map((exercise) => {
        const [numberOfSeries, setNumberOfSeries] = useState<number>(3);
        useEffect(() => {
          // if we got previous choice of serie for this exo, set from it
          // setNumberOfSeries(previousTime)
        }, []);
        return (
          <div key={exercise.id} className="container-exo">
            <h3>
              {exercise.name}{" "}
              <Icon nameImg="modify" onClick={() => console.log("modify")} />
            </h3>
            <h3>equipment: {exercise.equipment}</h3>
            <h3>
              Number of Series: {numberOfSeries}
              <div className="buttonsPlusMinusSeries">
                <button
                  type="button"
                  onClick={() =>
                    setNumberOfSeries((prevSeries) =>
                      prevSeries > 0 ? prevSeries - 1 : 0
                    )
                  }
                >
                  --
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNumberOfSeries((prevSeries) => prevSeries + 1)
                  }
                >
                  ++
                </button>
              </div>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Serie</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>Rest</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numberOfSeries }).map(
                  (_, seriesIndex) => (
                    <tr key={seriesIndex}>
                      <td>{seriesIndex + 1}</td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          name={`weight${seriesIndex}`}
                          id={`weight${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "weight"
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name={`reps${seriesIndex}`}
                          id={`reps${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "reps"
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name={`interval${seriesIndex}`}
                          id={`interval${seriesIndex}`}
                          onChange={handleInputChange(
                            exercise.id,
                            seriesIndex,
                            "int"
                          )}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );
      })}
      <button type="submit">Finish workout</button>
    </form>
  );
};

export default ExoDisplay;

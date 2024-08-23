import Icon from "@/components/ui/Icon";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useState } from "react";
interface Exercice {
  name: string;
  id: string;
  description: string;
}
interface Props {
  exoFromDb: any;
  fetchExoFromDb: () => void;
  exoPerso: any[];
  addPersoExo: () => void;
  exercicesChosen: any[];
  onExerciceCheck: (exo: any, isChecked: boolean) => void;
}
const ContainerExoList: React.FC<Props> = ({
  exoFromDb,
  fetchExoFromDb,
  exoPerso,
  addPersoExo,
  exercicesChosen,
  onExerciceCheck,
}) => {
  return (
    <div className="container-exo-list">
      {/* {Object.values(exoFromDb).length <= 0 && (
        <button type="button" onClick={fetchExoFromDb}>
          See the database exercices
        </button>
      )} */}
      <div className="container-perso-exo">
        {/*  <label htmlFor="persoExercice">Personalyze exercice</label> */}
        <input type="text" name="persoExercice" id="persoExercice" />
        <Icon nameImg="add" onClick={addPersoExo} />
      </div>
      {/*  <ul className="list-exo">
        {exoFromDb &&
          [...Object.values(exoFromDb), ...exoPerso].map(
            (exo: any, index: number) => {
              return (
                <li key={exo.name || index}>
                  <input
                    type="checkbox"
                    name="exercices"
                    id={exo.name || `tempExo${index}`}
                    value={exo.id || `tempExo${index}`}
                    checked={exercicesChosen.some(
                      (chosenExo: any) => chosenExo.id === exo.id
                    )}
                    onChange={(e) => onExerciceCheck(exo, e.target.checked)}
                  />
                  <label htmlFor={exo.name || `tempExo${index}`}>
                    {exo.name || exo}
                  </label>
                </li>
              );
            }
          )}
      </ul> */}
    </div>
  );
};

export default ContainerExoList;

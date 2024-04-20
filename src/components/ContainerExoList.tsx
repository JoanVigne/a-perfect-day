import Icon from "@/components/ui/Icon";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useState } from "react";
interface Exercice {
  name: string;
  id: string;
  description: string;
}
const ContainerExoList = () => {
  const [exoFromDb, setExoFromDb] = useState({});
  // the workout shape :
  //workout =  randomid : { name, description, creation date, exercices: [id,id,id]. }
  const [exoPerso, setExoPerso] = useState<Exercice[]>([]);
  function addPersoExo() {
    const input = document.getElementById("persoExercice") as HTMLInputElement;
    if (input.value) {
      const newExo = {
        name: input.value,
        id: `exoPerso${input.value.replace(/\s+/g, "")}${exoPerso.length}`,
        description: "Exercice created by me",
      };
      setExoPerso((prev) => [...prev, newExo]);
      input.value = "";
    }
  }
  async function fetchExoFromDb() {
    const data = await fetchDataFromDBToLocalStorage("exercices");
    setExoFromDb(data);
  }
  return (
    <div className="container-exo-list">
      {Object.values(exoFromDb).length <= 0 && (
        <button type="button" onClick={fetchExoFromDb}>
          See the database exercices
        </button>
      )}
      <div className="container-perso-exo">
        <label htmlFor="persoExercice">Personalyze exercice</label>
        <input type="text" name="persoExercice" id="persoExercice" />
        <Icon nameImg="add" onClick={addPersoExo} />
      </div>
      <ul className="list-exo">
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
                  />
                  <label htmlFor={exo.name || `tempExo${index}`}>
                    {exo.name || exo}
                  </label>
                </li>
              );
            }
          )}
      </ul>
    </div>
  );
};

export default ContainerExoList;

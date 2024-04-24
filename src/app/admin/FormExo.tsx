import Icon from "@/components/ui/Icon";
import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import React, { useState } from "react";

const FormExo = () => {
  const [exoFromDb, setExoFromDb] = useState([]);
  const [showForm, setShowForm] = useState(false);
  async function fetchExoFromDb() {
    const data = await fetchDataFromDBToLocalStorage("exercices");
    setExoFromDb(data);
  }
  function submitNewExo() {}
  return (
    <div className="smaller-container">
      <h2>Create new exercices into the db :</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "hide form" : "show form"}
      </button>
      {showForm && (
        <form>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description" />
          <label htmlFor="description">Equipment</label>
          <input type="text" name="equipment" id="equipment" />
        </form>
      )}

      <button onClick={fetchExoFromDb}>fetch existing exercices</button>
      <ul className="list-exo">
        {exoFromDb &&
          exoFromDb.map((exo: any, index: number) => {
            const sortKeys = (keys: string[]) => {
              return keys.sort((a, b) => {
                if (a === "name") return -1;
                if (b === "name") return 1;
                if (a === "id") return -1;
                if (b === "id") return 1;
                return a.localeCompare(b);
              });
            };
            return (
              <li key={exo.name || index}>
                {sortKeys(Object.keys(exo)).map((key: any) => {
                  return (
                    <h3 key={key}>
                      {`${key}: ${exo[key]}`}
                      {key === "name" && (
                        <Icon nameImg="delete" onClick={() => {}} />
                      )}
                    </h3>
                  );
                })}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default FormExo;

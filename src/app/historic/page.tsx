"use client";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";
interface UserData {
  email: string;
  uid: string;
}
interface UserInfo {
  nickname: string;
}

const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  // fetch l'historic uniquement ici.
  // localStorage avec date pour savoir si besoin de re-fetch
  // normalement data orga avec UID.
  const [dataHistoric, setDataHistoric] = useState();

  useEffect(() => {
    const inLocalStorage = localStorage.getItem("historic");
    if (inLocalStorage) {
      console.log("in local storage : ", inLocalStorage);
      const localData = JSON.parse(inLocalStorage);
      // verifier toutes les dates
      localData.forEach((element) => {
        console.log(element);
      });

      setDataHistoric(localData);
      return;
    }

    // si historic pas a jour fetch
    if (!inLocalStorage) {
      console.log("pas dans local ");
      fetchHistoric();
    }
  }, []);

  async function fetchHistoric() {
    const { ref, snapShot } = await checkDB("historic", user.uid);
    if (!snapShot.exists()) {
      // Traitez le cas où l'id du user n'existe pas
      console.log("id utilisateur introuvable dans collection historic");
      return;
    }
    const historicData = snapShot.data();
    console.log(historicData);
    setDataHistoric(historicData.data);
  }
  return (
    <>
      <main>
        <h1>historic</h1>
        {dataHistoric &&
          Object.entries(dataHistoric)
            .filter(([key]) => key !== "date") // Filtrer les entrées en excluant la clé "date"
            .map(
              ([key, { name, description, details, count, unit }]: [
                string,
                any
              ]) => (
                <div key={key}>
                  <h2>{name}</h2>
                  <p>{description}</p>
                  <p>{details}</p>
                  <p>{count}</p>
                  <p>{unit === false ? "not done" : "done"}</p>
                </div>
              )
            )}
      </main>
      <Footer />
    </>
  );
};

export default page;

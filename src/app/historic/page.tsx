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
      const localData = JSON.parse(inLocalStorage);
      // verifier toutes les dates du localData
      const dates = Object.entries(localData)
        .filter(([key, value]) => key === "date")
        .map(([key, value]: [string, any]) => value.slice(0, 10));
      const today = new Date().toISOString().slice(0, 10);
      const isTodayInHistoric = dates.includes(today);
      if (isTodayInHistoric === true) {
        console.log("historic dans local deja a jour ! ");
        setDataHistoric(localData);
        return;
      }
      console.log("historic local pas a jour :");
      fetchHistoric();
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
    setDataHistoric(historicData.data);
    localStorage.setItem("historic", JSON.stringify(historicData.data));
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

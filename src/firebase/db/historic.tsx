import { setDoc } from "firebase/firestore";
import { checkDB } from "./db";

interface Task {
  unit: boolean | string;
  details: string;
  description: string;
  count: number | string;
  name: string;
  id: string;
}
interface DataObject {
  date: string;
  [key: string]: Task | any;
}
interface HistoricData {
  [activityId: string]: Task | any;
}

interface Historic {
  [date: string]: HistoricData;
}

const sendToHistoric = async (data: DataObject, userId: string) => {
  const { ref, snapShot } = await checkDB("historic", userId);
  if (!snapShot.exists()) {
    await setDoc(ref, {});
  }
  const historicData = snapShot.data();

  if (!historicData) {
    return;
  }
  // verifie si deja dans historic
  const historicDataDate = historicData.date?.substring(0, 10);
  const dataDate = data.date.substring(0, 10);
  if (historicDataDate === dataDate) {
    return console.log("pareil");
  }
  const copieData = { ...data };

  Object.keys(copieData).forEach((key) => {
    const ele = copieData[key];
    if (
      ele.unit === false ||
      (typeof ele.unit !== "boolean" && (ele.count === "0" || ele.count === 0))
    ) {
      delete copieData[key];
    }
  });

  if (Object.keys(copieData).length === 1 && data.hasOwnProperty("date")) {
    return console.log(
      "ne contient que la date, donc pas envoyé à l'historic."
    );
  }

  const updatedData = {
    ...historicData,
    [copieData.date.substring(0, 10)]: {
      ...copieData,
    },
  };

  await setDoc(ref, updatedData);
  localStorage.setItem("historic", JSON.stringify(updatedData));
  console.log("historic est mis a jour");
  return "Data sent to historic DB";
};

const updateHistoric = async (updatedData: DataObject, userId: string) => {
  const { ref, snapShot } = await checkDB("historic", userId);
  if (!snapShot.exists()) {
    console.log("L'historique n'existe pas pour cet utilisateur.");
    return;
  }

  const historicData = snapShot.data();
  if (!historicData) {
    console.log("Erreur lors de la récupération des données historiques.");
    return;
  }

  const historicDataDate = historicData.date?.substring(0, 10);
  const updatedDataDate = updatedData.date.substring(0, 10);

  if (historicDataDate !== updatedDataDate) {
    console.log("La date spécifiée n'existe pas dans l'historique.");
    return;
  }

  const updatedHistoric = {
    ...historicData,
    [updatedDataDate]: {
      ...updatedData,
    },
  };

  console.log("updated DATA : ", updatedHistoric);
  return;

  await setDoc(ref, updatedHistoric);
  localStorage.setItem("historic", JSON.stringify(updatedHistoric));
  console.log(
    "Historique mis à jour pour la date spécifiée :",
    updatedDataDate
  );
};
async function updateOneDay(day: any, userId: string) {
  // a faire
}
async function updateAllHistoric(data: Historic, userId: string) {
  console.log("LES DATA DANS UPDATEDALLHISTORIC: ", data);
  return;
  // any a changer
  const { ref, snapShot } = await checkDB("historic", userId);
  if (!snapShot.exists()) {
    console.log("L'historique n'existe pas pour cet utilisateur.");
    return;
  }
  await setDoc(ref, data);
  localStorage.setItem("historic", JSON.stringify(data));
  return "Data sent to historic DB";
}
export { sendToHistoric, updateAllHistoric };

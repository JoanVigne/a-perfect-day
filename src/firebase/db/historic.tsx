import { setDoc } from "firebase/firestore";
import { checkDB } from "./db";

interface DataObject {
  date: string;
  [key: string]: any;
}
const sendToHistoric = async (data: DataObject, userId: string) => {
  const { ref, snapShot } = await checkDB("historic", userId);

  if (!snapShot.exists()) {
    // Traitez le cas où l'id du user n'existe pas
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
    console.log("pareil");
    return;
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

  const updatedData = {
    ...historicData,
    [copieData.date.substring(0, 10)]: {
      ...copieData,
    },
  };

  await setDoc(ref, updatedData);
  localStorage.setItem("historic", JSON.stringify(updatedData));
  console.log("historic est mis a jour");
};

export { sendToHistoric };

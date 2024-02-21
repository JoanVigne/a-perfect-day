import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();

// fonction reutilisable pour voir certaines collections :
const checkDB = async (dbName: string, userId: string) => {
  const ref = doc(db, dbName, userId);
  const snapShot = await getDoc(ref);
  return { ref, snapShot };
};

const sendToHistoric = async (data: object, userId: string) => {
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
  const historicDataData = historicData.data["date"].substring(0, 10);
  const dataDate = data.date.substring(0, 10);
  if (historicDataData === dataDate) {
    console.log("pareil");
    return;
  }

  const newData = { ...historicData, data };
  await setDoc(ref, newData);
  localStorage.setItem("historic", JSON.stringify(newData));
  console.log("historic est mis a jour");
};

export { sendToHistoric, checkDB };

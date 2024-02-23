import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();

// fonction reutilisable pour voir certaines collections :
const checkDB = async (dbName: string, userId: string) => {
  const ref = doc(db, dbName, userId);
  const snapShot = await getDoc(ref);
  return { ref, snapShot };
};

interface DataObject {
  date: string;
  [key: string]: any;
}

interface DataCustom {
  [key: string]: any;
}

const sendToCustom = async (data: DataCustom, userId: string) => {
  const { ref, snapShot } = await checkDB("custom", userId);
  if (!snapShot.exists()) {
    // Traitez le cas où l'id du user n'existe pas
    await setDoc(ref, {});
  }
  const customData = snapShot.data();
  if (!customData) {
    return;
  }
  let alreadyInDB = false;
  Object.values(customData).map((ele) => {
    console.log("ele : ", ele);
    if (data.name === ele.name) {
      console.log("Ce nom est deja pris");
      alreadyInDB = true;
    }
  });

  if (alreadyInDB) {
    console.log("Ce nom est deja pris");
    return;
  }

  const updatedData = {
    ...customData,
    [data.id]: {
      ...data,
    },
  };
  console.log(updatedData);
  await setDoc(ref, updatedData);
  localStorage.setItem("custom", JSON.stringify(updatedData));
  console.log("custom est mis a jour");
};

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

  const updatedData = {
    ...historicData,
    [data.date.substring(0, 10)]: {
      ...data,
    },
  };
  console.log(updatedData);
  await setDoc(ref, updatedData);
  localStorage.setItem("historic", JSON.stringify(updatedData));
  console.log("historic est mis a jour");
};

export { sendToHistoric, checkDB, sendToCustom };

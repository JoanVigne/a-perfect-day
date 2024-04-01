import { doc, setDoc } from "firebase/firestore";
import { checkDB, db } from "./db";

interface DataCustom {
  [key: string]: any;
}

const sendToChall = async (data: DataCustom, userId: string) => {
  const { ref, snapShot } = await checkDB("customChall", userId);
  if (!snapShot.exists()) {
    // Traitez le cas où l'id du user n'existe pas
    const customRef = doc(db, "customChall", userId);
    await setDoc(customRef, {});
  }
  const customData = snapShot.data();
  let updatedData = {};
  if (!customData) {
    updatedData = { [data.id]: { ...data } };
  }
  if (customData) {
    let alreadyInDB = false;
    Object.values(customData).map((ele) => {
      if (data.name === ele.name) {
        console.log("Ce nom est deja pris");
        alreadyInDB = true;
      }
    });
    if (alreadyInDB) {
      console.log("Ce nom est deja pris");
      return;
    }
    updatedData = {
      ...customData,
      [data.id]: {
        ...data,
      },
    };
  }
  console.log(updatedData);
  await setDoc(ref, updatedData);
  localStorage.setItem("customChall", JSON.stringify(updatedData));
  console.log("customChall est mis a jour");
};
const removeFromChall = async (data: any, userId: string) => {
  try {
    const { ref, snapShot } = await checkDB("customChall", userId);
    if (!snapShot.exists()) {
      console.log("User ID not found in database");
      return "User ID not found in database";
    }
    const customData = snapShot.data();
    if (!customData) {
      console.log("Custom data not found in database");
      return "Custom data not found in database";
    }

    await setDoc(ref, data);
    localStorage.setItem("customChall", JSON.stringify(data));
    return "Challenge removed";
  } catch (error) {
    console.error("Error removing custom Chall:", error);
    return "Error removing custom Chall";
  }
};
export { sendToChall, removeFromChall };

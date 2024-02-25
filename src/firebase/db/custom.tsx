import { setDoc } from "firebase/firestore";
import { checkDB } from "./db";

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
const removeFromCustom = async (data: any, userId: string) => {
  try {
    const { ref, snapShot } = await checkDB("custom", userId);
    if (!snapShot.exists()) {
      console.log("User ID not found in database");
      return;
    }
    const customData = snapShot.data();
    if (!customData) {
      console.log("Custom data not found in database");
      return;
    }

    await setDoc(ref, data);
    localStorage.setItem("custom", JSON.stringify(data));
    console.log("Custom task removed successfully");
  } catch (error) {
    console.error("Error removing custom task:", error);
  }
};
export { sendToCustom, removeFromCustom };
